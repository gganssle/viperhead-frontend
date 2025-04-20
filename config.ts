// Configuration file for the application
interface Config {
    GOOGLE_IOS_CLIENT_ID: string;
    ALLOWED_EMAILS: string[];
    SERVER: {
        BASE_URL: string;
        ENDPOINTS: {
            HEALTH_CHECK: string;
            GENERATE_IMAGE: string;
        };
    };
}

export const CONFIG: Config = {
    GOOGLE_IOS_CLIENT_ID: '862228002068-ak3bk6d92p31s8rli3uctqvkiu6lputn.apps.googleusercontent.com',
    ALLOWED_EMAILS: [
        // Add whitelisted email addresses here
        'grahamganssle@gmail.com',
        'claire.elise.r@gmail.com'
    ],
    SERVER: {
        BASE_URL: 'http://localhost:8000',
        ENDPOINTS: {
            HEALTH_CHECK: '/',
            GENERATE_IMAGE: '/generate-image'
        }
    }
};
