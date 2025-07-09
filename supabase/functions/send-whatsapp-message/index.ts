import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MessageRequest {
  name: string;
  phone: string;
  type: 'welcome' | 'confirmation' | 'quote' | 'reminder' | 'feedback' | 'followup';
  data?: any;
}

const getMessageContent = (type: string, name: string, data: any = {}) => {
  const templates = {
    welcome: `Dear ${name},

Thank You for making an inquiry at SK Precious banquets, Janakpuri.

We hope you had a pleasant visit and our team was able to fulfil all your queries.

As discussed, all the pictures of our venue including glimpse of services we offer are accessible using the links below.

https://drive.google.com/drive/folders/1aQW3zquLHRNRYL3OJGbL1-94gh51EbTM

www.preciousbanquets.com

https://www.instagram.com/skprecious_banquet?igsh=MWtxbm5taWd1bW1udQ==

Let us know if you have any further queries for your Precious functions.

Thank You
SK Precious`,

    confirmation: `🎉 Dear ${name}, Your booking is CONFIRMED! 

📅 Event Date: ${data.date}
📦 Package: ${data.packageName}
📍 Venue: SK Precious Banquets, Janakpuri

✅ Next Steps:
• We'll send payment details shortly
• Our team will contact you for menu selection
• Venue walkthrough will be scheduled

Thank you for choosing SK Precious! We're excited to make your event special! 

For questions, please contact us.

Thank You
SK Precious`,

    quote: `Dear ${name}, Here's your personalized quote for your event:

💰 PRICING BREAKDOWN:
${data.priceBreakdown || 'Base Package: ₹50,000\nDecorations: ₹15,000\nCatering: ₹25,000\nTotal: ₹90,000'}

✨ This quote is valid for 15 days
💳 30% advance required to confirm booking
📞 Call us to discuss customizations

Ready to book? Reply with "YES" or call us directly!

Thank You
SK Precious`,

    reminder: `Dear ${name}, Friendly reminder about your upcoming ${data.type} 📅

📋 Details:
• Date: ${data.date}
• Type: ${data.type}
• Location: SK Precious Banquets, Janakpuri

Please confirm your attendance by replying to this message.

Looking forward to seeing you!

Thank You
SK Precious`,

    feedback: `Dear ${name}, Hope your event on ${data.eventDate} was absolutely wonderful! 🎉

We'd love to hear about your experience at SK Precious Banquets:
⭐ Rate our service
📝 Share a review
📸 Tag us on social media with your photos!

https://www.instagram.com/skprecious_banquet?igsh=MWtxbm5taWd1bW1udQ==

Thank you for choosing SK Precious. We hope to celebrate with you again soon!

Thank You
SK Precious`,

    followup: `Dear ${name}, We wanted to follow up on your event inquiry from ${data.leadAge} days ago.

🎯 Still planning your special event? We're here to help!

✨ Current offers:
• 10% early bird discount
• Free decoration consultation
• Complimentary venue tour

📞 Ready to move forward? Let's schedule a call to discuss your vision!

Visit our links:
www.preciousbanquets.com
https://www.instagram.com/skprecious_banquet?igsh=MWtxbm5taWd1bW1udQ==

Reply or call us - we'd love to make your event memorable!

Thank You
SK Precious`
  };

  return templates[type as keyof typeof templates] || `Dear ${name}, Thank you for your interest in SK Precious Banquets.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, phone, type, data }: MessageRequest = await req.json()

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

    const messageBody = getMessageContent(type, name, data);

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', twilioNumber);
    formData.append('To', `whatsapp:${formattedPhone}`);
    formData.append('Body', messageBody);

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        status: result.status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('WhatsApp send error:', error);
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