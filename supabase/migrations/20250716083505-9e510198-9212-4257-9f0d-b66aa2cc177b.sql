-- Add encrypted financial fields to leads table
ALTER TABLE public.leads 
ADD COLUMN price_quote_encrypted TEXT,
ADD COLUMN gst_encrypted TEXT,
ADD COLUMN fd_encrypted TEXT,
ADD COLUMN ad_encrypted TEXT;

-- Create audit_log table for financial data tracking
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  data_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit_log (only admin can access)
CREATE POLICY "Only admin can access audit logs" 
ON public.audit_log 
FOR ALL 
USING (auth.uid()::text = '000');