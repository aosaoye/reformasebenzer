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
    const finalUrl = `${STRAPI_URL}/api/homepage`;
    console.log("Testing PUT to", finalUrl);
    
    const payload = {
        data: {
            heroTitle: "Test Title",
            heroSubtitle: "Test Subtitle"
        }
    };

    try {
        const response = await fetch(finalUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const err = await response.text();
            console.log("Error from Strapi:", response.status, err);
        } else {
            const data = await response.json();
            console.log("Success:", data);
        }
    } catch(e) {
        console.error("Fetch failed", e);
    }
}

testPut();
