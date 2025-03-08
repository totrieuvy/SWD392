import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomerApp from "./layout/Customer/Customer";
import AboutUs from "./pages/CustomerPage/aboutUs/AboutUs";
import NotFoundPage from "./pages/error/NotFoundPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import SideBar from "./components/sidebar/SideBar";
import { useSelector } from "react-redux";
import Vaccine from "./pages/ManagerPage/vaccine/Vaccine";
import TotalAccount from "./pages/AdminPage/totalAccount/TotalAccount";
import Manager from "./pages/AdminPage/manager/Manager";
import Staff from "./pages/ManagerPage/staff/Staff";
import Manufacture from "./pages/ManagerPage/manufacture/Manufacture";
import TotalRevenue from "./pages/AdminPage/revenue/TotalRevenue";
import RegisterSchedule from "./pages/CustomerPage/RegisterSchedule/RegisterSchedule";

import HomePage from "./pages/CustomerPage/HomePage/HomePage";
import TotalVaccine from "./pages/AdminPage/totalVaccine/TotalVaccine";
import PackageVaccine from "./pages/ManagerPage/packageVaccine/PackageVaccine";
import Detail from "./pages/detail/Detail";
import VaccineDisplay from "./pages/CustomerPage/VaccineInfo/VaccineDisplay";
import VaccineDetail from "./pages/CustomerPage/VaccineInfo/VaccineDetail";
import Batch from "./pages/ManagerPage/batch/Batch";
import RegisterChildren from "./pages/CustomerPage/registerChildren/register/RegisterChildren";
import ChildrenProfile from "./pages/CustomerPage/childrenProfile/ChildrenProfile";
import StaffPage from "./pages/StaffPage/StaffPage";
import DoctorPage from "./pages/DoctorPage/DoctorPage";
import PaymentSuccess from "./components/paymentSuccess/PaymentSuccess";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ roleName }) => {
  const user = useSelector((state) => state?.user);
  if (user?.roleName) {
    if (roleName == user?.roleName) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotFoundPage />,
    },
    {
      path: "/sidebar",
      element: <SideBar />,
    },
    {
      path: "/",
      element: <CustomerApp />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "detail/:vaccineId",
          element: <Detail />,
        },
        {
          path: "payment-success",
          element: <PaymentSuccess />,
        },
        {
          path: "children-profile",
          element: <ChildrenProfile />,
        },
        {
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "register-schedule",
          element: <RegisterSchedule />,
        },
        {
          path: "register-children",
          element: <RegisterChildren />,
        },
        {
          path: "vaccination",
          element: <VaccineDisplay />,
        },
        {
          path: "/vaccination/:vaccineId",
          element: <VaccineDetail />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "admin",
      element: <PrivateRoute roleName="admin" />,
      children: [
        {
          path: "",
          element: <SideBar />,
          children: [
            {
              path: "dashboard/total-account",
              element: <TotalAccount />,
            },
            {
              path: "dashboard/total-vaccine",
              element: <TotalVaccine />,
            },
            {
              path: "manager",
              element: <Manager />,
            },
            {
              path: "dashboard/total-revenue",
              element: <TotalRevenue />,
            },
            {
              path: "category",
              element: <div>dashboard</div>,
            },
          ],
        },
      ],
    },
    {
      path: "manager",
      element: <PrivateRoute roleName="manager" />,
      children: [
        {
          path: "",
          element: <SideBar />,
          children: [
            {
              path: "vaccine",
              element: <Vaccine />,
            },
            {
              path: "batch",
              element: <Batch />,
            },
            {
              path: "package-vaccine",
              element: <PackageVaccine />,
            },
            {
              path: "manufacture",
              element: <Manufacture />,
            },
            {
              path: "staff",
              element: <Staff />,
            },
            {
              path: "product",
              element: <div>dashboard</div>,
            },
            {
              path: "category",
              element: <div>dashboard</div>,
            },
          ],
        },
      ],
    },
    {
      path: "/staff",
      element: <StaffPage />,
    },
    {
      path: "/doctor",
      element: <DoctorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
