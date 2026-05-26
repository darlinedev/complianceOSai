const fs = require('fs');
const path = require('path');

// 1. Read env variables
const envPath = '/home/administrateur/Documents/complianceOs/apps/web/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');

let url = '';
let anonKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    anonKey = line.split('=')[1].trim();
  }
});

// 2. Perform fetch request to select all systems
async function listSystems() {
  const targetUrl = `${url}/rest/v1/systems?select=*`;
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Systems list:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

listSystems();
