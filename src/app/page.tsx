import { createClient } from '@/_lib/supabase-client';

// Function to get statistics data for the landing page
async function getStatisticsData() {
  const supabase = createClient();
  
  // Get members count
  const { count: membersCount } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true });

  // Get candidates count  
  const { count: candidatesCount } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true });

  // Get resolved complaints count
  const { count: resolvedComplaints } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'محلولة');

  return {
    membersCount: membersCount || 0,
    candidatesCount: candidatesCount || 0,
    resolvedComplaints: resolvedComplaints || 0
  };
}

// Function to get latest members and candidates
async function getLatestMembersAndCandidates() {
  const supabase = createClient();
  
  // Get latest 4 members
  const { data: latestMembers } = await supabase
    .from('members')
    .select('id, full_name, governorate, party, rating, profile_image')
    .order('created_at', { ascending: false })
    .limit(4);

  // Get latest 4 candidates
  const { data: latestCandidates } = await supabase
    .from('candidates')
    .select('id, full_name, governorate, party, rating, profile_image')
    .order('created_at', { ascending: false })
    .limit(4);

  return {
    latestMembers: latestMembers || [],
    latestCandidates: latestCandidates || []
  };
}

export default async function HomePage() {
  // Get statistics and latest data
  const statistics = await getStatisticsData();
  const { latestMembers, latestCandidates } = await getLatestMembersAndCandidates();

  return (
    <div className="container mx-auto px-4">
      {/* Welcome Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">مرحبًا بك في منصة نائبك</h1>
        <p className="text-xl text-gray-600 mb-8">
          المنصة التي تصلك مباشرة بممثليك في البرلمان المصري
        </p>
        <a 
          href="/signup" 
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          ابدأ الآن
        </a>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gray-50 rounded-lg mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-green-700 mb-2">{statistics.membersCount}</h3>
            <p className="text-gray-600">نائب مسجل</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-green-700 mb-2">{statistics.candidatesCount}</h3>
            <p className="text-gray-600">مرشح</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-green-700 mb-2">{statistics.resolvedComplaints}</h3>
            <p className="text-gray-600">شكوى محلولة</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-green-700 mb-2">50,000+</h3>
            <p className="text-gray-600">زائر</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">الميزات الرئيسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">تقييم النواب والمرشحين</h3>
            <p className="text-gray-600">قيم أداء ممثليك وشارك رأيك</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">إرسال الشكاوى</h3>
            <p className="text-gray-600">أرسل شكواك مباشرة لممثليك</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">التواصل المباشر</h3>
            <p className="text-gray-600">تواصل مباشرة مع النواب والمرشحين</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">متابعة الأداء</h3>
            <p className="text-gray-600">تابع إنجازات وأداء ممثليك</p>
          </div>
        </div>
      </section>

      {/* Latest Members/Candidates Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">أحدث النواب والمرشحين</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...latestMembers, ...latestCandidates].slice(0, 8).map((person, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {person.profile_image ? (
                  <img 
                    src={person.profile_image} 
                    alt={person.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">👤</span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{person.full_name}</h3>
              <p className="text-gray-600 mb-2">{person.governorate}</p>
              <p className="text-sm text-gray-500 mb-3">{person.party}</p>
              <div className="flex justify-center items-center mb-4">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600 mr-2">({person.rating || 0})</span>
              </div>
              <a 
                href={`/members/${person.full_name.replace(/\s+/g, '-')}`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                عرض الملف
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-50 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">انضم إلى منصة نائبك اليوم</h2>
        <p className="text-xl text-gray-600 mb-8">
          كن جزءًا من التغيير وشارك في بناء مصر الجديدة
        </p>
        <a 
          href="/signup" 
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          انضم الآن
        </a>
      </section>
    </div>
  );
}
