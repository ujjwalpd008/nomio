import { NextResponse } from 'next/server'
import { removeNomineeAuthToken } from '@/lib/nominee-auth'

export async function POST() {
  await removeNomineeAuthToken()
  return NextResponse.json({ success: true })
}
