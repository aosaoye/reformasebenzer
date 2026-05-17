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

async function runDiagnose() {
    console.log("Diagnosing Homepage Endpoint...");
    
    // 1. GET Request
    console.log("1. Executing GET /api/homepage...");
    try {
        const getRes = await fetch(`${STRAPI_URL}/api/homepage?populate=*`, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
        });
        
        console.log("GET Status:", getRes.status);
        const getData = await getRes.json();
        console.log("GET Data:", JSON.stringify(getData, null, 2));

        const documentId = getData?.data?.documentId;
        console.log("Found Document ID:", documentId);
        
        // 2. PUT Request
        console.log("2. Executing PUT to update...");
        const putUrl = documentId ? `${STRAPI_URL}/api/homepage/${documentId}` : `${STRAPI_URL}/api/homepage`;
        console.log("PUT URL:", putUrl);
        
        const putRes = await fetch(putUrl, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    heroTitle: "Diagnose Title Test"
                }
            })
        });

        console.log("PUT Status:", putRes.status);
        const putData = await putRes.text();
        console.log("PUT Data:", putData);

    } catch (e) {
        console.error("Diagnose failed:", e.message);
    }
}

runDiagnose();
