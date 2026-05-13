import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ success: false, message: 'Champs obligatoires manquants' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    const mailTo = import.meta.env.MAIL_TO || 'contact@reparephone-toulouse.fr';

    const emailBody = `
NOUVEAU MESSAGE DE CONTACT - La Brigade Mobile
================================================

Nom : ${name}
Email : ${email}
Téléphone : ${phone || 'Non renseigné'}
Sujet : ${subject || 'Général'}

MESSAGE
-------
${message}

================================================
    `;

    // Notification admin
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [mailTo],
      replyTo: email,
      subject: `[CONTACT] ${subject || 'Nouveau message'} - ${name}`,
      text: emailBody,
    });

    // Confirmation au client
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [email],
      subject: `Message bien reçu - La Brigade Mobile`,
      text: `Bonjour ${name},\n\nNous avons bien reçu votre message et nous vous répondrons sous 24h.\n\nCordialement,\nL'équipe La Brigade Mobile\n07 56 91 65 93`,
    });

    return new Response(JSON.stringify({ success: true, message: 'Message envoyé avec succès' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur envoi contact:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
