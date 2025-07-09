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
    welcome: `Hello ${name}! 👋 Welcome to Banquety - your premier banquet destination! 

🎉 We're excited to help make your special event memorable. Here's what we offer:

📍 Our beautiful venue with modern facilities
🍽️ Customizable catering packages  
📸 Professional event photography
🎵 Sound & lighting systems

📋 View our brochure: [Your website link]
📷 Browse our gallery: [Gallery link]

Would you like to schedule a venue tour? Reply to this message or call us!

Best regards,
The Banquety Team`,

    confirmation: `🎉 Congratulations ${name}! Your booking is CONFIRMED! 

📅 Event Date: ${data.date}
📦 Package: ${data.packageName}
📍 Venue: Banquety Hall

✅ Next Steps:
• We'll send payment details shortly
• Our team will contact you for menu selection
• Venue walkthrough will be scheduled

Thank you for choosing Banquety! We're excited to make your event special! 

For questions: [Your contact info]`,

    quote: `Hi ${name}! Here's your personalized quote for your event:

💰 PRICING BREAKDOWN:
${data.priceBreakdown || 'Base Package: ₹50,000\nDecorations: ₹15,000\nCatering: ₹25,000\nTotal: ₹90,000'}

✨ This quote is valid for 15 days
💳 30% advance required to confirm booking
📞 Call us to discuss customizations

Ready to book? Reply with "YES" or call us directly!

Best regards,
Banquety Team`,

    reminder: `Hi ${name}! Friendly reminder about your upcoming ${data.type} 📅

📋 Details:
• Date: ${data.date}
• Type: ${data.type}
• Location: Banquety Hall

Please confirm your attendance by replying to this message.

Looking forward to seeing you!
Banquety Team`,

    feedback: `Hi ${name}! Hope your event on ${data.eventDate} was absolutely wonderful! 🎉

We'd love to hear about your experience:
⭐ Rate our service: [Feedback link]
📝 Share a review: [Google Review link]
📸 Tag us on social media with your photos!

Thank you for choosing Banquety. We hope to celebrate with you again soon!

Best regards,
The Banquety Team`,

    followup: `Hi ${name}! We wanted to follow up on your event inquiry from ${data.leadAge} days ago.

🎯 Still planning your special event? We're here to help!

✨ Current offers:
• 10% early bird discount
• Free decoration consultation
• Complimentary venue tour

📞 Ready to move forward? Let's schedule a call to discuss your vision!

Reply or call us - we'd love to make your event memorable!

Banquety Team`
  };

  return templates[type as keyof typeof templates] || `Hello ${name}! Thank you for your interest in Banquety.`;
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