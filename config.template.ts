// Rename this file to config.ts and add your OpenAI API key
interface Config {
    OPENAI_API_KEY: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    ALLOWED_EMAILS: string[];
}

export const CONFIG: Config = {
    OPENAI_API_KEY: 'your-api-key-here',
    GOOGLE_CLIENT_ID: 'your-google-client-id-here',
    GOOGLE_CLIENT_SECRET: 'your-google-client-secret-here',
    ALLOWED_EMAILS: [
        // Add whitelisted email addresses here
        'example@gmail.com'
    ]
};
