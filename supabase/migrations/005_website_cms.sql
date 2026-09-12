-- 1. Plants Table Additions
ALTER TABLE public.plants
ADD COLUMN IF NOT EXISTS visual_asset_url TEXT,
ADD COLUMN IF NOT EXISTS top_down_icon_url TEXT;

-- 2. Website Content (Key-Value pairs for text, links, branding)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section VARCHAR(50) NOT NULL, -- e.g., 'branding', 'contact', 'homepage', 'footer'
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on website_content" ON public.website_content;
CREATE POLICY "Allow public read access on website_content" ON public.website_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on website_content" ON public.website_content;
CREATE POLICY "Allow full access to authenticated users on website_content" ON public.website_content TO authenticated USING (true) WITH CHECK (true);

-- 3. Gallery Images
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on gallery_images" ON public.gallery_images;
CREATE POLICY "Allow public read access on gallery_images" ON public.gallery_images FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on gallery_images" ON public.gallery_images;
CREATE POLICY "Allow full access to authenticated users on gallery_images" ON public.gallery_images TO authenticated USING (true) WITH CHECK (true);

-- 4. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on services" ON public.services;
CREATE POLICY "Allow public read access on services" ON public.services FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on services" ON public.services;
CREATE POLICY "Allow full access to authenticated users on services" ON public.services TO authenticated USING (true) WITH CHECK (true);

-- 5. Extend Projects Table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ongoing',
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS project_date DATE;

-- 6. Farm Designs
CREATE TABLE IF NOT EXISTS public.farm_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.plantation_plans(id) ON DELETE CASCADE,
    layout_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.farm_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on farm_designs" ON public.farm_designs;
CREATE POLICY "Allow public read access on farm_designs" ON public.farm_designs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on farm_designs" ON public.farm_designs;
CREATE POLICY "Allow full access to authenticated users on farm_designs" ON public.farm_designs TO authenticated USING (true) WITH CHECK (true);

-- 7. Storage Buckets (using Supabase Storage schema)
INSERT INTO storage.buckets (id, name, public) VALUES ('website_assets', 'website_assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('plant_assets', 'plant_assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;

-- Bucket Policies for public reading
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('website_assets', 'plant_assets', 'gallery'));
-- Bucket Policies for authenticated uploads
CREATE POLICY "Authenticated users can upload objects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('website_assets', 'plant_assets', 'gallery'));
CREATE POLICY "Authenticated users can update objects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('website_assets', 'plant_assets', 'gallery'));
CREATE POLICY "Authenticated users can delete objects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('website_assets', 'plant_assets', 'gallery'));

-- 8. Default Website Content Seed
INSERT INTO public.website_content (section, key, value, description) VALUES
('branding', 'logo_url', '"/logo.png"', 'URL to the main website logo'),
('branding', 'website_name', '"ETR Plants"', 'Main website name'),
('branding', 'tagline', '"Premium Nursery & Farm Design"', 'Website tagline'),
('contact', 'phone', '"+91 99999 99999"', 'Primary contact phone number'),
('contact', 'whatsapp', '"+91 99999 99999"', 'WhatsApp contact number'),
('contact', 'email', '"contact@etrplants.com"', 'Primary contact email'),
('contact', 'address', '"Hyderabad, Telangana, India"', 'Physical business address'),
('homepage', 'hero_heading', '"Design Your Dream Farm"', 'Main heading on the hero section'),
('homepage', 'hero_subheading', '"Professional plantation planning, premium plants, and end-to-end farm design services."', 'Subheading on the hero section'),
('homepage', 'about_text', '"ETR Plants is a premium nursery specializing in commercial and ornamental plantations. We provide complete farm layouts and end-to-end agricultural planning."', 'About section description'),
('footer', 'copyright', '"© 2026 ETR Plants. All rights reserved."', 'Footer copyright text')
ON CONFLICT (key) DO NOTHING;

-- Grant privileges for new tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
