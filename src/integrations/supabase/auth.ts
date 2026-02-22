// supabase/auth.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signIn = async (email, password) => {
    const { user, session, error } = await supabase.auth.signIn({ email, password });
    return { user, session, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const signUp = async (email, password) => {
    const { user, session, error } = await supabase.auth.signUp({ email, password });
    return { user, session, error };
};
