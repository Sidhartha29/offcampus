import { Clock, BookOpen } from 'lucide-react';

function TimetableCard({ schedule }) {
  if (!schedule || !schedule.slots || schedule.slots.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
        <p className="text-gray-600">No classes scheduled for today</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
      <div className="space-y-3">
        {schedule.slots.map((slot, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-gray-800">
                    {slot.start} - {slot.end}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700 font-medium">{slot.course}</span>
                </div>
                {slot.type && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    {slot.type}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimetableCard;

