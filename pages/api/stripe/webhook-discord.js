/**
 * API Route: /api/stripe/webhook-discord
 * Description: Webhook Stripe pour les abonnements Discord
 * Gère: création, renouvellement, échec paiement, annulation
 * Assigne/retire automatiquement les rôles Discord
 * 
 * IMPORTANT: Ce webhook est SÉPARÉ du webhook existant pour les licences Mindset
 * Il ne touche PAS à la table `licenses`
 */

import Stripe from 'stripe';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { assignDiscordRole, removeAllMindsetRoles } from '../../../lib/discordBot';

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_DISCORD; // Nouveau secret séparé
  
  if (!stripeSecretKey || !webhookSecret) {
    console.error('❌ Configuration Stripe webhook Discord incomplète');
    return res.status(500).send('Server not configured');
  }

  if (!supabaseAdmin) return res.status(500).send('Server auth not configured');

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Erreur signature webhook Discord:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // ============================================
      // NOUVEAU ABONNEMENT DISCORD
      // ============================================
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscriptionId = session.subscription;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const plan = session.metadata?.plan; // 'discord_only' ou 'discord_mindset'

        if (!plan || !['discord_only', 'discord_mindset'].includes(plan)) {
          console.log('⚠️ Ce checkout n\'est pas pour un membership Discord, ignoré');
          break;
        }

        console.log(`✅ Nouveau membership Discord: ${plan} - ${customerEmail}`);

        // Calculer la date d'expiration (30 jours pour les deux plans mensuels)
        const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Créer le membership Discord
        const { data: membership, error: createError } = await supabaseAdmin
          .from('discord_memberships')
          .insert({
            user_email: customerEmail,
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_plan: plan,
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: expirationDate.toISOString(),
            has_discord_access: true,
            has_mindset_access: plan === 'discord_mindset', // true si bundle
          })
          .select('*')
          .single();

        if (createError) {
          console.error('❌ Erreur création membership Discord:', createError);
          throw createError;
        }

        console.log(`✅ Membership Discord créé: ${membership.id} - ${plan}`);

        // Si bundle (discord_mindset), créer aussi une licence Mindset
        if (plan === 'discord_mindset') {
          // Trouver ou créer le client
          let clientId = null;
          const { data: existingClient } = await supabaseAdmin
            .from('clients')
            .select('id')
            .eq('email', customerEmail)
            .maybeSingle();

          if (existingClient?.id) {
            clientId = existingClient.id;
          } else {
            const { data: newClient } = await supabaseAdmin
              .from('clients')
              .insert({ email: customerEmail, created_at: new Date().toISOString() })
              .select('id')
              .single();
            clientId = newClient.id;
          }

          // Créer la licence Mindset
          const { data: license, error: licenseError } = await supabaseAdmin
            .from('licenses')
            .insert({
              license_key: `LIC-${Math.random().toString(36).slice(2, 10).toUpperCase()}-${Date.now()}`,
              client_id: clientId,
              subscription_id: subscriptionId,
              plan: 'discord_mindset',
              status: 'active',
              is_active: true,
              activated_at: new Date().toISOString(),
              expires_at: expirationDate.toISOString(),
              discord_membership_id: membership.id, // Lien avec le membership Discord
            })
            .select('*')
            .single();

          if (licenseError) {
            console.error('❌ Erreur création licence Mindset pour bundle:', licenseError);
          } else {
            console.log(`✅ Licence Mindset créée pour bundle: ${license.license_key}`);
          }
        }

        // TODO: Envoyer email de bienvenue avec instructions pour lier Discord
        console.log(`📧 TODO: Envoyer email de bienvenue à ${customerEmail}`);

        break;
      }

      // ============================================
      // RENOUVELLEMENT RÉUSSI
      // ============================================
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        // Trouver le membership
        const { data: membership, error: findError } = await supabaseAdmin
          .from('discord_memberships')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle();

        if (findError || !membership) {
          console.log('⚠️ Membership Discord non trouvé pour cette souscription');
          break;
        }

        // Prolonger de 30 jours
        const currentExpiry = new Date(membership.subscription_ends_at || Date.now());
        const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);

        await supabaseAdmin
          .from('discord_memberships')
          .update({
            subscription_status: 'active',
            subscription_ends_at: newExpiry.toISOString(),
          })
          .eq('id', membership.id);

        console.log(`✅ Membership Discord renouvelé: ${membership.user_email} jusqu'au ${newExpiry.toISOString()}`);

        // Si Discord lié, s'assurer que le rôle est actif
        if (membership.discord_user_id) {
          const roleType = membership.subscription_plan === 'discord_mindset' 
            ? 'mindset_member' 
            : 'member';
          
          try {
            await assignDiscordRole(membership.discord_user_id, roleType);
          } catch (err) {
            console.error('❌ Erreur réassignation rôle Discord:', err);
          }
        }

        // Si bundle, prolonger aussi la licence Mindset
        if (membership.has_mindset_access) {
          const { data: license } = await supabaseAdmin
            .from('licenses')
            .select('*')
            .eq('subscription_id', subscriptionId)
            .maybeSingle();

          if (license) {
            const licenseExpiry = new Date(license.expires_at || Date.now());
            const newLicenseExpiry = new Date(licenseExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);

            await supabaseAdmin
              .from('licenses')
              .update({
                expires_at: newLicenseExpiry.toISOString(),
                status: 'active',
                is_active: true,
              })
              .eq('id', license.id);

            console.log(`✅ Licence Mindset renouvelée: ${license.license_key}`);
          }
        }

        break;
      }

      // ============================================
      // ÉCHEC DE PAIEMENT
      // ============================================
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const { data: membership } = await supabaseAdmin
          .from('discord_memberships')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle();

        if (!membership) break;

        // Mettre en statut past_due
        await supabaseAdmin
          .from('discord_memberships')
          .update({
            subscription_status: 'past_due',
            has_discord_access: false,
            has_mindset_access: false,
          })
          .eq('id', membership.id);

        console.log(`⚠️ Membership Discord suspendu (échec paiement): ${membership.user_email}`);

        // Retirer les rôles Discord
        if (membership.discord_user_id) {
          try {
            await removeAllMindsetRoles(membership.discord_user_id);
          } catch (err) {
            console.error('❌ Erreur retrait rôles Discord:', err);
          }
        }

        // Si bundle, désactiver aussi la licence Mindset
        if (membership.subscription_plan === 'discord_mindset') {
          await supabaseAdmin
            .from('licenses')
            .update({
              status: 'payment_failed',
              is_active: false,
            })
            .eq('subscription_id', subscriptionId);

          console.log(`⚠️ Licence Mindset désactivée (échec paiement)`);
        }

        break;
      }

      // ============================================
      // ANNULATION ABONNEMENT
      // ============================================
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        const { data: membership } = await supabaseAdmin
          .from('discord_memberships')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle();

        if (!membership) break;

        // Annuler le membership
        await supabaseAdmin
          .from('discord_memberships')
          .update({
            subscription_status: 'cancelled',
            has_discord_access: false,
            has_mindset_access: false,
          })
          .eq('id', membership.id);

        console.log(`⛔ Membership Discord annulé: ${membership.user_email}`);

        // Retirer tous les rôles Discord
        if (membership.discord_user_id) {
          try {
            await removeAllMindsetRoles(membership.discord_user_id);
          } catch (err) {
            console.error('❌ Erreur retrait rôles Discord:', err);
          }
        }

        // Si bundle, désactiver la licence Mindset
        if (membership.subscription_plan === 'discord_mindset') {
          await supabaseAdmin
            .from('licenses')
            .update({
              status: 'cancelled',
              is_active: false,
            })
            .eq('subscription_id', subscriptionId);

          console.log(`⛔ Licence Mindset désactivée (annulation)`);
        }

        break;
      }

      default:
        console.log(`⚠️ Event type non géré: ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (e) {
    console.error('❌ Erreur webhook Discord:', e);
    res.status(500).send(e.message || 'Server error');
  }
}

