import { User, Mail, GraduationCap } from 'lucide-react';

function MentorCard({ mentor, onRequest }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {mentor.name?.charAt(0).toUpperCase() || 'M'}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{mentor.name}</h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">ID: {mentor.userId}</span>
            </div>
            
            {mentor.profile?.college && (
              <div className="flex items-center space-x-2 text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm">{mentor.profile.college}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {onRequest && (
        <button
          onClick={() => onRequest(mentor._id)}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          Request Mentor
        </button>
      )}
    </div>
  );
}

export default MentorCard;

