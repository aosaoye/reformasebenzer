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

async function testPut() {
    console.log("--- Testing PUT /api/homepage ---");
    const url = `${STRAPI_URL}/api/homepage`;
    const payload = {
        data: {
            heroTitle: "Test Title " + new Date().toISOString(),
            heroSubtitle: "Test Subtitle",
            publishedAt: new Date().toISOString()
        }
    };
    
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Response: ${text}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

testPut();
