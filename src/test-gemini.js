import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test function with retry logic
async function testGeminiAPI(maxRetries = 3, retryDelay = 2000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 Starting Gemini API test (Attempt ${attempt}/${maxRetries})...`);
      
      // Validate API key
      const apiKey = "AIzaSyCHpsT2PdjtdPeo2nXG8ricg7SVKFlqryQ";
      if (!apiKey) {
        throw new Error("API key is missing");
      }
      console.log("🔑 API Key present:", apiKey ? "Yes" : "No");
      
      // Initialize API with error handling
      let genAI;
      try {
        genAI = new GoogleGenerativeAI(apiKey);
        console.log("✅ API client initialized successfully");
      } catch (initError) {
        console.error("Failed to initialize API client:", initError);
        throw initError;
      }
      
      // Get model with minimal configuration
      let model;
      try {
        model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("🤖 Model 'gemini-2.0-flash' retrieved successfully");
      } catch (modelError) {
        console.error("Failed to get model:", modelError);
        throw modelError;
      }
      
      // Test with the correct payload format
      const prompt = {
        contents: [{
          parts: [{ text: "Explain how AI works" }]
        }]
      };
      console.log("📝 Sending prompt:", JSON.stringify(prompt, null, 2));
      
      let result;
      try {
        result = await model.generateContent(prompt);
        console.log("📥 Received response from API");
      } catch (generateError) {
        console.error("Failed to generate content:", generateError);
        throw generateError;
      }
      
      const response = await result.response;
      const text = response.text();
      
      console.log("📋 Response text:", text);
      console.log("✅ Test completed successfully");
      return text;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed with error:`, error);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
        await wait(retryDelay);
      }
    }
  }
  
  console.error("💥 All attempts failed. Last error:", lastError);
  throw lastError;
}

// Run the test
console.log("🏁 Starting test execution...");
testGeminiAPI()
  .then(result => {
    console.log("🎉 Test successful! Final result:", result);
    process.exit(0); // Exit with success code
  })
  .catch(error => {
    console.error("💥 Test failed! Error:", error);
    process.exit(1); // Exit with error code
  }); 