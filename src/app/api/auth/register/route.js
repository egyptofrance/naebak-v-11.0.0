import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    const response = await fetch('https://naebak-auth-service-472518.uc.r.appspot.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error('Registration proxy error:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}
