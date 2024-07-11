import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import MyBookings from "./pages/Vet-Manager/Booking/MyBookings";
import Home from "./pages/Home";
import ManagerUser from "./pages/Manager/ManagerUser";
// import ManagerBookingOfMyHotel from "./pages/Vet-Manager/Booking/ManagerBooking";
import ManagerOwner from "./pages/Manager/ManagerOwner";
import ManagerPet from "./pages/Manager/ManagerPet";
import Pet from "./pages/Pet";
import ManagerBreed from "./pages/Manager/ManagerBreed";
import ManagerBreedType from "./pages/Manager/ManagerBreedTypes";
import MyVets from "./pages/Vet-Manager/Vet/MyVet";
import ManagerStatistics from "./pages/Manager/ManagerStatistics";
import ManagerVet from "./pages/Manager/ManagerVet";
import VetDash from "./pages/Manager/VetDash";
import BreedForm from "./forms/BreedForm";
import AddVet from "./pages/Vet-Manager/Vet/AddVet";
import ManagerService from "./pages/Vet-Manager/Service/ManagerService";
import MyVetInfo from "./pages/Vet-Manager/Vet/VetInform";
import EditVet from "./pages/Vet-Manager/Vet/EditVet";
// import ManagerBookingOfMyVet from "./pages/Vet-Manager/Booking/ManagerBooking";
import ManagerMedic from "./pages/Vet-Manager/MedicalRecord/ManagerMedic";
import ServicesList from "./pages/Vet-Manager/Service/ManagerService";
import AddService from "./pages/Vet-Manager/Service/AddService";
import AddBooking from "./pages/Vet-Manager/Booking/AddBooking";
import DetailBooking from "./pages/Vet-Manager/Booking/DetailBooking";
import MedicalRecordDetail from "./pages/Vet-Manager/MedicalRecord/MedicDetail";
import AddMedicalRecord from "./pages/Vet-Manager/MedicalRecord/AddMedic";

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
              path="/my-booking"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />

            <Route
              path="/add-vet"
              element={
                <Layout>
                  <AddVet />
                </Layout>
              }
            />
            <Route
              path="/edit-vet/:vetId"
              element={
                <Layout>
                  <EditVet />
                </Layout>
              }
            />
            <Route
              path="/medical-record"
              element={
                <Layout>
                  <ManagerMedic />
                </Layout>
              }
            />
            <Route
              path="/medical-records/:recordId"
              element={
                <Layout>
                  <MedicalRecordDetail />
                </Layout>
              }
            />
             <Route
              path="/add-medical"
              element={
                <Layout>
                  <AddMedicalRecord />
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
              path="/my-vet-info"
              element={
                <Layout>
                  <MyVetInfo />
                </Layout>
              }
            />
            <Route
              path="/my-vet/service"
              element={
                <Layout>
                  <ServicesList />
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
              path="/my-vet"
              element={
                <Layout>
                  {" "}
                  <VetDash />
                </Layout>
              }
            />
            <Route
              path={`/bookings/:bookingId`}
              element={
                <Layout>
                  <DetailBooking />
                </Layout>
              }
            />
            <Route
              path="/add-booking"
              element={
                <Layout>
                  <AddBooking />
                </Layout>
              }
            />
            <Route
              path="/manager-service"
              element={
                <Layout>
                  <ManagerService />
                </Layout>
              }
            />
            <Route
              path="/add-service"
              element={
                <Layout>
                  <AddService />
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
