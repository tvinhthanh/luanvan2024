import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";

const Vet: React.FC = () => {
  const { vet, userId } = useAppContext(); // Now vet is available in context
  if (!vet || vet.user_id !== userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <p className="text-lg font-medium text-gray-900">
            Vui lòng tạo thông tin phòng khám trước.
          </p>
          <div className="text-center mt-4">
            <p className="text-xl text-gray-600">No Vets found</p>
            <Link to="/add-vet" className="text-blue-500 hover:underline">
              Add Vet
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!vet.type) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <p className="text-lg font-medium text-gray-900">
            Liên hệ admin hệ thống để phòng khám bạn hoạt động.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/my-vet-info"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quản Lý Thông Tin Phòng Khám
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý thông tin chi tiết về các phòng khám.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/medical-record"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quản Lý Phiếu Khám
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Khởi tạo và quản lý phiếu khám của thú cưng.
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/record-info"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4 bg-white">
              {" "}
              <div className="flex-shrink-0">
                <svg
                  className="w-12 h-12 text-green-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none" 
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quản Lý Bệnh Án
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Lưu trữ và quản lý bệnh án của thú cưng.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/my-booking" // Use id_vet from useAppContext
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quản Lý Lịch Hẹn
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý các lịch hẹn của khách hàng.
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/manager-invoice"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 12v6h8v-6H8Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quản Lý Hoá Đơn
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý các hoá đơn và thanh toán.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/manager-statistics"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Thống kê
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và phân tích các số liệu thống kê.
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/my-vet/med"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M10.4688 18.4759C9.10334 19.8414 6.88952 19.8414 5.52408 18.4759C4.15864 17.1105 4.15864 14.8967 5.52408 13.5312L8.99734 10.058L13.942 15.0027L10.4688 18.4759ZM15.0027 13.942L18.4759 10.4688C19.8414 9.10334 19.8414 6.88952 18.4759 5.52408C17.1105 4.15864 14.8967 4.15864 13.5312 5.52408L10.058 8.99731L15.0027 13.942ZM4.46342 19.5366C6.41465 21.4878 9.57821 21.4878 11.5294 19.5366L19.5366 11.5294C21.4878 9.57821 21.4878 6.41465 19.5366 4.46342C17.5854 2.51219 14.4218 2.51219 12.4706 4.46342L4.46342 12.4706C2.51219 14.4218 2.51219 17.5854 4.46342 19.5366Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M10.4688 18.4759C9.10334 19.8414 6.88952 19.8414 5.52408 18.4759C4.15864 17.1105 4.15864 14.8967 5.52408 13.5312L8.99734 10.058L13.942 15.0027L10.4688 18.4759Z"
                    fill="#FFFFFF" // Màu cho nửa viên thuốc
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Thuốc
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý chi tiết các loại thuốc của phòng khám.
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/my-vet/service"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h4M9 3v4a1 1 0 0 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Dịch Vụ
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý chi tiết các dịch vụ của phòng khám.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Vet;
