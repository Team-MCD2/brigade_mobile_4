import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { product, price, customerEmail, customerName } = data;

    if (!product || !customerEmail || !customerName) {
      return new Response(JSON.stringify({ success: false, message: 'Champs obligatoires manquants' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    const mailTo = import.meta.env.MAIL_TO || 'contact@reparephone-toulouse.fr';

    const emailBody = `
NOUVELLE COMMANDE LOGICIEL - La Brigade Mobile
================================================

Client : ${customerName}
Email : ${customerEmail}

Produit : ${product}
Prix : ${price}

ACTION REQUISE : Envoyer la clé d'activation au client.
================================================
    `;

    // Notification admin
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [mailTo],
      subject: `[COMMANDE] ${product} - ${customerName}`,
      text: emailBody,
    });

    // Confirmation au client
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [customerEmail],
      subject: `Commande confirmée - ${product}`,
      text: `Bonjour ${customerName},\n\nVotre commande "${product}" (${price}) a été enregistrée.\n\nVous recevrez votre clé d'activation par email sous 15 minutes.\n\nPour toute question : 07 56 91 65 93\n\nCordialement,\nL'équipe La Brigade Mobile`,
    });

    return new Response(JSON.stringify({ success: true, message: 'Commande enregistrée' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur commande:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
