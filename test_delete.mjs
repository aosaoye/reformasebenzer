import 'dotenv/config';

async function testDelete() {
    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://superb-ants-9c3577cf0d.strapiapp.com";
    const token = process.env.STRAPI_API_TOKEN;
    const finalUrl = `${url}/api/projects/vmllg1eovg2kq4swmq89cwvz`;
    
    console.log("URL:", finalUrl);
    
    const res = await fetch(finalUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    console.log("STATUS:", res.status);
    console.log("TEXT:", await res.text());
}
testDelete();
