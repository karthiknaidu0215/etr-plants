-- Fix RLS: Allow everyone to SELECT from configuration tables
-- Apply to plants
DROP POLICY IF EXISTS "Anyone can read plants" ON public.plants;
CREATE POLICY "Anyone can read plants" ON public.plants
    FOR SELECT TO public USING (true);

-- Apply to fertilizers
DROP POLICY IF EXISTS "Anyone can read fertilizers" ON public.fertilizers;
CREATE POLICY "Anyone can read fertilizers" ON public.fertilizers
    FOR SELECT TO public USING (true);

-- Apply to additional_items
DROP POLICY IF EXISTS "Anyone can read additional_items" ON public.additional_items;
CREATE POLICY "Anyone can read additional_items" ON public.additional_items
    FOR SELECT TO public USING (true);

-- Apply to categories
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
CREATE POLICY "Anyone can read categories" ON public.categories
    FOR SELECT TO public USING (true);

