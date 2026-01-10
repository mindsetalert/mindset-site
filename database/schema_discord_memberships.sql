-- ============================================
-- TABLE: discord_memberships
-- Description: Gère les abonnements Discord (25$/mois et 40$/mois)
-- ============================================

CREATE TABLE discord_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User info
  user_email TEXT NOT NULL UNIQUE,
  user_name TEXT,
  
  -- Stripe info
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  
  -- Subscription details
  subscription_status TEXT DEFAULT 'inactive', 
  -- Valeurs possibles: active, inactive, cancelled, past_due, trialing
  
  subscription_plan TEXT NOT NULL,
  -- Valeurs: 'discord_only' (25$/mois) ou 'discord_mindset' (40$/mois)
  
  subscription_started_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  
  -- Discord linking
  discord_user_id TEXT UNIQUE,
  discord_username TEXT,
  discord_discriminator TEXT,
  discord_avatar TEXT,
  discord_linked_at TIMESTAMP,
  
  -- Features flags
  has_discord_access BOOLEAN DEFAULT FALSE,
  has_mindset_access BOOLEAN DEFAULT FALSE,
  has_ea_addon BOOLEAN DEFAULT FALSE,
  
  -- EA add-on (optionnel)
  ea_purchase_date TIMESTAMP,
  ea_stripe_payment_id TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES pour performances
-- ============================================

CREATE INDEX idx_discord_memberships_email ON discord_memberships(user_email);
CREATE INDEX idx_discord_memberships_stripe_sub ON discord_memberships(stripe_subscription_id);
CREATE INDEX idx_discord_memberships_discord_id ON discord_memberships(discord_user_id);
CREATE INDEX idx_discord_memberships_status ON discord_memberships(subscription_status);
CREATE INDEX idx_discord_memberships_plan ON discord_memberships(subscription_plan);

-- ============================================
-- TRIGGER pour updated_at automatique
-- ============================================

CREATE OR REPLACE FUNCTION update_discord_memberships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discord_memberships_updated_at
  BEFORE UPDATE ON discord_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_discord_memberships_updated_at();

-- ============================================
-- LIAISON avec table licenses existante
-- ============================================

-- Ajouter colonne optionnelle dans licenses pour lier au membership Discord
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS discord_membership_id UUID REFERENCES discord_memberships(id);

-- ============================================
-- EXEMPLES DE REQUÊTES UTILES
-- ============================================

-- Compter les membres actifs par plan
-- SELECT subscription_plan, COUNT(*) FROM discord_memberships WHERE subscription_status = 'active' GROUP BY subscription_plan;

-- Trouver les membres Discord sans compte lié
-- SELECT * FROM discord_memberships WHERE subscription_status = 'active' AND discord_user_id IS NULL;

-- Trouver les abonnements expirés
-- SELECT * FROM discord_memberships WHERE subscription_ends_at < NOW() AND subscription_status = 'active';

