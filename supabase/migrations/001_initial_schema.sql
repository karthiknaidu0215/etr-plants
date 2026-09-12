-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Plants
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scientific_name VARCHAR(255),
    image_url TEXT,
    price_per_plant DECIMAL(10, 2) NOT NULL,
    default_spacing INTEGER NOT NULL,
    min_spacing INTEGER DEFAULT 3,
    max_spacing INTEGER DEFAULT 20,
    water_requirement VARCHAR(255),
    soil_type VARCHAR(255),
    fertilizer_info JSONB,
    maintenance_info JSONB,
    income_assumptions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    mandal VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    land_size_acres DECIMAL(10, 2),
    plantation_type VARCHAR(255),
    images JSONB,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Estimation Settings
CREATE TABLE estimation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Website Settings
CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR(50) UNIQUE NOT NULL,
    plan_id VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    location_state VARCHAR(255),
    location_district VARCHAR(255),
    location_mandal VARCHAR(255),
    land_size_acres DECIMAL(10, 2),
    selected_plants JSONB,
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    intent VARCHAR(50) DEFAULT 'quote',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Plantation Plans
CREATE TABLE plantation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    land_acres DECIMAL(10, 2) NOT NULL,
    location_state VARCHAR(255),
    location_district VARCHAR(255),
    location_mandal VARCHAR(255),
    total_investment DECIMAL(12, 2),
    expected_income DECIMAL(12, 2),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE plantation_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plantation_plans(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id),
    plant_name VARCHAR(255) NOT NULL,
    spacing INTEGER NOT NULL,
    allocation_percentage DECIMAL(5, 2) NOT NULL,
    allocated_acres DECIMAL(10, 2) NOT NULL,
    plant_count INTEGER NOT NULL,
    plant_cost DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE farm_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plantation_plans(id) ON DELETE CASCADE,
    zone_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantation_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_layouts ENABLE ROW LEVEL SECURITY;

-- Policies for public reading (anon)
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on plants" ON plants FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on estimation_settings" ON estimation_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on website_settings" ON website_settings FOR SELECT USING (true);

-- Policies for public creating leads (anon)
CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);

-- Policies for authenticated admins (all operations)
CREATE POLICY "Allow full access to authenticated users on categories" ON categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on plants" ON plants TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on locations" ON locations TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on projects" ON projects TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on estimation_settings" ON estimation_settings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on website_settings" ON website_settings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on leads" ON leads TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on plantation_plans" ON plantation_plans TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on plantation_plan_items" ON plantation_plan_items TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to authenticated users on farm_layouts" ON farm_layouts TO authenticated USING (true) WITH CHECK (true);


-- SEED DATA

-- Categories
INSERT INTO categories (name, description, sort_order) VALUES
('Fruit', 'Fruit bearing plants and trees', 1),
('Wood', 'Timber and wood yielding trees', 2),
('Avenue', 'Decorative avenue trees for borders and roadsides', 3),
('Flowers', 'Flowering plants for commercial or decorative use', 4),
('Landscaping', 'Ornamental plants for farmhouse landscaping', 5);

-- Estimation Settings
INSERT INTO estimation_settings (key, value, description) VALUES
('setup_cost_per_acre', '{"amount": 25000}', 'Cost for initial land preparation and setup per acre'),
('labour_cost_per_acre', '{"amount": 15000}', 'Labour cost for planting per acre'),
('fertilizer_cost_per_acre', '{"amount": 8000}', 'Initial fertilizer cost per acre'),
('other_costs_per_acre', '{"amount": 5000}', 'Miscellaneous costs per acre');

-- Locations
INSERT INTO locations (state, district, mandal) VALUES
('Andhra Pradesh', 'West Godavari', 'Bhimavaram'),
('Andhra Pradesh', 'West Godavari', 'Palakollu'),
('Andhra Pradesh', 'East Godavari', 'Rajahmundry'),
('Telangana', 'Karimnagar', 'Jammikunta'),
('Telangana', 'Hyderabad', 'Medchal'),
('Tamil Nadu', 'Coimbatore', 'Pollachi');

-- Wait to seed plants until categories are created, since we need UUIDs. 
-- For a robust migration script, we use subqueries for category_ids:

INSERT INTO plants (category_id, name, scientific_name, price_per_plant, default_spacing, min_spacing, max_spacing, income_assumptions, fertilizer_info)
VALUES
(
    (SELECT id FROM categories WHERE name = 'Fruit' LIMIT 1),
    'Mango (Banganapalli)', 'Mangifera indica', 150.00, 30, 25, 40,
    '{"yield_per_plant_kg": 50, "price_per_kg": 40, "first_yield_year": 4, "annual_income_per_plant": 2000}',
    '{"type": "NPK 10:26:26 + FYM", "frequency": "Twice a year"}'
),
(
    (SELECT id FROM categories WHERE name = 'Fruit' LIMIT 1),
    'Guava (Taiwan Pink)', 'Psidium guajava', 80.00, 15, 10, 20,
    '{"yield_per_plant_kg": 30, "price_per_kg": 30, "first_yield_year": 2, "annual_income_per_plant": 900}',
    '{"type": "NPK 19:19:19", "frequency": "Monthly during fruiting"}'
),
(
    (SELECT id FROM categories WHERE name = 'Wood' LIMIT 1),
    'Teak (Tissue Culture)', 'Tectona grandis', 120.00, 10, 8, 15,
    '{"annual_income_per_plant": 0, "first_yield_year": 12, "lump_sum_expected": 25000}',
    '{"type": "Urea + DAP", "frequency": "During monsoon"}'
),
(
    (SELECT id FROM categories WHERE name = 'Wood' LIMIT 1),
    'Mahogany', 'Swietenia macrophylla', 90.00, 12, 10, 15,
    '{"annual_income_per_plant": 0, "first_yield_year": 10, "lump_sum_expected": 15000}',
    '{"type": "Organic Compost", "frequency": "Yearly"}'
),
(
    (SELECT id FROM categories WHERE name = 'Avenue' LIMIT 1),
    'Silver Oak', 'Grevillea robusta', 60.00, 10, 8, 15,
    '{"annual_income_per_plant": 0}',
    '{"type": "General Purpose", "frequency": "Yearly"}'
);
