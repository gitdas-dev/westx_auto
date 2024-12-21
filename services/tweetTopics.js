export const TWEET_TOPICS = [
    {
        topic: 'AI and Machine Learning',
        hashtags: ['#AI', '#MachineLearning', '#Tech'],
        prompt: 'Create a tweet about recent AI breakthroughs or applications'
    },
    {
        topic: 'Tech Innovation',
        hashtags: ['#Innovation', '#FutureTech', '#Technology'],
        prompt: 'Generate a tweet about emerging technology trends'
    },
    {
        topic: 'Coding and Development',
        hashtags: ['#Coding', '#Programming', '#DevLife'],
        prompt: 'Write a tweet about software development best practices'
    }
];

export function getRandomTopic() {
    return TWEET_TOPICS[Math.floor(Math.random() * TWEET_TOPICS.length)];
} 