// ⚠️ SECURITY WARNING:
// This script uses the 'xlsx' package which has known security vulnerabilities.
// It is only used for one-time data import during development and is NOT part of
// the production application. If you need to import data, consider:
// 1. Converting Excel files to CSV format first
// 2. Using a safer library like 'exceljs'
// 3. Running this script in an isolated environment
//
// The xlsx package is kept in devDependencies and will not be included in production builds.

const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: In a real admin script, you might use the SERVICE_ROLE_KEY to bypass RLS,
// but our RLS allows insert for all users currently.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filename = '推荐活动库.xlsx';

const EMOTION_ZH_TO_EN = {
  "快乐": "Joy",
  "平静": "Calm",
  "满足": "Fulfillment",
  "期待": "Anticipation",
  "焦虑": "Anxiety",
  "压力": "Stress",
  "烦躁": "Stress",
  "忧郁": "LowMood",
  "无助": "LowMood",
  "疲惫": "Fatigue",
  "懊悔": "Regret",
  "怀疑": "Doubt"
};

function estimateProps(name, description) {
  let duration = 2;
  let intensity = "low";
  
  const text = (name + description).toLowerCase();
  
  if (text.includes("呼吸")) { duration = 1; intensity = "low"; }
  else if (text.includes("冥想")) { duration = 3; intensity = "low"; }
  else if (text.includes("写")) { duration = 5; intensity = "medium"; }
  else if (text.includes("跑") || text.includes("跳") || text.includes("运动")) { duration = 5; intensity = "high"; }
  else if (text.includes("歌") || text.includes("乐")) { duration = 3; intensity = "medium"; }
  else if (text.includes("走") || text.includes("散步")) { duration = 10; intensity = "medium"; }
  else if (text.includes("整理")) { duration = 5; intensity = "medium"; }
  else if (text.includes("水")) { duration = 1; intensity = "low"; }
  
  return { duration, intensity };
}

async function importActivities() {
  if (!fs.existsSync(filename)) {
    console.error(`File ${filename} not found`);
    return;
  }

  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Headers: id,name,description,regulation_type,direction,scene,emotions
  // Data is in column 0, comma separated
  
  const activities = [];
  
  // Skip header (row 0)
  for (let i = 1; i < rows.length; i++) {
    const rawRow = rows[i];
    if (!rawRow || !rawRow[0]) continue;

    // Handle potential CSV-like content in first cell
    const line = rawRow[0].toString();
    const parts = line.split(',');
    
    if (parts.length < 5) continue;

    const id = parts[0].trim();
    const name = parts[1].trim();
    const description = parts[2].trim();
    // const regulation_type = parts[3].trim();
    const direction = parts[4].trim();
    const sceneRaw = parts[5].trim();
    
    // Parse scenes
    let scenes = ["work"];
    if (sceneRaw.includes("|")) {
        scenes = sceneRaw.split("|").map(s => s.trim());
    } else if (sceneRaw) {
        scenes = [sceneRaw];
    }

    const { duration, intensity } = estimateProps(name, description);

    activities.push({
      id: id || `ACT-${i.toString().padStart(3, '0')}`,
      name,
      description,
      direction,
      scenes,
      duration_min: duration,
      intensity
    });
  }

  // Deduplicate activities by ID
  const uniqueActivities = [];
  const seenIds = new Set();
  for (const act of activities) {
    if (!seenIds.has(act.id)) {
      seenIds.add(act.id);
      uniqueActivities.push(act);
    }
  }

  console.log(`Prepared ${uniqueActivities.length} unique activities (from ${activities.length} raw).`);

  const { data, error } = await supabase
    .from('activities')
    .upsert(uniqueActivities, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting activities:', error);
  } else {
    console.log('Successfully imported activities to Supabase!');
  }
}

importActivities();
