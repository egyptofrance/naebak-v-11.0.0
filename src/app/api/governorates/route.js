import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://naebak-auth-service-472518.uc.r.appspot.com/api/governorates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error('Governorates proxy error:', error)
    // Fallback data if external service is not available
    const fallbackData = {
      governorates: [
        { id: 1, name: 'القاهرة' },
        { id: 2, name: 'الجيزة' },
        { id: 3, name: 'الإسكندرية' },
        { id: 4, name: 'الدقهلية' },
        { id: 5, name: 'الشرقية' },
        { id: 6, name: 'القليوبية' },
        { id: 7, name: 'كفر الشيخ' },
        { id: 8, name: 'الغربية' },
        { id: 9, name: 'المنوفية' },
        { id: 10, name: 'البحيرة' },
        { id: 11, name: 'الإسماعيلية' },
        { id: 12, name: 'بورسعيد' },
        { id: 13, name: 'السويس' },
        { id: 14, name: 'المنيا' },
        { id: 15, name: 'بني سويف' },
        { id: 16, name: 'الفيوم' },
        { id: 17, name: 'أسيوط' },
        { id: 18, name: 'سوهاج' },
        { id: 19, name: 'قنا' },
        { id: 20, name: 'الأقصر' },
        { id: 21, name: 'أسوان' },
        { id: 22, name: 'البحر الأحمر' },
        { id: 23, name: 'الوادي الجديد' },
        { id: 24, name: 'مطروح' },
        { id: 25, name: 'شمال سيناء' },
        { id: 26, name: 'جنوب سيناء' },
        { id: 27, name: 'دمياط' }
      ]
    }
    return NextResponse.json(fallbackData, { status: 200 })
  }
}
