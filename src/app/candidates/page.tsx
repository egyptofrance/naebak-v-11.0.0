import { createClient } from '@/_lib/supabase-client';

interface Candidate {
  id: string;
  full_name: string;
  candidate_type: string;
  governorate: string;
  electoral_district: string;
  party: string;
  electoral_symbol: string;
  electoral_number: string;
  gender?: string;
  profile_image?: string;
  rating?: number;
  points?: number;
}

// Get all unique governorates for the dropdown
async function getGovernorates() {
  const supabase = createClient();
  const { data } = await supabase
    .from('candidates')
    .select('governorate')
    .not('governorate', 'is', null);
  
  const uniqueGovernorates = [...new Set(data?.map(item => item.governorate))];
  return uniqueGovernorates.sort();
}

// Get all unique parties for the dropdown
async function getParties() {
  const supabase = createClient();
  const { data } = await supabase
    .from('candidates')
    .select('party')
    .not('party', 'is', null);
  
  const uniqueParties = [...new Set(data?.map(item => item.party))];
  return uniqueParties.sort();
}

// Get candidates data with filters
async function getCandidates(filters: any = {}) {
  const supabase = createClient();
  let query = supabase
    .from('candidates')
    .select('id, full_name, candidate_type, governorate, electoral_district, party, electoral_symbol, electoral_number, gender, profile_image, rating, points')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters.name) {
    query = query.ilike('full_name', `%${filters.name}%`);
  }
  if (filters.governorate) {
    query = query.eq('governorate', filters.governorate);
  }
  if (filters.party) {
    query = query.eq('party', filters.party);
  }
  if (filters.candidate_type) {
    query = query.eq('candidate_type', filters.candidate_type);
  }
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }

  return data || [];
}

export default async function CandidatesPage({ searchParams }: { searchParams: any }) {
  // Get filter options
  const governorates = await getGovernorates();
  const parties = await getParties();
  
  // Get filtered candidates
  const candidates = await getCandidates(searchParams);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        المرشحين للانتخابات
      </h1>

      {/* Filters Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Search */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="البحث بالاسم"
              defaultValue={searchParams.name || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Governorate Filter */}
          <div>
            <select
              name="governorate"
              defaultValue={searchParams.governorate || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">جميع المحافظات</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          {/* Party Filter */}
          <div>
            <select
              name="party"
              defaultValue={searchParams.party || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">جميع الأحزاب</option>
              {parties.map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>

          {/* Candidate Type Filter */}
          <div>
            <select
              name="candidate_type"
              defaultValue={searchParams.candidate_type || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">جميع أنواع الترشح</option>
              <option value="مرشح نواب">مرشح نواب</option>
              <option value="مرشح شيوخ">مرشح شيوخ</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              name="gender"
              defaultValue={searchParams.gender || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">جميع الأنواع</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              بحث
            </button>
            <a
              href="/candidates"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              إعادة تعيين
            </a>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <p className="mb-6 text-gray-600">
        عدد النتائج: {candidates.length} مرشح
      </p>

      {/* Candidates Grid */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {candidate.profile_image ? (
                  <img 
                    src={candidate.profile_image} 
                    alt={candidate.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">👤</span>
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
                {candidate.full_name}
              </h3>

              {/* Candidate Type */}
              <p className="text-center text-red-600 font-semibold mb-2">
                {candidate.candidate_type}
              </p>

              {/* Governorate and District */}
              <p className="text-center text-gray-600 mb-2">
                {candidate.governorate} - {candidate.electoral_district}
              </p>

              {/* Party */}
              <p className="text-center text-green-600 text-sm font-medium mb-3">
                {candidate.party}
              </p>

              {/* Electoral Symbol and Number */}
              <div className="flex justify-center gap-4 mb-3 text-sm text-gray-600">
                <span>الرمز: {candidate.electoral_symbol}</span>
                <span>الرقم: {candidate.electoral_number}</span>
              </div>

              {/* Rating */}
              <div className="flex justify-center items-center mb-2">
                {renderStars(candidate.rating || 0)}
                <span className="text-sm text-gray-600 mr-2">
                  ({candidate.rating?.toFixed(1) || '0.0'})
                </span>
              </div>

              {/* Points */}
              <p className="text-center text-sm text-gray-500 mb-4">
                النقاط المكتسبة: {candidate.points || 0}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm transition-colors">
                  إرسال رسالة
                </button>
                <a 
                  href={`/candidates/${candidate.full_name.replace(/\s+/g, '-')}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  عرض الملف الشخصي
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد نتائج تطابق معايير البحث</p>
        </div>
      )}
    </div>
  );
}
