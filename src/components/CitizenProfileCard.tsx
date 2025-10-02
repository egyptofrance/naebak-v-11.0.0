import React from 'react';

interface CitizenData {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  governorate: string;
  bio?: string;
  profilePicture?: string;
  isActive?: boolean;
  joinDate?: string;
}

interface CitizenProfileCardProps {
  citizen: CitizenData;
  isPublic?: boolean; // Determines which fields to show
}

const CitizenProfileCard: React.FC<CitizenProfileCardProps> = ({ citizen, isPublic = true }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        {citizen.profilePicture ? (
          <img
            src={citizen.profilePicture}
            alt={`صورة ${citizen.fullName}`}
            className="w-16 h-16 rounded-full mr-4"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
            <span className="text-gray-600 text-xl font-bold">
              {citizen.fullName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{citizen.fullName}</h2>
          <p className="text-gray-600">{citizen.governorate}</p>
          {!isPublic && citizen.isActive !== undefined && (
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              citizen.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {citizen.isActive ? 'نشط' : 'غير نشط'}
            </span>
          )}
        </div>
      </div>
      
      {citizen.bio && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">نبذة</h3>
          <p className="text-gray-600">{citizen.bio}</p>
        </div>
      )}
      
      {!isPublic && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {citizen.email && (
            <div>
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="text-gray-800">{citizen.email}</p>
            </div>
          )}
          {citizen.phoneNumber && (
            <div>
              <p className="text-sm text-gray-500">رقم الهاتف</p>
              <p className="text-gray-800">{citizen.phoneNumber}</p>
            </div>
          )}
          {citizen.joinDate && (
            <div>
              <p className="text-sm text-gray-500">تاريخ الانضمام</p>
              <p className="text-gray-800">{citizen.joinDate}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitizenProfileCard;
