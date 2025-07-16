import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AES-256-CBC decryption function
async function decryptData(encryptedData: string, key: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const keyBytes = encoder.encode(key.slice(0, 32).padEnd(32, '0'));
    
    // Decode base64
    const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    
    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    
    // Decrypt data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set the auth token for the client
    supabaseClient.auth.setSession({
      access_token: authorization.replace('Bearer ', ''),
      refresh_token: ''
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user is admin (user.id === '000')
    if (user.id !== '000') {
      return new Response(JSON.stringify({ error: 'Access denied: Admin privileges required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { lead_id } = await req.json();

    if (!lead_id) {
      return new Response(JSON.stringify({ error: 'Lead ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch encrypted financial data
    const { data: leadData, error: fetchError } = await supabaseClient
      .from('leads')
      .select('price_quote_encrypted, gst_encrypted, fd_encrypted, ad_encrypted, name')
      .eq('id', lead_id)
      .single();

    if (fetchError || !leadData) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { price_quote_encrypted, gst_encrypted, fd_encrypted, ad_encrypted } = leadData;

    if (!price_quote_encrypted || !gst_encrypted || !fd_encrypted || !ad_encrypted) {
      return new Response(JSON.stringify({ error: 'No encrypted financial data found for this lead' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const encryptionKey = Deno.env.get('FINANCIAL_ENCRYPTION_KEY');
    if (!encryptionKey) {
      return new Response(JSON.stringify({ error: 'Encryption key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt financial fields
    const priceQuote = await decryptData(price_quote_encrypted, encryptionKey);
    const gst = await decryptData(gst_encrypted, encryptionKey);
    const fd = await decryptData(fd_encrypted, encryptionKey);
    const ad = await decryptData(ad_encrypted, encryptionKey);

    console.log(`Financial data decrypted for lead ${lead_id} by admin user ${user.id}`);

    return new Response(JSON.stringify({
      success: true,
      lead_id,
      lead_name: leadData.name,
      financial_data: {
        price_quote: priceQuote,
        gst: gst,
        fd: fd,
        ad: ad
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in decrypt-financial function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});