import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'getRequests') {
      const { data, error } = await supabase.from('reprises').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (action === 'getNotes') {
      const repriseId = url.searchParams.get('id');
      const { data, error } = await supabase.from('notes').select('*').eq('reprise_id', repriseId).order('created_at', { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (action === 'getMessages') {
      const email = url.searchParams.get('email');
      const { data, error } = await supabase.from('messages').select('*').eq('client_email', email).order('created_at', { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200 });
    }

    return new Response('Action not found', { status: 404 });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const action = formData.get('action');
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;

    if (action === 'uploadPhoto' && file) {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `photos/${email}/${filename}`;
      const buffer = await file.arrayBuffer();

      const { data, error } = await supabase.storage
        .from('reprises')
        .upload(filePath, buffer, { contentType: file.type });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('reprises').getPublicUrl(filePath);
      return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
    }
  }

  const data = await request.json();
  const { action, payload } = data;


  try {
    if (action === 'updateStatus') {
      await supabase.from('reprises').update({ status: payload.status }).eq('id', payload.id);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'addNote') {
      await supabase.from('notes').insert([payload]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'sendMessage') {
      await supabase.from('messages').insert([payload]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response('Action not found', { status: 404 });
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
};
