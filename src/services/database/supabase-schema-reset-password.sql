CREATE TABLE IF NOT EXISTS public.password_reset_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX password_reset_codes_email_idx ON public.password_reset_codes(email);

CREATE INDEX password_reset_codes_code_idx ON public.password_reset_codes(code);

-- RLS (opcional)
ALTER TABLE
  public.password_reset_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção e consulta
CREATE POLICY "Allow password reset operations" ON public.password_reset_codes FOR ALL USING (true);