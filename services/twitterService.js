import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Validate Twitter credentials before creating client
const validateCredentials = () => {
    const required = [
        'TWITTER_API_KEY',
        'TWITTER_API_SECRET',
        'TWITTER_ACCESS_TOKEN',
        'TWITTER_ACCESS_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing Twitter credentials: ${missing.join(', ')}`);
    }
};

validateCredentials();

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Track last tweet time
let lastTweetTime = 0;
const MIN_TWEET_INTERVAL = 60000; // 1 minute in milliseconds

async function postTweet(tweetContent) {
    try {
        // Check if enough time has passed since last tweet
        const now = Date.now();
        const timeSinceLastTweet = now - lastTweetTime;
        
        if (timeSinceLastTweet < MIN_TWEET_INTERVAL) {
            const waitTime = MIN_TWEET_INTERVAL - timeSinceLastTweet;
            console.log(`Waiting ${waitTime/1000} seconds before next tweet...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        const tweet = await client.v2.tweet(tweetContent);
        lastTweetTime = Date.now();
        return tweet;
    } catch (error) {
        if (error.code === 429) { // Rate limit error
            const resetTime = error.rateLimit?.reset;
            if (resetTime) {
                const waitTime = (resetTime * 1000) - Date.now();
                console.log(`Rate limited. Waiting ${waitTime/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return postTweet(tweetContent); // Retry after waiting
            }
        }
        console.error('Error posting to Twitter:', error);
        throw error;
    }
}

export { postTweet }; 