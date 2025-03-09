import  jwt from 'jsonwebtoken';
import { secretKey } from '../../index.js';
  
export function generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, secretKey, { expiresIn });
}
 
export function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}
 