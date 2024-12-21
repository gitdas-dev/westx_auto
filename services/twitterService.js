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

async function postTweet(tweetContent) {
    try {
        const tweet = await client.v2.tweet(tweetContent);
        return tweet;
    } catch (error) {
        console.error('Error posting to Twitter:', error);
        throw error;
    }
}

export { postTweet }; 