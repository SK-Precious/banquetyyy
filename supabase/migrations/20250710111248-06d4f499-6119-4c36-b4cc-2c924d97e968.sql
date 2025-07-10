-- Create simplified schema for admin-centric banquet management

-- Drop existing complex tables and create simplified ones
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Create simplified users table for 000-010 user codes
CREATE TABLE public.users (
  id TEXT PRIMARY KEY, -- '000', '001', '002', etc.
  name TEXT NOT NULL,
  password TEXT NOT NULL, -- Simple password for now
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create simplified leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  event_date DATE,
  pax INTEGER,
  budget TEXT,
  occasion TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new, hot, warm, cold, converted
  assigned_to TEXT REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for WhatsApp tracking
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- welcome, quote, reminder, feedback, followup
  status TEXT NOT NULL DEFAULT 'sent', -- sent, delivered, failed
  content TEXT,
  sent_by TEXT REFERENCES public.users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security) but keep it simple
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - allow all for now since we'll handle restrictions in frontend
CREATE POLICY "Allow all access" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow all access" ON public.messages FOR ALL USING (true);

-- Insert default admin user
INSERT INTO public.users (id, name, password, status) VALUES 
('000', 'Admin', 'admin123', 'active'),
('001', 'Employee 1', 'emp001', 'active'),
('002', 'Employee 2', 'emp002', 'active');

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();