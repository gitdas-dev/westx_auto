import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error('HUGGINGFACE_API_KEY is not set in environment variables');
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
// Using a smaller, more reliable model
const MODEL = "distilgpt2";

// Expanded arrays for more variety
const TOPICS = [
    "AI", "Machine Learning", "Blockchain", "IoT", "Cloud Computing",
    "Cybersecurity", "Data Science", "Robotics", "5G", "Web3",
    "Virtual Reality", "Quantum Computing", "Edge Computing", "DevOps", "FinTech"
];

const EMOJIS = ['🚀', '💡', '🤖', '⚡', '🔥', '💻', '🌟', '🎯', '🔮', '🎲', '🌈', '⭐', '📱', '🔋', '🎮'];
const PREFIXES = [
    "Breaking:", "Tech Update:", "Innovation Alert:", "New Development:",
    "Tech Trend:", "Just In:", "Hot Take:", "Quick Update:", "Tech News:"
];

const FALLBACK_TWEETS = [
    "Exploring the latest in AI technology! The future is here 🚀 #TechNews",
    "Innovation never stops in the tech world! New breakthroughs daily 💡 #Innovation",
    "The digital transformation continues to reshape our world 🌐 #Technology",
    "AI and machine learning are evolving faster than ever ⚡ #AI #Tech",
    "Big data is revolutionizing how we make decisions 📊 #BigData"
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function addUniqueElements(tweet) {
    const timestamp = new Date().toLocaleTimeString();
    const randomId = Math.random().toString(36).substring(7);
    const emoji1 = getRandomElement(EMOJIS);
    const emoji2 = getRandomElement(EMOJIS.filter(e => e !== emoji1));
    const topic = getRandomElement(TOPICS);
    const prefix = getRandomElement(PREFIXES);

    return `${prefix} ${tweet} ${emoji1} #${topic} ${emoji2} (${timestamp}-${randomId})`;
}

async function generateTweet(retries = 8) {
    while (retries > 0) {
        try {
            const selectedTopic = getRandomElement(TOPICS);
            const prompt = `Write a brief, engaging tech insight about ${selectedTopic}. Be creative and informative. Keep it under 150 characters.`;

            const response = await hf.textGeneration({
                model: MODEL,
                inputs: prompt,
                parameters: {
                    max_new_tokens: 75,
                    temperature: 0.95,
                    top_p: 0.95,
                    do_sample: true,
                    return_full_text: false,
                    repetition_penalty: 1.2
                }
            });

            let tweet = response.generated_text.trim();
            tweet = tweet.replace(/^["']|["']$/g, '').trim();
            
            // If generated tweet is empty, use a fallback
            if (!tweet || tweet.length === 0) {
                tweet = getRandomElement(FALLBACK_TWEETS);
            }

            const uniqueTweet = addUniqueElements(tweet);
            return uniqueTweet.length > 280 ? uniqueTweet.substring(0, 277) + "..." : uniqueTweet;
            
        } catch (error) {
            console.error(`Error generating tweet: ${error.message}`);
            if (retries === 1) {
                // Use fallback on final retry
                const fallbackTweet = addUniqueElements(getRandomElement(FALLBACK_TWEETS));
                return fallbackTweet;
            }
            console.warn(`Retrying tweet generation. Attempts left: ${retries - 1}`);
            retries--;
            await new Promise(resolve => setTimeout(resolve, (9 - retries) * 1000));
        }
    }
    throw new Error('Failed to generate tweet after all retries');
}

export { generateTweet };