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

const variations = [
    "global",
    "global-setting",
    "global-settings",
    "global-config",
    "global-configs",
    "setting",
    "settings",
    "config",
    "configs",
    "ajustes",
    "footer",
    "navbar"
];

async function testVariations() {
    console.log("--- Testing Global Settings Variations ---");
    for (const name of variations) {
        const url = `${STRAPI_URL}/api/${name}?populate=*`;
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
            });
            console.log(`Endpoint: /api/${name} -> Status: ${res.status}`);
            if (res.status === 200) {
                const json = await res.json();
                console.log(`  SUCCESS! Keys: ${Object.keys(json.data || {}).join(", ")}`);
            }
        } catch (e) {
            console.log(`Endpoint: /api/${name} -> Error: ${e.message}`);
        }
    }
}

testVariations();
