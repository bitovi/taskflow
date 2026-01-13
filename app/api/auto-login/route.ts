import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value

  // If user already has a valid session, redirect to dashboard
  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    })
    if (session) {
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
    }
  }

  // No valid session - auto-login as Alice
  const alice = await prisma.user.findUnique({
    where: { email: 'alice@example.com' },
  })

  if (!alice) {
    // Alice doesn't exist, redirect to login
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  }

  // Create session for Alice
  const newSessionToken = randomBytes(32).toString('hex')
  await prisma.session.create({
    data: {
      token: newSessionToken,
      userId: alice.id,
    },
  })

  // Create response with redirect
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  
  // Set cookie based on user agent
  const headers = await import('next/headers').then(m => m.headers())
  const userAgent = (await headers).get('user-agent') || ''
  const isVSCode = userAgent.includes('Code/') && userAgent.includes('Electron/')

  if (isVSCode) {
    response.cookies.set('session', newSessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      partitioned: true,
    })
  } else {
    response.cookies.set('session', newSessionToken, {
      httpOnly: true,
      path: '/',
    })
  }

  return response
}
