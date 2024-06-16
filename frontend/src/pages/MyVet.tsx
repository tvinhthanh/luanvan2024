import React from 'react';
import { Link } from 'react-router-dom';

const Vet: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/manager-vet"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 11-10 10A10 10 0 0112 2zm0 18a8 8 0 10-8-8 8 8 0 008 8zm1-11h-2v6h2zm-1-4a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 0112 5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quản Lý Thông Tin Phòng Khám</h3>
                <p className="mt-2 text-sm text-gray-500">Quản lý thông tin chi tiết về các phòng khám.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/manager-breed"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.07 4.93a10 10 0 00-14.14 0A10 10 0 0012 22a10 10 0 007.07-17.07zm-2.12 2.12A8 8 0 114.93 16.95a8 8 0 0111.31-11.9l-2.6 2.6a6 6 0 00-8.49 8.49l-1.65 1.65a8 8 0 0111.9-11.31l-2.6 2.6a6 6 0 008.49 8.49l1.65-1.65a8 8 0 01-11.9-11.31l2.6 2.6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quản Lý Bệnh Án</h3>
                <p className="mt-2 text-sm text-gray-500">Theo dõi và quản lý bệnh án của thú cưng.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/manager-my-hotel-booking"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 2a7.49 7.49 0 015.5 2.23A7.5 7.5 0 0112 21.91 7.5 7.5 0 0116.5 2zM12 19.91a5.5 5.5 0 100-11 5.5 5.5 0 000 11zm2.5-3h-5v-2h5zm0-4h-5v-2h5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quản Lý Lịch Hẹn</h3>
                <p className="mt-2 text-sm text-gray-500">Quản lý các lịch hẹn của khách hàng.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/manager-invoice"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2v5h5V2zM8 7H3v13a2 2 0 002 2h12a2 2 0 002-2V7h-5V2H8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quản Lý Hoá Đơn</h3>
                <p className="mt-2 text-sm text-gray-500">Quản lý các hoá đơn và thanh toán.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/manager-statistics"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10 10 10 0 00-10-10zm1 14h-2v-2h2zm0-4h-2V7h2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Thống kê</h3>
                <p className="mt-2 text-sm text-gray-500">Xem và phân tích các số liệu thống kê.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Vet;
