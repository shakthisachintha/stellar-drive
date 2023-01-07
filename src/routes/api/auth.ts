import * as AWS from "aws-sdk";
import { Router } from "express";
import { AWS_CONFIG } from "../../configs";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken";

const router = Router();

// Configure the AWS SDK with your Cognito User Pool details
const CLIENT_ID = AWS_CONFIG.CognitoIdentityCredentials.ClientID;
const CLIENT_SECRET = AWS_CONFIG.CognitoIdentityCredentials.ClientSecret;
const IDENTITY_POOL_ID = AWS_CONFIG.CognitoIdentityCredentials.IdentityPoolId;
const REGION = AWS_CONFIG.region;

AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  }),
});

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

router.post("/register", async (req, res) => {
  const { username, password, email, name } = req.body;

  // Generate the hash required by Cognito
  const hasher = createHmac("sha256", CLIENT_SECRET);
  hasher.update(`${username}${CLIENT_ID}`);
  const SecretHash = hasher.digest("base64");

  // Register the user in Cognito
  cognitoIdentityServiceProvider.signUp(
    {
      ClientId: CLIENT_ID,
      SecretHash,
      Password: password,
      UserAttributes: [
        { Name: "name", Value: name },
        { Name: "email", Value: email },
      ],
      Username: username,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Registration failed!" });
        return;
      }

      // If the user was created successfully, send a response to the client
      res.status(200).json({
        result,
        message:
          "User registered successfully. Please check your email for verification.",
      });
    }
  );
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Generate the hash required by Cognito
    const hasher = createHmac("sha256", CLIENT_SECRET);
    hasher.update(`${username}${CLIENT_ID}`);
    const SecretHash = hasher.digest("base64");

    // Use the authenticateUser method to verify the user's credentials
    cognitoIdentityServiceProvider.initiateAuth({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      
      AuthParameters: {
        'USERNAME': username,
        'PASSWORD': password,
        'SECRET_HASH': SecretHash
      }
    }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(err.statusCode || 500).json({ error: err.message || 'Login failed!' });
        return;
      }
  
      // If the credentials are valid, send the authentication token to the client
      const idToken = result?.AuthenticationResult?.IdToken;
      // decode the idToken to get the user's username
      const decodedToken = jwt.decode(idToken as string) as any;
      const username = decodedToken['cognito:username']
      const name = decodedToken['name']

      res.status(200).json({
        user: {
          username,name
        } ,
        token: result.AuthenticationResult?.AccessToken
      });
    });
  });
export default router;
