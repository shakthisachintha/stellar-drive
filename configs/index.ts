import * as dotenv from 'dotenv';
dotenv.config();

export const AWS_CONFIG = {
    region: process.env.AWS_REGION || "us-east-1",
    CognitoIdentityCredentials: {
        IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID || "IDENTITY_POOL_ID",
        ClientID: process.env.COGNITO_CLIENT_ID || "CLIENT_ID",
        ClientSecret: process.env.COGNITO_CLIENT_SECRET || "CLIENT_SECRET",
    },
    JWKS: {
        Kid: process.env.JWKS_KID || "KID",
        N: process.env.JWKS_N || "N",
    }

}

export const APP_CONFIG = {
    port: process.env.PORT || 3001,
}