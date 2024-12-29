
import{
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = `AIzaSyCtHoYajfuiFjAgRSy4eHcVfIp9faXs3fY`
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  export async function run(input) {
    const chatSession = model.startChat({
      generationConfig,
  
      history: [
      ],
    });
    
  
    const result = await chatSession.sendMessage(input);
    const response = result.response
    console.log(`jerekkre`,result)
    return response.text()
  }
  
