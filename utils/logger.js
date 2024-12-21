import fs from 'fs/promises';
import path from 'path';

async function logTweet(tweet, success = true) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        tweet,
        success,
        engagement: null  // To be filled later with metrics
    };
    
    await fs.appendFile(
        path.join(process.cwd(), 'tweets.log'),
        JSON.stringify(logEntry) + '\n'
    );
}

export { logTweet }; 