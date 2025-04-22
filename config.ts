// Configuration file for the application
interface Config {
    GOOGLE_IOS_CLIENT_ID: string;
    GOOGLE_WEB_CLIENT_ID: string;
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
    GOOGLE_WEB_CLIENT_ID: '862228002068-4kgrmu9afg73gbataouspfjhkme6de0s.apps.googleusercontent.com',
    ALLOWED_EMAILS: [
        // Add whitelisted email addresses here
        'grahamganssle@gmail.com',
        'atester093@gmail.com'
    ],
    SERVER: {
        // BASE_URL: 'http://localhost:8000',
        BASE_URL: 'https://viperhead-server-862228002068.us-central1.run.app',
        ENDPOINTS: {
            HEALTH_CHECK: '/',
            GENERATE_IMAGE: '/generate-image'
        }
    }
};
