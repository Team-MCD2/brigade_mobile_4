import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''; // Utilise la clé fournie

export const supabase = createClient(supabaseUrl, supabaseKey);


