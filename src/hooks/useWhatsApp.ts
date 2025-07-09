import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppMessage {
  name: string;
  phone: string;
  type: 'welcome' | 'confirmation' | 'quote' | 'reminder' | 'feedback' | 'followup';
  data?: any;
}

export const useWhatsApp = () => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (message: WhatsAppMessage) => {
    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: message
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "WhatsApp Message Sent",
          description: `${message.type} message sent to ${message.name}`,
        });
        return true;
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to send WhatsApp message: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendWelcome = (name: string, phone: string) => 
    sendMessage({ name, phone, type: 'welcome' });

  const sendConfirmation = (name: string, phone: string, data: { date: string; packageName: string }) =>
    sendMessage({ name, phone, type: 'confirmation', data });

  const sendQuote = (name: string, phone: string, data: { priceBreakdown: string }) =>
    sendMessage({ name, phone, type: 'quote', data });

  const sendReminder = (name: string, phone: string, data: { type: string; date: string }) =>
    sendMessage({ name, phone, type: 'reminder', data });

  const sendFeedback = (name: string, phone: string, data: { eventDate: string }) =>
    sendMessage({ name, phone, type: 'feedback', data });

  const sendFollowup = (name: string, phone: string, data: { leadAge: number }) =>
    sendMessage({ name, phone, type: 'followup', data });

  return {
    isSending,
    sendMessage,
    sendWelcome,
    sendConfirmation,
    sendQuote,
    sendReminder,
    sendFeedback,
    sendFollowup,
  };
};