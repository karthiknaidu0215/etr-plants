-- Phase 1: Modify Plants Table to support sizes S, M, L
ALTER TABLE plants
ADD COLUMN IF NOT EXISTS price_s DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_m DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_l DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_s_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_m_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_l_active BOOLEAN DEFAULT false;

-- Migrate existing price_per_plant to price_m and make it active
UPDATE plants SET 
    price_m = price_per_plant, 
    is_m_active = true,
    price_s = price_per_plant * 0.7,
    is_s_active = true,
    price_l = price_per_plant * 1.3,
    is_l_active = true;

-- Phase 2: Add Fertilizers Table
CREATE TABLE IF NOT EXISTS fertilizers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT 'kg',
    price_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE fertilizers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on fertilizers" ON fertilizers;
CREATE POLICY "Allow public read access on fertilizers" ON fertilizers FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on fertilizers" ON fertilizers;
CREATE POLICY "Allow full access to authenticated users on fertilizers" ON fertilizers TO authenticated USING (true) WITH CHECK (true);

-- Phase 3: Add Additional Items Table (Labour, Honey Bee Box, Other)
CREATE TABLE IF NOT EXISTS additional_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_optional BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE additional_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on additional_items" ON additional_items;
CREATE POLICY "Allow public read access on additional_items" ON additional_items FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on additional_items" ON additional_items;
CREATE POLICY "Allow full access to authenticated users on additional_items" ON additional_items TO authenticated USING (true) WITH CHECK (true);

-- Phase 4: Quotations
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    land_size_acres DECIMAL(10, 2),
    location_state VARCHAR(255),
    location_district VARCHAR(255),
    location_mandal VARCHAR(255),
    items_data JSONB NOT NULL,
    subtotal DECIMAL(12, 2) DEFAULT 0,
    additional_charges DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    final_amount DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access to authenticated users on quotations" ON quotations;
CREATE POLICY "Allow full access to authenticated users on quotations" ON quotations TO authenticated USING (true) WITH CHECK (true);

-- Phase 5: Income Timelines
CREATE TABLE IF NOT EXISTS income_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    period VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    income_stage VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE income_timelines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on income_timelines" ON income_timelines;
CREATE POLICY "Allow public read access on income_timelines" ON income_timelines FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Allow full access to authenticated users on income_timelines" ON income_timelines;
CREATE POLICY "Allow full access to authenticated users on income_timelines" ON income_timelines TO authenticated USING (true) WITH CHECK (true);

-- Grant privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert default items
INSERT INTO fertilizers (name, description, unit, price_per_unit) VALUES
('NPK 19:19:19', 'General purpose fertilizer', 'kg', 50.00),
('Urea', 'Nitrogen rich', 'kg', 35.00),
('DAP', 'Phosphorus rich', 'kg', 45.00),
('FYM (Farm Yard Manure)', 'Organic compost', 'ton', 2000.00);

INSERT INTO additional_items (category, name, description, unit, price, is_optional) VALUES
('labour', 'Planting Labour', 'Labour cost for planting', 'per acre', 15000.00, true),
('honey_bee_box', 'Honey Bee Box', 'For pollination and honey production', 'per box', 4500.00, true),
('other', 'Drip Irrigation Setup', 'Basic drip irrigation system', 'per acre', 35000.00, true),
('other', 'Fencing', 'Barbed wire fencing', 'per acre', 40000.00, true);

