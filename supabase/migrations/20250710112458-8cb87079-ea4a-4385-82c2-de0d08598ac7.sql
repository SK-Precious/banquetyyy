-- Create simplified schema for admin-centric banquet management
-- Work with existing tables and add new simplified ones

-- Create users table with UUID IDs for compatibility
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- '000', '001', '002', etc.
  name TEXT NOT NULL,
  password TEXT NOT NULL, -- Simple password for now
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing leads table to add missing columns
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS contact TEXT,
ADD COLUMN IF NOT EXISTS pax INTEGER,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS occasion TEXT;

-- Create messages table for WhatsApp tracking
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- welcome, quote, reminder, feedback, followup
  status TEXT NOT NULL DEFAULT 'sent', -- sent, delivered, failed
  content TEXT,
  sent_by UUID REFERENCES public.users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - allow all for authenticated users
CREATE POLICY "Allow all access for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all access for messages" ON public.messages FOR ALL USING (true);

-- Insert default users if they don't exist
INSERT INTO public.users (code, name, password, status) VALUES 
('000', 'Admin', 'admin123', 'active'),
('001', 'Employee 1', 'emp001', 'active'),
('002', 'Employee 2', 'emp002', 'active')
ON CONFLICT (code) DO NOTHING;

-- Create triggers for updated_at on new tables
CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();