import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { generateTweet } from './services/tweetGenerator.js';
import { postTweet } from './services/twitterService.js';
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Schedule tweet generation and posting every 2 minutes
cron.schedule('*/2 * * * *', async () => {
    try {
        const tweet = await generateTweet();
        await postTweet(tweet);
        console.log('Tweet posted successfully:', tweet);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
});

app.get('/generate-tweet', async (req, res) => {
    try {
        const tweet = await generateTweet();
        await postTweet(tweet);
        res.json({ success: true, tweet });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/analytics', async (req, res) => {
    try {
        const logs = await fs.readFile(
            path.join(process.cwd(), 'tweets.log'), 
            'utf-8'
        );
        const tweets = logs.split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line));
        
        res.json({
            totalTweets: tweets.length,
            lastTweet: tweets[tweets.length - 1],
            successRate: tweets.filter(t => t.success).length / tweets.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 