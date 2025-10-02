import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const userType = body.userType || 'citizen';
    
    // Define required fields based on user type
    let requiredFields = ['name', 'email', 'password', 'phone'];
    
    if (userType === 'citizen') {
      requiredFields = ['firstName', 'lastName', 'nationalId', 'email', 'password', 'phone', 'governorate', 'city', 'gender'];
    } else if (userType === 'member') {
      requiredFields = ['name', 'email', 'password', 'phone', 'whatsapp', 'position', 'governorate', 'district'];
    } else if (userType === 'candidate') {
      requiredFields = ['name', 'email', 'password', 'phone', 'whatsapp', 'candidateType', 'governorate', 'district', 'electoralSymbol', 'electoralNumber'];
    }
    
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'بعض الحقول المطلوبة مفقودة',
        errors: missingFields.reduce((acc, field) => {
          acc[field] = 'هذا الحقل مطلوب';
          return acc;
        }, {})
      }, { status: 400 });
    }

    // Prepare registration data based on user type
    let registrationData = {
      email: body.email,
      password: body.password,
      user_type: userType
    };

    if (userType === 'citizen') {
      registrationData = {
        ...registrationData,
        first_name: body.firstName,
        last_name: body.lastName,
        phone_number: body.phone,
        whatsapp_number: body.whatsapp || body.phone,
        national_id: body.nationalId,
        birth_date: body.birthDate,
        gender: body.gender,
        governorate: body.governorate,
        city: body.city,
        center: body.center || '',
        district: body.district || '',
        village: body.village || '',
        street: body.street || '',
        house_number: body.houseNumber || '',
        password: body.nationalId // Use national ID as default password for citizens
      };
    } else if (userType === 'member') {
      registrationData = {
        ...registrationData,
        name: body.name,
        phone_number: body.phone,
        whatsapp_number: body.whatsapp,
        position: body.position,
        governorate: body.governorate,
        constituency: body.district, // Map district to constituency
        committee: body.committee || '',
        membership_date: body.membershipDate || new Date().toISOString().split('T')[0],
        biography: body.biography || '',
        party: body.party || 'مستقل'
      };
    } else if (userType === 'candidate') {
      registrationData = {
        ...registrationData,
        name: body.name,
        phone_number: body.phone,
        whatsapp_number: body.whatsapp,
        candidate_type: body.candidateType,
        governorate: body.governorate,
        constituency: body.district, // Map district to constituency
        electoral_symbol: body.electoralSymbol,
        electoral_number: body.electoralNumber,
        profession: body.profession || '',
        biography: body.biography || '',
        electoral_program: body.electoralProgram || '',
        party: body.party || 'مستقل'
      };
    }
    
    // Call the auth service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://naebak-auth-service-822351033.uc.r.appspot.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId);

    const result = await response.json()

    if (response.ok) {
      // Determine redirect URL based on user type
      let redirectUrl = '/citizen/dashboard';
      if (userType === 'member') {
        redirectUrl = '/member/dashboard';
      } else if (userType === 'candidate') {
        redirectUrl = '/candidate/dashboard';
      }

      return NextResponse.json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: result.user,
        token: result.token || 'demo-token',
        redirect: redirectUrl
      })
    } else {
      // Handle specific error cases
      let errorMessage = result.message || 'حدث خطأ أثناء إنشاء الحساب';
      let errors = {};

      if (result.detail) {
        if (result.detail.includes('email')) {
          errors.email = 'البريد الإلكتروني مستخدم بالفعل';
        }
        if (result.detail.includes('national_id')) {
          errors.nationalId = 'الرقم القومي مستخدم بالفعل';
        }
        if (result.detail.includes('phone')) {
          errors.phone = 'رقم الهاتف مستخدم بالفعل';
        }
      }

      return NextResponse.json({
        success: false,
        message: errorMessage,
        errors: errors
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // More specific error messages
    let errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.';
    
    if (error.message.includes('fetch')) {
      errorMessage = 'خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'خطأ في معالجة البيانات. تأكد من صحة البيانات المدخلة.';
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
