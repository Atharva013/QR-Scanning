import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyBgFutn5tYveHN9_bShx21AFjsZe97UsE4";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const analyzeMedicineRecords = async (record) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
    Review the following medicine supply chain record for inconsistencies:
    
    ${JSON.stringify(record, null, 2)}
    assume that the current date today is 21/3/2025
    Only flag *clear* issues based on:
    1. storage conditions are poor
    2. Source and Destination Manufacturer names are different
    3. dont make decisions based on any dates and times
    4. Batch No. does not start with B
    5. Addresses contain real places for example Mumbai

    
    Keep the response *short*:
    - If valid: *"Legitimate"*
    - If issues: *"Flagged: <concise reason>"*
    `;


    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return responseText;
    } catch (error) {
        console.error("Error analyzing records with Gemini API:", error);
        return "Error analyzing records";
    }
};