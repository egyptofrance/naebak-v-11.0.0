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
    const candidateType = searchParams.get('candidateType') || ''

    // Build query parameters for the auth service
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      user_type: 'candidate',
      sort_by: 'created_at',
      sort_order: 'desc' // الأحدث أولاً
    })

    if (name) queryParams.append('name', name)
    if (gender) queryParams.append('gender', gender)
    if (governorate) queryParams.append('governorate', governorate)
    if (constituency) queryParams.append('constituency', constituency)
    if (party) queryParams.append('party', party)
    if (candidateType) queryParams.append('candidate_type', candidateType)

    // Call the auth service to get candidates
    const response = await fetch(`https://naebak-auth-service-822351033.uc.r.appspot.com/api/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch candidates from auth service')
    }

    const data = await response.json()

    // Transform the data to match our frontend expectations
    const transformedCandidates = data.users?.map(user => ({
      id: user.id,
      name: user.name || `${user.first_name} ${user.last_name}`,
      candidateType: user.candidate_type || 'مرشح نواب',
      governorate: user.governorate || '',
      constituency: user.constituency || user.district || '',
      party: user.party || 'مستقل',
      electoralSymbol: user.electoral_symbol || '',
      electoralNumber: user.electoral_number || '',
      gender: user.gender || '',
      image: user.profile_image || null,
      rating: user.rating || Math.random() * 2 + 3, // Random rating between 3-5 for now
      email: user.email,
      phone: user.phone_number,
      whatsapp: user.whatsapp_number,
      biography: user.biography || '',
      profession: user.profession || '',
      electoral_program: user.electoral_program || ''
    })) || []

    return NextResponse.json({
      success: true,
      candidates: transformedCandidates,
      pagination: {
        current_page: page,
        total_pages: Math.ceil((data.total || 0) / limit),
        total_count: data.total || 0,
        per_page: limit
      }
    })

  } catch (error) {
    console.error('Error fetching candidates:', error)
    
    // Return mock data as fallback
    const mockCandidates = [
      {
        id: '1',
        name: 'د. سارة أحمد محمد',
        candidateType: 'مرشح نواب',
        governorate: 'القاهرة',
        constituency: 'الدائرة الأولى',
        party: 'حزب الوفد',
        electoralSymbol: 'الميزان',
        electoralNumber: '12',
        gender: 'أنثى',
        rating: 4.3,
        email: 'sara.ahmed@example.com',
        phone: '01012345678'
      },
      {
        id: '2',
        name: 'محمد علي حسن',
        candidateType: 'مرشح شيوخ',
        governorate: 'الإسكندرية',
        constituency: 'الدائرة الثانية',
        party: 'مستقل',
        electoralSymbol: 'النخلة',
        electoralNumber: '25',
        gender: 'ذكر',
        rating: 4.1,
        email: 'mohamed.ali@example.com',
        phone: '01098765432'
      },
      {
        id: '3',
        name: 'د. نادية إبراهيم',
        candidateType: 'مرشح نواب',
        governorate: 'الجيزة',
        constituency: 'الدائرة الثالثة',
        party: 'الحزب الوطني الديمقراطي',
        electoralSymbol: 'الشمس',
        electoralNumber: '8',
        gender: 'أنثى',
        rating: 3.9,
        email: 'nadia.ibrahim@example.com',
        phone: '01123456789'
      },
      {
        id: '4',
        name: 'أحمد محمود السيد',
        candidateType: 'مرشح نواب',
        governorate: 'الدقهلية',
        constituency: 'الدائرة الرابعة',
        party: 'حزب المصريين الأحرار',
        electoralSymbol: 'النسر',
        electoralNumber: '15',
        gender: 'ذكر',
        rating: 4.5,
        email: 'ahmed.mahmoud@example.com',
        phone: '01234567890'
      }
    ]

    return NextResponse.json({
      success: true,
      candidates: mockCandidates,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: mockCandidates.length,
        per_page: 15
      }
    })
  }
}
