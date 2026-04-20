-- Module auth : index sur préférences utilisateur

CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences (user);
