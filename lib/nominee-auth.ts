import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface NomineeJWTPayload {
  nomineeId: string
  phone: string
  type: 'nominee'
}

export async function hashNomineePassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyNomineePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateNomineeToken(payload: NomineeJWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyNomineeToken(token: string): NomineeJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.type === 'nominee') {
      return decoded as NomineeJWTPayload
    }
    return null
  } catch {
    return null
  }
}

export async function getCurrentNominee(): Promise<NomineeJWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('nominee-auth-token')?.value
  
  if (!token) return null
  
  return verifyNomineeToken(token)
}

export async function setNomineeAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('nominee-auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function removeNomineeAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete('nominee-auth-token')
}
