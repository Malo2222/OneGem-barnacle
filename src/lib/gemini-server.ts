import { GoogleGenAI, Type } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export type ParsedCaptureResult = {
  sender: string;
  body: string;
  platform: "imessage" | "sms" | "instagram" | "snapchat" | "email";
  confidence: number;
  extractedHandles?: { platform: string; value: string }[];
};

export async function parseTextOrImageWithGemini(
  text?: string,
  imageDataUrl?: string,
): Promise<ParsedCaptureResult | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const parts: Array<{
      text?: string;
      inlineData?: { mimeType: string; data: string };
    }> = [];

    if (imageDataUrl) {
      const match = imageDataUrl.match(
        /^data:(image\/[a-zA-Z+]+);base64,(.+)$/,
      );
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1]!,
            data: match[2]!,
          },
        });
      }
    }

    const promptText = `Analyze this social notification, screenshot, or raw pasted message text from a phone/email.
Extract:
1. Sender's display name or handle (e.g. "Chloe", "@chloe_x", "John Smith").
2. Clean message body text.
3. Platform: one of ["imessage", "sms", "instagram", "snapchat", "email"].
4. Any candidate handles found (e.g., email address, instagram handle, phone number).

${text ? `Raw Text:\n"${text}"` : "Extract text from image."}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction:
          "You are Gem's precision AI notification parser. Extract structured contact & message details accurately.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: {
              type: Type.STRING,
              description: "Name or handle of sender",
            },
            body: {
              type: Type.STRING,
              description: "Extracted message body content",
            },
            platform: {
              type: Type.STRING,
              description:
                "Detected platform: imessage, sms, instagram, snapchat, or email",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1",
            },
            extractedHandles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
              },
            },
          },
          required: ["sender", "body", "platform"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim()) as ParsedCaptureResult;
      const validPlatforms = [
        "imessage",
        "sms",
        "instagram",
        "snapchat",
        "email",
      ];
      if (!validPlatforms.includes(parsed.platform)) {
        parsed.platform = "sms";
      }
      return parsed;
    }
  } catch (err) {
    console.error("Gemini parse error:", err);
  }

  return null;
}
