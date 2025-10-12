import * as jwt from "jsonwebtoken";

export interface JwtToken { id: string|number; [key: string]: any; }

export function verifyToken(token: string): JwtToken {
  if (token.startsWith("Bearer ")) token = token.slice(7);
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtToken;
}
