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

export async function sendDownloadEmail({ to, token, siteUrl }) {
  const transporter = createTransport();
  const downloadUrl = `${siteUrl.replace(/\/$/, '')}/api/download?token=${encodeURIComponent(token)}`;

  const from = process.env.SMTP_FROM || 'Mindset <no-reply@mindset.local>';

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111">
      <h2>Merci pour votre achat</h2>
      <p>Votre licence est active. Téléchargez le programme avec le lien ci-dessous (valide 6 mois) :</p>
      <p><a href="${downloadUrl}" style="background:#F59E0B;color:#111;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">Télécharger Mindset – Alert Strategy</a></p>
      <p>Si le bouton ne fonctionne pas, utilisez ce lien direct:<br/>
        <a href="${downloadUrl}">${downloadUrl}</a>
      </p>
      <hr/>
      <p style="font-size:12px;color:#666">Ce lien expirera automatiquement. Vous pouvez en régénérer un depuis votre compte.</p>
    </div>
  `;

  await transporter.sendMail({ to, from, subject: 'Votre téléchargement Mindset – Alert Strategy', html });
}





