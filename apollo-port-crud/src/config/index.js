import { config } from 'dotenv';

const { parsed } = config();

export const {
    PORT,
    MODE,
    BASE_URL,
    SECRET,
    IN_PROD = MODE == 'prod',
    DB = 'mongodb://localhost:27017/post-gql-app',
    URL = `${BASE_URL}:${PORT}`
} = parsed;