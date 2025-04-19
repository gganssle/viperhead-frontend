
// Rename this file to config.ts and add your OpenAI API key
interface Config {
    GOOGLE_IOS_CLIENT_ID: string;
    ALLOWED_EMAILS: string[];
}

export const CONFIG: Config = {
    GOOGLE_IOS_CLIENT_ID: '862228002068-ak3bk6d92p31s8rli3uctqvkiu6lputn.apps.googleusercontent.com',
    ALLOWED_EMAILS: [
        // Add whitelisted email addresses here
        'grahamganssle@gmail.com',
        'claire.elise.r@gmail.com'
    ]
};
