// Fonction pour traduire les messages d'erreur de Supabase
export function translateError(errorMessage, t) {
  if (!errorMessage) return '';
  
  const message = errorMessage.toLowerCase();
  
  // Traduire les erreurs courantes de Supabase
  if (message.includes('email not confirmed')) {
    return t('errors.emailNotConfirmed');
  }
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return t('errors.invalidCredentials');
  }
  if (message.includes('user already registered') || message.includes('already exists')) {
    return t('errors.userAlreadyExists');
  }
  if (message.includes('password') && (message.includes('weak') || message.includes('short'))) {
    return t('errors.weakPassword');
  }
  if (message.includes('invalid email')) {
    return t('errors.invalidEmail');
  }
  
  // Si pas de traduction trouvée, retourner le message original
  return errorMessage;
}

