-- Create simplified schema for admin-centric banquet management
-- Work with existing tables and add new simplified ones

-- Create users table for 000-010 user codes
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- '000', '001', '002', etc.
  name TEXT NOT NULL,
  password TEXT NOT NULL, -- Simple password for now
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing leads table to match simplified schema
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS contact TEXT,
ADD COLUMN IF NOT EXISTS pax INTEGER,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS occasion TEXT,
ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Update leads table to use simple user references
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_assigned_to_fkey;
ALTER TABLE public.leads ADD CONSTRAINT leads_assigned_to_fkey 
  FOREIGN KEY (assigned_to) REFERENCES public.users(id);

-- Create messages table for WhatsApp tracking
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- welcome, quote, reminder, feedback, followup
  status TEXT NOT NULL DEFAULT 'sent', -- sent, delivered, failed
  content TEXT,
  sent_by TEXT REFERENCES public.users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - allow all for authenticated users
CREATE POLICY "Allow all access for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all access for messages" ON public.messages FOR ALL USING (true);

-- Insert default users if they don't exist
INSERT INTO public.users (id, name, password, status) VALUES 
('000', 'Admin', 'admin123', 'active'),
('001', 'Employee 1', 'emp001', 'active'),
('002', 'Employee 2', 'emp002', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create triggers for updated_at on new tables
CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();