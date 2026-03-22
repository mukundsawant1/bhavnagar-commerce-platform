const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!url || !key) {
  console.error('missing supabase env');
  process.exit(1);
}
const supabase = createClient(url, key);
supabase.from('otps').select('*').limit(1).then(r => { console.log(JSON.stringify(r, null, 2)); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
