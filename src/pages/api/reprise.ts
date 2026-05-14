import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { device, client, estimatedPrice } = data;

    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const from = import.meta.env.MAIL_FROM || 'onboarding@resend.dev';
    const mailTo = import.meta.env.MAIL_TO || 'contact@reparephone-toulouse.fr';

    // 1. Sauvegarde en Base de Données (Supabase)
    let dbSuccess = false;
    try {
      if (import.meta.env.PUBLIC_SUPABASE_URL) {
        const { error } = await supabase
          .from('reprises')
          .insert([{
            device_name: device.name,
            brand: device.brand,
            storage: device.storage,
            color: device.color,
            estimated_price: estimatedPrice,
            client_name: client.name,
            client_email: client.email,
            client_phone: client.phone,
            client_city: client.city,
            status: 'pending',
            created_at: new Date().toISOString()
          }]);
        
        if (!error) dbSuccess = true;
        else console.error('Supabase error:', error);
      }
    } catch (e) {
      console.warn('DB error, continuing with email:', e);
    }


    // 2. Notification Email (RESEND) - RÉELLE
    const emailBody = `
NOUVELLE DEMANDE DE REPRISE - La Brigade Mobile
================================================

APPAREIL :
- Modèle : ${device.name}
- Marque : ${device.brand}
- Stockage : ${device.storage}
- Couleur : ${device.color}
- Estimation : ${estimatedPrice} €

CLIENT :
- Nom : ${client.name}
- Email : ${client.email}
- Tel : ${client.phone}
- Ville : ${client.city}

Lien Dashboard : http://localhost:4321/dashboard
================================================
    `;

    await resend.emails.send({
      from: `La Brigade Mobile <${from}>`,
      to: [mailTo],
      subject: `[REPRISE] ${device.name} - ${client.name}`,
      text: emailBody,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Demande enregistrée et email envoyé',
      db: dbSuccess ? 'ok' : 'pending'
    }), {
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
