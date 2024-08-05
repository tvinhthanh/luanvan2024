import React from 'react';

type OwnerDetailsProps = {
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
  };
  onClose: () => void;
};

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ owner, onClose }) => {
  const ownerDetailsStyles = `
    .owner-details {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    }

    .owner-details-content {
      max-width: 400px;
      width: 100%;
    }
  `;

  return (
    <>
      <style>{ownerDetailsStyles}</style>
      <div className="owner-details">
        <div className="owner-details-content">
          <h2 className="text-xl font-bold mb-4">Owner Details</h2>
          <p><strong>Name:</strong> {owner.name}</p>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>Phone:</strong> {owner.phone}</p>
          {owner.image && (
            <img src={owner.image} alt={`${owner.name}'s image`} className="mt-4 w-32 h-32 object-cover rounded-full" />
          )}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-500 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring focus:ring-gray-200 disabled:opacity-25 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default OwnerDetails;
