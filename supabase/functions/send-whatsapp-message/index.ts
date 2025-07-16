import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MessageRequest {
  name: string;
  phone: string;
  type: 'welcome' | 'confirmation' | 'quote' | 'reminder' | 'feedback' | 'followup' | 'tasting' | 'concierge';
  data?: any;
  leadId?: string;
  language?: 'en' | 'hi' | 'gu';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const getGPTPrompt = (type: string, name: string, data: any = {}, language: string = 'en') => {
  const baseContext = `
    You are SK Precious Banquets AI assistant for WhatsApp communication.
    Venue: SK Precious Banquets, Janakpuri, Delhi
    Links: www.preciousbanquets.com, Instagram: @skprecious_banquet
    Gallery: https://drive.google.com/drive/folders/1aQW3zquLHRNRYL3OJGbL1-94gh51EbTM
    ${language !== 'en' ? `Respond in ${language === 'hi' ? 'Hindi' : 'Gujarati'} language.` : ''}
  `;

  const prompts = {
    welcome: `${baseContext}
    Write a friendly, professional WhatsApp welcome message for ${name} who visited our banquet venue.
    Include: Thank them for visit, mention our gallery links, offer to answer queries.
    Keep it warm and professional. End with "Thank You, SK Precious".`,

    confirmation: `${baseContext}
    Write a booking confirmation message for ${name}.
    Event Details: Date: ${data.date}, Package: ${data.packageName}, Guests: ${data.guestCount || 'TBD'}
    Include: Confirmation emoji, next steps (payment, menu selection, venue walkthrough).
    Be professional and excited. End with "Thank You, SK Precious".`,

    quote: `${baseContext}
    Generate a personalized banquet pricing quote for ${name}.
    Event Details: Guests: ${data.guestCount || data.pax || 100}, Occasion: ${data.occasion || 'celebration'}, Date: ${data.eventDate || 'TBD'}
    Include: Base package estimate, decorations, catering, total range, 30% advance requirement, 15-day validity.
    Use realistic Delhi banquet pricing. End with "Thank You, SK Precious".`,

    reminder: `${baseContext}
    Write a polite reminder message for ${name}.
    Reminder Type: ${data.type || 'appointment'}, Date: ${data.date || 'scheduled'}
    Be courteous and professional. Ask for confirmation. End with "Thank You, SK Precious".`,

    feedback: `${baseContext}
    Write a post-event feedback request for ${name}.
    Event Date: ${data.eventDate || 'recent event'}
    Ask for: Rating, review, social media tagging. Include Instagram link.
    Be appreciative and hopeful for future events. End with "Thank You, SK Precious".`,

    followup: `${baseContext}
    Write a follow-up message for ${name} who hasn't responded in ${data.leadAge || 5} days.
    Include: Current offers (10% early bird, free consultation, venue tour), website links.
    Be helpful and not pushy. End with "Thank You, SK Precious".`,

    tasting: `${baseContext}
    Offer food tasting appointment to ${name}.
    Suggest 3 time slots in next 7 days. Ask them to confirm preference.
    Be enthusiastic about showcasing cuisine. End with "Thank You, SK Precious".`,

    concierge: `${baseContext}
    Answer this customer query: "${data.question || 'General inquiry'}"
    Provide helpful information about SK Precious Banquets services, capacity, amenities.
    Be informative and encourage booking. End with "Thank You, SK Precious".`
  };

  return prompts[type as keyof typeof prompts] || `${baseContext} Respond to ${name} professionally about SK Precious Banquets. End with "Thank You, SK Precious".`;
};

const generateGPTResponse = async (prompt: string): Promise<string> => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional banquet venue assistant. Write concise, friendly WhatsApp messages that are culturally appropriate for Indian customers. Keep responses under 150 words.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Thank you for your interest in SK Precious Banquets.';
  } catch (error) {
    console.error('GPT API Error:', error);
    throw error;
  }
};

const logMessage = async (leadId: string | null, type: string, gptPrompt: string, gptResponse: string, status: string) => {
  try {
    await supabase
      .from('messages')
      .insert({
        lead_id: leadId,
        type: `gpt_${type}`,
        content: JSON.stringify({
          prompt: gptPrompt,
          response: gptResponse,
          agent_type: type
        }),
        status,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log message:', error);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, type, data, leadId, language }: MessageRequest = await req.json()

    if (!name || !phone || !type) {
      throw new Error('Missing required fields: name, phone, type')
    }

    // Validate phone format (ensure it starts with +)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER') || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    // Fetch lead context if leadId provided
    let leadContext = {};
    if (leadId) {
      try {
        const { data: lead } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single();
        
        if (lead) {
          leadContext = {
            eventDate: lead.event_date,
            occasion: lead.occasion || lead.event_type,
            guestCount: lead.guest_count || lead.pax,
            budget: lead.budget_range,
            notes: lead.notes
          };
        }
      } catch (error) {
        console.log('Could not fetch lead context:', error);
      }
    }

    // Merge lead context with provided data
    const enrichedData = { ...leadContext, ...data };

    // Generate GPT prompt and response
    const gptPrompt = getGPTPrompt(type, name, enrichedData, language || 'en');
    console.log('GPT Prompt:', gptPrompt);

    const gptResponse = await generateGPTResponse(gptPrompt);
    console.log('GPT Response:', gptResponse);

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', twilioNumber);
    formData.append('To', `whatsapp:${formattedPhone}`);
    formData.append('Body', gptResponse);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${error}`);
    }

    const result = await response.json();

    // Log the GPT interaction
    await logMessage(leadId || null, type, gptPrompt, gptResponse, result.status);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        status: result.status,
        gptResponse: gptResponse
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('WhatsApp send error:', error);
    
    // Log failed attempt
    if (error.message.includes('GPT') || error.message.includes('OpenAI')) {
      await logMessage(null, 'error', 'GPT_ERROR', error.message, 'failed');
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})