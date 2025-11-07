import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

function BookingCard({ booking, onCancel }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">{booking.resource}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{booking.from} - {booking.to}</span>
            </div>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      {booking.status === 'confirmed' && onCancel && (
        <button
          onClick={() => onCancel(booking._id)}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Booking</span>
        </button>
      )}
    </div>
  );
}

export default BookingCard;

