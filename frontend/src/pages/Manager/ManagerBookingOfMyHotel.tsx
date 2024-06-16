import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";

const ManagerBookingOfMyHotel = () => {
  const queryClient = useQueryClient();
  const { data: bookings, error, isLoading } = useQuery("fetchBookings", apiClient.fetchBookings);

  const deleteBookingMutation = useMutation(apiClient.deleteBooking, {
    onSuccess: () => queryClient.invalidateQueries("fetchBookings"),
  });

 
  const handleDelete = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading bookings</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking: any) => (
            <tr key={booking._id}>
              <td className="px-6 py-4 whitespace-nowrap">{booking.Name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.checkIn).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.checkOut).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{booking.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="inline-flex items-center px-2 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerBookingOfMyHotel;
