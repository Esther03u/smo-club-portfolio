const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const membersDir = path.join(__dirname, './public/members');
  if (!fs.existsSync(membersDir)) {
    console.error("public/members directory not found.");
    process.exit(1);
  }

  const files = fs.readdirSync(membersDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

  // Create bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets.find(b => b.name === 'members')) {
    console.log("Creating 'members' bucket...");
    await supabase.storage.createBucket('members', { public: true });
  }

  const urlMap = {};

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(membersDir, file);
    
    // Resize and convert to webp
    const webpBuffer = await sharp(filePath)
      .resize(600)
      .webp({ quality: 80 })
      .toBuffer();
    
    const newFileName = file.replace(/\.(png|jpg|jpeg)$/, '.webp');
    
    // Upload to supabase
    const { data, error } = await supabase.storage.from('members').upload(newFileName, webpBuffer, {
      contentType: 'image/webp',
      upsert: true
    });
    
    if (error) {
      console.error(`Error uploading ${file}:`, error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('members').getPublicUrl(newFileName);
      urlMap[`/members/${file}`] = publicUrl;
      console.log(`Uploaded: ${publicUrl}`);
    }
  }

  // Now read page.tsx and replace URLs
  const pagePath = path.join(__dirname, './src/app/page.tsx');
  if (fs.existsSync(pagePath)) {
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      pageContent = pageContent.replace(new RegExp(oldUrl, 'g'), newUrl);
    }
    
    fs.writeFileSync(pagePath, pageContent);
    console.log('Updated page.tsx with Supabase URLs');
  }
}

run();
