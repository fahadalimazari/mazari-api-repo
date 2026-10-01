const { TiktokDL } = require('@tobyg74/tiktok-api-dl');

async function testTiktok() {
    console.log("Testing TikTok...");
    try {
        const result = await TiktokDL('https://www.tiktok.com/@mrbeast/video/7272719266731052330', {
            version: "v1" // version: "v1" | "v2" | "v3"
        });
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("TikTok Failed:", e.message);
    }
}
testTiktok();
