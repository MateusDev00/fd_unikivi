import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback';

export interface JwtPayload {
  id: number;
  bilhete: string;
  tipo: 'admin' | 'estudante' | 'docente';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  } as any);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return verifyToken(header.slice(7));
  } catch {
    return null;
  }
}