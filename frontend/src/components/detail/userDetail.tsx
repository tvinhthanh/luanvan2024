import React from "react";

interface UserDetailProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    // Add more fields as needed
  };
  onClose: () => void; // Callback function to close the detail view
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">User Detail</h2>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {user.firstName} {user.lastName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Phone Number:</span>{" "}
            {user.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {user.address}
          </p>
          {/* Add more fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
