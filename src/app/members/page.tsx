import { createClient } from '@/_lib/supabase-client';
import MembersFilter from '@/components/MembersFilter';
import MemberCard from '@/components/MemberCard';

interface Member {
  id: string;
  full_name: string;
  council: string;
  governorate: string;
  electoral_district: string;
  party: string;
  gender?: string;
  profile_image?: string;
  rating?: number;
  points?: number;
}

// Get all unique governorates for the dropdown
async function getGovernorates() {
  const supabase = createClient();
  const { data } = await supabase
    .from('members')
    .select('governorate')
    .not('governorate', 'is', null);
  
  const uniqueGovernorates = [...new Set(data?.map(item => item.governorate))];
  return uniqueGovernorates.sort();
}

// Get all unique parties for the dropdown
async function getParties() {
  const supabase = createClient();
  const { data } = await supabase
    .from('members')
    .select('party')
    .not('party', 'is', null);
  
  const uniqueParties = [...new Set(data?.map(item => item.party))];
  return uniqueParties.sort();
}

// Get members data with filters
async function getMembers(filters: any = {}) {
  const supabase = createClient();
  let query = supabase
    .from('members')
    .select('id, full_name, council, governorate, electoral_district, party, gender, profile_image, rating, points')
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
  if (filters.council) {
    query = query.eq('council', filters.council);
  }
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }

  return data || [];
}

export default async function MembersPage({ searchParams }: { searchParams: any }) {
  // Get filter options
  const governorates = await getGovernorates();
  const parties = await getParties();
  
  // Get filtered members
  const members = await getMembers(searchParams);

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
        أعضاء البرلمان
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

          {/* Council Filter */}
          <div>
            <select
              name="council"
              defaultValue={searchParams.council || ''}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">جميع المجالس</option>
              <option value="مجلس النواب">مجلس النواب</option>
              <option value="مجلس الشيوخ">مجلس الشيوخ</option>
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
              href="/members"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            >
              إعادة تعيين
            </a>
          </div>
        </form>
      </div>

      {/* Results Count */}
      <p className="mb-6 text-gray-600">
        عدد النتائج: {members.length} عضو
      </p>

      {/* Members Grid */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {member.profile_image ? (
                  <img 
                    src={member.profile_image} 
                    alt={member.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">👤</span>
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
                {member.full_name}
              </h3>

              {/* Council */}
              <p className="text-center text-blue-600 font-semibold mb-2">
                {member.council}
              </p>

              {/* Governorate and District */}
              <p className="text-center text-gray-600 mb-2">
                {member.governorate} - {member.electoral_district}
              </p>

              {/* Party */}
              <p className="text-center text-green-600 text-sm font-medium mb-3">
                {member.party}
              </p>

              {/* Rating */}
              <div className="flex justify-center items-center mb-2">
                {renderStars(member.rating || 0)}
                <span className="text-sm text-gray-600 mr-2">
                  ({member.rating?.toFixed(1) || '0.0'})
                </span>
              </div>

              {/* Points */}
              <p className="text-center text-sm text-gray-500 mb-4">
                النقاط المكتسبة: {member.points || 0}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm transition-colors">
                  إرسال رسالة
                </button>
                <a 
                  href={`/members/${member.full_name.replace(/\s+/g, '-')}`}
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
