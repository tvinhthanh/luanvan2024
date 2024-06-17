import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import ManagerUser from "./pages/Manager/ManagerUser";
import ManagerBookingOfMyHotel from "./pages/Manager/ManagerBookingOfMyHotel";
import ManagerOwner from "./pages/Manager/ManagerOwner";
import ManagerPet from "./pages/Manager/ManagerPet";
import Pet from "./pages/Pet";
import ManagerBreed from "./pages/Manager/ManagerBreed";
import ManagerBreedType from "./pages/Manager/ManagerBreedTypes";
import MyVets from "./pages/MyVet";
import ManagerStatistics from "./pages/Manager/ManagerStatistics";
import ManagerVet from "./pages/Manager/ManagerVet";
import VetDash from "./pages/Manager/VetDash";
import BreedForm from "./forms/BreedForm";

const App = () => {
  const { isLoggedIn, userRole } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {" "}
              <Home />{" "}
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              {" "}
              <Detail />{" "}
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />

            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
            <Route
              path="/my-vet2"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/my-vet"
              element={
                <Layout>
                  <MyVets />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  {" "}
                  <MyBookings />
                </Layout>
              }
            />
          </>
        )}

        {userRole ? (
          <>
            <Route
              path="/manager-user"
              element={
                <Layout>
                  {" "}
                  <ManagerUser />
                </Layout>
              }
            />
            <Route
              path="/manager-owner"
              element={
                <Layout>
                  {" "}
                  <ManagerOwner />
                </Layout>
              }
            />
            <Route
              path="/manager-pet"
              element={
                <Layout>
                  {" "}
                  <ManagerPet />
                </Layout>
              }
            />
            <Route
              path="/manager-vet"
              element={
                <Layout>
                  {" "}
                  <ManagerVet />
                </Layout>
              }
            />
            <Route
              path="/pet"
              element={
                <Layout>
                  {" "}
                  <Pet />
                </Layout>
              }
            />
            <Route
              path="/manager-breed"
              element={
                <Layout>
                  {" "}
                  <ManagerBreed />
                </Layout>
              }
            />
            <Route
              path="/manager-breed-type"
              element={
                <Layout>
                  {" "}
                  <ManagerBreedType />
                </Layout>
              }
            />
            <Route path="/breed-form" element={<BreedForm />} />
            <Route path="/breed-form/:breedId" element={<BreedForm />} />
          </>
        ) : (
          <>
            <Route
              path="/vet/dashboard"
              element={
                <Layout>
                  {" "}
                  <VetDash />
                </Layout>
              }
            />

            <Route
              path="/manager-my-hotel-booking"
              element={
                <Layout>
                  <ManagerBookingOfMyHotel />
                </Layout>
              }
            />
            <Route
              path="/manager-statistics"
              element={
                <Layout>
                  <ManagerStatistics />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
