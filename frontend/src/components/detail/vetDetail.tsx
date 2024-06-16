import React from 'react';

type VetDetailsProps = {
  vet: {
    _id: string;
    name: string;
    address: string;
    phone: string;
    service: string;
    image?: string;
  };
  onClose: () => void;
};

const VetDetails: React.FC<VetDetailsProps> = ({ vet, onClose }) => {
  const vetDetailsStyles = `
    .vet-details {
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

    .vet-details-content {
      max-width: 400px;
      width: 100%;
    }
  `;

  return (
    <>
      <style>{vetDetailsStyles}</style>
      <div className="vet-details">
        <div className="vet-details-content">
          <h2 className="text-xl font-bold mb-4">Vet Details</h2>
          <p><strong>ID:</strong> {vet._id}</p>
          <p><strong>Name:</strong> {vet.name}</p>
          <p><strong>Address:</strong> {vet.address}</p>
          <p><strong>Phone:</strong> {vet.phone}</p>
          <p><strong>Service:</strong> {vet.service}</p>
          {vet.image && (
            <img src={vet.image} alt={`${vet.name}'s image`} className="mt-4 w-32 h-32 object-cover rounded-full" />
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

export default VetDetails;
