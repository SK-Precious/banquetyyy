import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppMessage {
  name: string;
  phone: string;
  type: 'welcome' | 'confirmation' | 'quote' | 'reminder' | 'feedback' | 'followup' | 'tasting' | 'concierge';
  data?: any;
  leadId?: string;
  language?: 'en' | 'hi' | 'gu';
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

  const sendWelcome = (name: string, phone: string, leadId?: string, language?: 'en' | 'hi' | 'gu') => 
    sendMessage({ name, phone, type: 'welcome', leadId, language });

  const sendConfirmation = (name: string, phone: string, data: { date: string; packageName: string; guestCount?: number }, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'confirmation', data, leadId, language });

  const sendQuote = (name: string, phone: string, data?: { guestCount?: number; occasion?: string; eventDate?: string }, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'quote', data, leadId, language });

  const sendReminder = (name: string, phone: string, data: { type: string; date: string }, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'reminder', data, leadId, language });

  const sendFeedback = (name: string, phone: string, data: { eventDate: string }, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'feedback', data, leadId, language });

  const sendFollowup = (name: string, phone: string, data: { leadAge: number }, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'followup', data, leadId, language });

  const sendTasting = (name: string, phone: string, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'tasting', leadId, language });

  const sendConcierge = (name: string, phone: string, question: string, leadId?: string, language?: 'en' | 'hi' | 'gu') =>
    sendMessage({ name, phone, type: 'concierge', data: { question }, leadId, language });

  return {
    isSending,
    sendMessage,
    sendWelcome,
    sendConfirmation,
    sendQuote,
    sendReminder,
    sendFeedback,
    sendFollowup,
    sendTasting,
    sendConcierge,
  };
};