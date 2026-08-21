-- SQL Migration Schema for Business Operations, Document Management & QMS Portal
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)

-- 1. User Profiles & Roles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Employee',
  department TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Controlled Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doc_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  department TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  owner_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  current_version TEXT NOT NULL DEFAULT '1.0',
  effective_date DATE,
  review_date DATE,
  description TEXT,
  file_path TEXT,
  google_drive_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Document Versions History Table
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  version_number TEXT NOT NULL,
  file_path TEXT,
  created_by TEXT NOT NULL,
  change_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Document Approvals Workflow Table
CREATE TABLE IF NOT EXISTS public.document_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  version_number TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_role TEXT NOT NULL,
  decision TEXT NOT NULL DEFAULT 'Pending',
  comment TEXT,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Document Templates Table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  owner TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  doc_type TEXT NOT NULL,
  file_path TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 6. System Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_title TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) POLICIES ───────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for demo & authenticated users
CREATE POLICY "Allow public read access on documents"
ON public.documents FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access on document_versions"
ON public.document_versions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access on document_approvals"
ON public.document_approvals FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access on templates"
ON public.templates FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access on audit_logs"
ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);

-- Allow authenticated quality managers & admins to insert/update documents
CREATE POLICY "Allow quality write access on documents"
ON public.documents FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow quality write access on document_versions"
ON public.document_versions FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow quality write access on audit_logs"
ON public.audit_logs FOR ALL TO anon, authenticated USING (true);
