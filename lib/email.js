import nodemailer from 'nodemailer';

export function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

  if (!host || !user || !pass) {
    throw new Error('SMTP not configured');
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export async function sendDownloadEmail({ to, token, siteUrl, licenseKey, invoiceUrl }) {
  const transporter = createTransport();
  const downloadUrl = `${siteUrl.replace(/\/$/, '')}/api/download?token=${encodeURIComponent(token)}`;

  const from = process.env.SMTP_FROM || 'Mindset <no-reply@mindset.local>';

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111">
      <h2>Merci pour votre achat !</h2>
      
      <div style="background:#FEF3C7;border:2px solid #F59E0B;border-radius:8px;padding:16px;margin:20px 0">
        <h3 style="margin:0 0 8px 0;color:#92400E">🔑 Votre clé de licence</h3>
        <p style="font-size:18px;font-weight:bold;color:#92400E;margin:8px 0;font-family:monospace">${licenseKey}</p>
        <p style="font-size:12px;color:#78350F;margin:8px 0">Copiez cette clé et gardez-la en lieu sûr. Vous en aurez besoin pour activer le programme.</p>
      </div>

      <h3>📥 Téléchargement du programme</h3>
      <p>Téléchargez le programme avec le lien ci-dessous (valide 6 mois) :</p>
      <p><a href="${downloadUrl}" style="background:#F59E0B;color:#111;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Télécharger Mindset – Alert Strategy</a></p>
      <p style="font-size:14px;color:#666">Si le bouton ne fonctionne pas, utilisez ce lien direct:<br/>
        <a href="${downloadUrl}" style="color:#F59E0B;word-break:break-all">${downloadUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>

      <h3>📋 Instructions d'installation</h3>
      <ol style="line-height:1.8">
        <li>Téléchargez et installez le programme</li>
        <li>Lancez le programme</li>
        <li>Entrez votre clé de licence : <strong style="font-family:monospace">${licenseKey}</strong></li>
        <li>Le programme s'activera automatiquement</li>
      </ol>

      <p style="font-size:12px;color:#666;margin-top:24px">
        <strong>Note importante :</strong> Votre licence est limitée à 1 appareil. Pour changer d'appareil, désactivez d'abord depuis l'appareil actuel.
      </p>

      ${invoiceUrl ? `
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
      
      <h3>📄 Facture</h3>
      <p>Téléchargez votre reçu officiel :</p>
      <p><a href="${invoiceUrl}" style="background:#10B981;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Télécharger la facture PDF</a></p>
      ` : ''}

      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
      
      <p style="font-size:12px;color:#999">
        Besoin d'aide ? Contactez-nous à <a href="mailto:mindsetalertstrategy@hotmail.com" style="color:#F59E0B">mindsetalertstrategy@hotmail.com</a>
      </p>
    </div>
  `;

  await transporter.sendMail({ to, from, subject: '🔑 Votre licence et téléchargement Mindset – Alert Strategy', html });
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM || 'Mindset <no-reply@mindset.local>';

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}





