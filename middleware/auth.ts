import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import jwkToPem from 'jwk-to-pem';
import {jwks} from './jwks';

const pem = jwkToPem(jwks as any);

export interface RequestWithUser extends Request {
    user: any;
}

export const auth = (req: RequestWithUser, res: Response, next: NextFunction)=>{
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");
  try {
    const decoded = jwt.verify(token, pem);
    req.user= decoded;
    next();
  } catch (ex) {
    return res.status(401).send("Access denied, invalid token provided");
  }
}
