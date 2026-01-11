import { NextResponse } from 'next/server';

export function middleware(request) {
  // Si pas de mot de passe dÃ©fini, laisser passer (site public)
  const sitePassword = process.env.SITE_CONSTRUCTION_PASSWORD;
  if (!sitePassword) {
    return NextResponse.next();
  }

  // VÃ©rifier si le client a dÃ©jÃ  envoyÃ© le bon mot de passe
  const authHeader = request.headers.get('authorization');
  
  if (authHeader) {
    const [type, credentials] = authHeader.split(' ');
    if (type === 'Basic') {
      const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
      const [username, password] = decoded.split(':');
      
      // VÃ©rifier le mot de passe (username peut Ãªtre n'importe quoi)
      if (password === sitePassword) {
        return NextResponse.next();
      }
    }
  }

  // Mot de passe incorrect ou manquant â†’ demander l'authentification
  return new NextResponse('AccÃ¨s restreint - Site en construction', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Site en construction"',
    },
  });
}

// Appliquer le middleware Ã  toutes les pages sauf les API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)',
  ],
};
