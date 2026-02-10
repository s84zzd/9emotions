
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  // Check for any scenes that do NOT contain "work"
  // Note: 'cs' means 'contains', so we want rows where scenes does NOT contain "work" is hard with simple filters if it's an array column.
  // Instead, let's just fetch all scenes and count locally.
  
  const { data, error } = await supabase
    .from('activities')
    .select('scenes');

  if (error) {
    console.error(error);
    return;
  }

  const counts = {};
  data.forEach(row => {
    const key = JSON.stringify(row.scenes);
    counts[key] = (counts[key] || 0) + 1;
  });

  console.log('Scene distribution:', counts);
  
  // Also check direction distribution
  const { data: dirData } = await supabase.from('activities').select('direction');
  const dirCounts = {};
  dirData.forEach(row => {
    dirCounts[row.direction] = (dirCounts[row.direction] || 0) + 1;
  });
  console.log('Direction distribution:', dirCounts);
}

check();
