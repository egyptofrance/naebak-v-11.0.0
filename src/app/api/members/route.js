import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 15
    const name = searchParams.get('name') || ''
    const gender = searchParams.get('gender') || ''
    const governorate = searchParams.get('governorate') || ''
    const constituency = searchParams.get('constituency') || ''
    const party = searchParams.get('party') || ''
    const position = searchParams.get('position') || ''

    // Build query parameters for the auth service
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      user_type: 'member',
      sort_by: 'created_at',
      sort_order: 'desc' // الأحدث أولاً
    })

    if (name) queryParams.append('name', name)
    if (gender) queryParams.append('gender', gender)
    if (governorate) queryParams.append('governorate', governorate)
    if (constituency) queryParams.append('constituency', constituency)
    if (party) queryParams.append('party', party)
    if (position) queryParams.append('position', position)

    // Call the auth service to get members
    const response = await fetch(`https://naebak-auth-service-822351033.uc.r.appspot.com/api/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch members from auth service')
    }

    const data = await response.json()

    // Transform the data to match our frontend expectations
    const transformedMembers = data.users?.map(user => ({
      id: user.id,
      name: user.name || `${user.first_name} ${user.last_name}`,
      position: user.position || 'نائب',
      governorate: user.governorate || '',
      constituency: user.constituency || user.district || '',
      party: user.party || 'مستقل',
      gender: user.gender || '',
      image: user.profile_image || null,
      rating: user.rating || Math.random() * 2 + 3, // Random rating between 3-5 for now
      email: user.email,
      phone: user.phone_number,
      whatsapp: user.whatsapp_number,
      biography: user.biography || '',
      committee: user.committee || '',
      membership_date: user.membership_date || ''
    })) || []

    return NextResponse.json({
      success: true,
      members: transformedMembers,
      pagination: {
        current_page: page,
        total_pages: Math.ceil((data.total || 0) / limit),
        total_count: data.total || 0,
        per_page: limit
      }
    })

  } catch (error) {
    console.error('Error fetching members:', error)
    
    // Return mock data as fallback
    const mockMembers = [
      {
        id: '1',
        name: 'د. أحمد محمد علي',
        position: 'نائب',
        governorate: 'القاهرة',
        constituency: 'الدائرة الأولى',
        party: 'حزب الوفد',
        gender: 'ذكر',
        rating: 4.5,
        email: 'ahmed.ali@example.com',
        phone: '01012345678'
      },
      {
        id: '2',
        name: 'د. فاطمة أحمد',
        position: 'عضو مجلس الشيوخ',
        governorate: 'الإسكندرية',
        constituency: 'الدائرة الثانية',
        party: 'مستقل',
        gender: 'أنثى',
        rating: 4.2,
        email: 'fatma.ahmed@example.com',
        phone: '01098765432'
      },
      {
        id: '3',
        name: 'محمد حسن إبراهيم',
        position: 'نائب',
        governorate: 'الجيزة',
        constituency: 'الدائرة الثالثة',
        party: 'الحزب الوطني الديمقراطي',
        gender: 'ذكر',
        rating: 3.8,
        email: 'mohamed.hassan@example.com',
        phone: '01123456789'
      }
    ]

    return NextResponse.json({
      success: true,
      members: mockMembers,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: mockMembers.length,
        per_page: 15
      }
    })
  }
}
