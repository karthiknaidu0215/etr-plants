-- Admin Authentication Schema

CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    recovery_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OTP Recovery Table
CREATE TABLE IF NOT EXISTS public.otp_recovery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.admin_profiles(id) ON DELETE CASCADE,
    otp_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_recovery ENABLE ROW LEVEL SECURITY;

-- Super Admin can read and update all admin profiles. Normal admin can read their own.
DROP POLICY IF EXISTS "Super admins can do all" ON public.admin_profiles;
CREATE POLICY "Super admins can do all" ON public.admin_profiles
    FOR ALL TO authenticated
    USING ( (SELECT role FROM public.admin_profiles WHERE id = auth.uid()) = 'super_admin' );

DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_profiles;
CREATE POLICY "Admins can read own profile" ON public.admin_profiles
    FOR SELECT TO authenticated
    USING ( id = auth.uid() );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otp_recovery TO service_role;

-- Enforce strict RLS on configuration tables
-- Only Active Admins can modify content. Everyone can select.
CREATE OR REPLACE FUNCTION public.is_active_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to plants
DROP POLICY IF EXISTS "Admins can modify plants" ON public.plants;
CREATE POLICY "Admins can modify plants" ON public.plants
    FOR ALL TO authenticated USING (public.is_active_admin());

-- Apply to fertilizers
DROP POLICY IF EXISTS "Admins can modify fertilizers" ON public.fertilizers;
CREATE POLICY "Admins can modify fertilizers" ON public.fertilizers
    FOR ALL TO authenticated USING (public.is_active_admin());

-- Apply to additional_items
DROP POLICY IF EXISTS "Admins can modify additional_items" ON public.additional_items;
CREATE POLICY "Admins can modify additional_items" ON public.additional_items
    FOR ALL TO authenticated USING (public.is_active_admin());

-- Apply to categories
DROP POLICY IF EXISTS "Admins can modify categories" ON public.categories;
CREATE POLICY "Admins can modify categories" ON public.categories
    FOR ALL TO authenticated USING (public.is_active_admin());

