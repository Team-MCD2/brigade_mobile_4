import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { category, brand, model, repairs, pickup, pickupFee, date, slot, contact } = data;

    const total = repairs.reduce((acc: number, r: { price: number }) => acc + r.price, 0) + pickupFee;

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    const mailTo = import.meta.env.MAIL_TO || 'contact@reparephone-toulouse.fr';

    const emailBody = `
NOUVELLE DEMANDE DE DEVIS - La Brigade Mobile
================================================

CLIENT
------
Nom : ${contact.name}
Email : ${contact.email}
Téléphone : ${contact.phone}
${contact.address ? `Adresse : ${contact.address}` : ''}

APPAREIL
--------
Catégorie : ${category}
Marque : ${brand}
Modèle : ${model}

PANNES
------
${repairs.map((r: { label: string; price: number }) => `- ${r.label} (${r.price}€)`).join('\n')}

PRISE EN CHARGE
---------------
Mode : ${pickup}
Frais : +${pickupFee}€

RENDEZ-VOUS
------------
Date : ${date}
Créneau : ${slot}

TOTAL ESTIMÉ : ${total}€ TTC
================================================
    `;

    // Notification admin
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [mailTo],
      replyTo: contact.email,
      subject: `[DEVIS] ${brand} ${model} - ${contact.name}`,
      text: emailBody,
    });

    // Confirmation au client
    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [contact.email],
      subject: `Votre demande de devis - La Brigade Mobile`,
      text: `Bonjour ${contact.name},\n\nNous avons bien reçu votre demande de devis pour la réparation de votre ${brand} ${model}.\n\nEstimation : ${total}€ TTC\nRendez-vous : ${date} à ${slot}\n\nUn expert vous recontactera sous 2h pour confirmer votre rendez-vous.\n\nCordialement,\nL'équipe La Brigade Mobile\n07 56 91 65 93`,
    });

    return new Response(JSON.stringify({ success: true, message: 'Devis envoyé avec succès' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur envoi devis:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
