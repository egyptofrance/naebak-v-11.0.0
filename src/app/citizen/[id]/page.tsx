import React from 'react';
import Layout from '@/components/Layout';

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array for now - in production this would fetch actual citizen IDs
  return [];
}

interface CitizenProfileProps {
  params: Promise<{ id: string }>;
}

const CitizenProfilePage: React.FC<CitizenProfileProps> = async ({ params }) => {
  const { id: citizenId } = await params;

  // Dummy data for now, will be replaced with API call
  const citizenData = {
    id: citizenId,
    fullName: `المواطن رقم ${citizenId}`,
    governorate: 'القاهرة',
    bio: 'هذا هو وصف عام للمواطن. يمكن أن يحتوي على معلومات عامة أو إنجازات.',
    // Add more public profile fields as needed
  };

  return (
    <Layout showBanner={false}> {/* Public profile might not need a banner */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">ملف المواطن العام</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <p className="text-gray-600">الاسم الكامل:</p>
            <p className="text-xl font-semibold">{citizenData.fullName}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">المحافظة:</p>
            <p className="text-lg">{citizenData.governorate}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">نبذة:</p>
            <p className="text-base">{citizenData.bio}</p>
          </div>
          {/* Add more public profile details here */}
        </div>
      </div>
    </Layout>
  );
};

export default CitizenProfilePage;
