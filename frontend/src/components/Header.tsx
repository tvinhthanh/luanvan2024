import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn, userRole } = useAppContext(); // Sử dụng userRole từ AppContext
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">Paw Buddy</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              {userRole ? (
                <Link
                  className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                  to="/manager-user"
                >
                  Quản lý người dùng
                </Link>
              ) : (
                <></>
              )}

              {userRole ? (
                <>
                  {/* <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/manager-owner"
                  >
                    Manager Owner
                  </Link> */}
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/manager-vet"
                  >
                    Quản lý phòng khám
                  </Link>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/pet"
                  >
                    Quản lý thú cưng
                  </Link>
                </>
              ) : (
                <>
                  <span></span>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/my-vet"
                  >
                    Phòng Khám
                  </Link>
                </>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Đăng nhập
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
