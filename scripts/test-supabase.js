import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 1. Try to insert a test record
    console.log('Attempting to insert test record...');
    const { data: insertData, error: insertError } = await supabase
      .from('check_ins')
      .insert([
        {
          emotions: ['Anxiety'], // Use string literal to avoid type issues in this script
          scene: 'work',
          energy_score: 50,
          note: 'Connection Test'
        }
      ])
      .select();

    if (insertError) {
      console.error('Insert Error:', insertError);
    } else {
      console.log('Insert Success:', insertData);
    }

    // 2. Try to read back
    console.log('Attempting to read records...');
    const { data: readData, error: readError } = await supabase
      .from('check_ins')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('Read Error:', readError);
    } else {
      console.log('Read Success. Record count:', readData.length);
      console.log('Records:', readData);
    }

  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

testConnection();
