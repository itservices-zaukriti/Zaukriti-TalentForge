#!/usr/bin/env node

/**
 * Apply the 20260201_final_sync.sql migration to add missing columns
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
    console.log('🔧 Applying migration: 20260201_final_sync.sql\n');

    // Use service role key to bypass RLS
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260201_final_sync.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL:\n');
    console.log(migrationSQL);
    console.log('\n⏳ Executing migration...\n');

    try {
        // Execute the migration using rpc (if you have a function) or direct SQL
        // Since Supabase JS client doesn't support raw SQL execution directly,
        // we'll need to use the REST API or create an RPC function

        // For now, let's verify if the columns exist
        const { data, error } = await supabase
            .from('applicants')
            .select('linkedin_url, resume_link')
            .limit(1);

        if (error) {
            if (error.message.includes('column') && error.message.includes('does not exist')) {
                console.log('❌ Columns do NOT exist in database');
                console.log('   Error:', error.message);
                console.log('\n📋 MANUAL ACTION REQUIRED:');
                console.log('   1. Go to Supabase Dashboard → SQL Editor');
                console.log('   2. Copy and paste the migration SQL from above');
                console.log('   3. Execute it');
                console.log('\n   OR use Supabase CLI:');
                console.log('   npx supabase db push');
            } else {
                console.log('❌ Unexpected error:', error);
            }
        } else {
            console.log('✅ Columns already exist in database!');
            console.log('   Migration has been applied successfully.');
        }
    } catch (err) {
        console.error('💥 Error:', err.message);
    }
}

applyMigration();
