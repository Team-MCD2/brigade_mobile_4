import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { brand, model, capacity, color, condition, details, finalPrice, marketPrice } = data;

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    const mailTo = import.meta.env.MAIL_TO || 'contact@reparephone-toulouse.fr';

    const emailBody = `
NOUVELLE DEMANDE DE REPRISE - La Brigade Mobile
================================================

APPAREIL
--------
Marque : ${brand}
Modèle : ${model}
Capacité : ${capacity}
Couleur : ${color}
État : ${condition}

DÉTAILS
-------
Batterie remplacée : ${details.batteryChanged ? 'Oui' : 'Non'}
Écran original : ${details.screenOriginal ? 'Oui' : 'Non'}
Face ID / Touch ID : ${details.biometricWorks ? 'Fonctionnel' : 'HS'}
Débloqué opérateur : ${details.unlocked ? 'Oui' : 'Non'}
Chargeur inclus : ${details.hasCharger ? 'Oui' : 'Non'}
Boîte incluse : ${details.hasBox ? 'Oui' : 'Non'}

ESTIMATION
----------
Prix marché neuf : ${marketPrice}€
Prix de reprise proposé : ${finalPrice}€

================================================
    `;

    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [mailTo],
      subject: `[REPRISE] ${brand} ${model} ${capacity} — ${finalPrice}€`,
      text: emailBody,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur reprise:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
