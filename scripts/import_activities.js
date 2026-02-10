const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filename = '推荐活动库.xlsx';
const outputPath = 'lib/data/activities.ts';

const EMOTION_ZH_TO_EN = {
  "快乐": "Joy",
  "平静": "Calm",
  "满足": "Fulfillment",
  "期待": "Anticipation",
  "焦虑": "Anxiety",
  "压力": "Stress",
  "烦躁": "Stress", // Map to Stress
  "忧郁": "LowMood",
  "无助": "LowMood", // Map to LowMood
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

try {
  if (!fs.existsSync(filename)) {
    console.error(`File ${filename} not found`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const activities = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    
    // Simple split by comma, assuming no commas in content for now based on sample
    const line = row[0];
    const parts = line.split(',');
    
    if (parts.length < 7) continue;
    
    const id = parts[0].trim();
    const name = parts[1].trim();
    const description = parts[2].trim();
    // const regulation_type = parts[3].trim(); 
    const direction = parts[4].trim();
    const scene = parts[5].trim();
    const emotionsStr = parts[6].trim();
    
    const zhEmotions = emotionsStr.split('|');
    const enEmotions = zhEmotions.map(zh => {
        const mapped = EMOTION_ZH_TO_EN[zh.trim()];
        if (!mapped) console.warn(`Warning: Unknown emotion ${zh} in row ${i}`);
        return mapped;
    }).filter(Boolean);
    
    if (enEmotions.length === 0) continue;
    
    const uniqueEmotions = [...new Set(enEmotions)];
    const { duration, intensity } = estimateProps(name, description);
    
    // Check if activity already exists (by ID or name/description combination)
    // Here we treat each row as unique entry because ID is unique.
    
    activities.push({
      id,
      name,
      description,
      direction, 
      scenes: [scene], 
      duration_min: duration,
      intensity
    });
  }
  
  const content = `import { Activity } from "@/lib/recommendation-engine/core";

export const ACTIVITIES: Activity[] = ${JSON.stringify(activities, null, 2)};
`;

  fs.writeFileSync(outputPath, content);
  console.log(`Generated ${activities.length} activities to ${outputPath}`);
  
} catch (e) {
  console.error(e);
}
