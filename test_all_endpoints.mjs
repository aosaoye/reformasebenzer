import fs from 'fs';

let envContent = "";
if (fs.existsSync('.env.local')) {
    envContent = fs.readFileSync('.env.local', 'utf-8');
} else if (fs.existsSync('.env')) {
    envContent = fs.readFileSync('.env', 'utf-8');
}

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://superb-ants-9c3577cf0d.strapiapp.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const endpoints = ["homepage", "global", "projects", "testimonials"];

async function testAll() {
    console.log("--- Testing Strapi Endpoints ---");
    for (const endpoint of endpoints) {
        const url = `${STRAPI_URL}/api/${endpoint}?populate=*`;
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
            });
            console.log(`Endpoint: ${endpoint} -> Status: ${res.status}`);
            if (res.status === 200) {
                const json = await res.json();
                console.log(`  Data structure: ${json.data ? "Valid (has .data)" : "Invalid (no .data)"}`);
            } else {
                const text = await res.text();
                console.log(`  Error: ${text.slice(0, 100)}`);
            }
        } catch (e) {
            console.log(`Endpoint: ${endpoint} -> Fetch Error: ${e.message}`);
        }
    }
}

testAll();
