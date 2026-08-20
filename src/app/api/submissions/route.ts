import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, type, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const submission = await payload.create({
      collection: 'submissions',
      data: {
        name,
        email,
        type: type || 'Something else',
        message,
        read: false,
      },
    })

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
  }
}