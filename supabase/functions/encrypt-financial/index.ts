import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AES-256-CBC encryption function
async function encryptData(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key.slice(0, 32).padEnd(32, '0'));
  const dataBytes = encoder.encode(data);
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(16));
  
  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );
  
  // Encrypt data
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    cryptoKey,
    dataBytes
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
}

// SHA-256 hash function
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    const { price_quote, gst, fd, ad, lead_id } = await req.json();

    if (!price_quote || !gst || !fd || !ad || !lead_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
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

    // Encrypt financial fields
    const priceQuoteEncrypted = await encryptData(price_quote.toString(), encryptionKey);
    const gstEncrypted = await encryptData(gst.toString(), encryptionKey);
    const fdEncrypted = await encryptData(fd.toString(), encryptionKey);
    const adEncrypted = await encryptData(ad.toString(), encryptionKey);

    // Update leads table with encrypted values
    const { error: updateError } = await supabaseClient
      .from('leads')
      .update({
        price_quote_encrypted: priceQuoteEncrypted,
        gst_encrypted: gstEncrypted,
        fd_encrypted: fdEncrypted,
        ad_encrypted: adEncrypted,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead_id);

    if (updateError) {
      console.error('Error updating leads:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update lead data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate audit hash
    const timestamp = new Date().toISOString();
    const hashData = `${lead_id}|${price_quote}|${user.id}|${timestamp}`;
    const dataHash = await generateHash(hashData);

    // Insert audit log
    const { error: auditError } = await supabaseClient
      .from('audit_log')
      .insert({
        lead_id,
        data_hash: dataHash,
        user_id: user.id,
        created_at: timestamp
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      return new Response(JSON.stringify({ error: 'Failed to create audit log' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Financial data encrypted for lead ${lead_id} by user ${user.id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Financial data encrypted and saved successfully',
      audit_hash: dataHash
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in encrypt-financial function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});