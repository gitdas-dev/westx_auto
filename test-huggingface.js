import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function testToken() {
    try {
        const response = await hf.textGeneration({
            model: "distilgpt2",
            inputs: "Hello, how are"
        });
        console.log("Success!", response.generated_text);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testToken(); 