import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const updates = [
    { slug: 'tote-bag-eco', url: '/mockups/tote_bag.png' },
    { slug: 'taza-ceramica', url: '/mockups/ceramic_mug.png' },
    { slug: 'playera-premium-unisex', url: '/mockups/premium_tshirt.png' },
    { slug: 'playera-basica-unisex', url: '/mockups/basic_tshirt.png' },
    { slug: 'placa-acrilico', url: '/mockups/acrylic_plaque.png' }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ mockup_front_url: item.url })
      .eq('slug', item.slug)
      .select('name, mockup_front_url');
    console.log(error ? error : `Updated ${item.slug}: ${data?.[0]?.mockup_front_url}`);
  }
}

main().catch(console.error);
