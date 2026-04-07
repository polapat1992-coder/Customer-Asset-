import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractPropertyFromText(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract property details from the following real estate listing text (which may be in Thai, English, or a mix of both) and return as JSON. 
    Handle special characters, emojis, and stylized fonts (like bold numbers).
    Convert Thai area units: "ตรว." or "ตารางวา" (sq.wah) is for HOUSE/LAND, "ตรม." or "ตารางเมตร" (sq.m.) is for CONDO.
    Ensure that the extracted data is accurate regardless of the language used for specific fields.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Property name or title" },
          price: { type: Type.NUMBER, description: "Price in Baht" },
          location: { type: Type.STRING, description: "Full location or address" },
          zone: { type: Type.STRING, description: "Zone or neighborhood" },
          contactPhone: { type: Type.STRING, description: "Contact phone number" },
          ownerName: { type: Type.STRING, description: "Owner or seller name" },
          ownerPhone: { type: Type.STRING, description: "Owner phone number" },
          lineId: { type: Type.STRING, description: "Line ID" },
          mapUrl: { type: Type.STRING, description: "Google Maps URL if present" },
          specifications: {
            type: Type.OBJECT,
            properties: {
              type: { 
                type: Type.STRING, 
                enum: ["HOUSE", "CONDO", "TOWNHOUSE", "SEMI_DETACHED", "RENOVATED", "USED", "LAND"],
                description: "Property type"
              },
              bedrooms: { type: Type.NUMBER },
              bathrooms: { type: Type.NUMBER },
              area: { type: Type.NUMBER, description: "Area value" },
              floors: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
