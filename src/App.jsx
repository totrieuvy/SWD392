import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomerApp from "./layout/Customer/Customer";
import HomePage from "./pages/Customer/HomePage/HomePage";
import AboutUs from "./pages/aboutUs/AboutUs";
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
import RegisterSchedule from "./pages/RegisterSchedule/RegisterSchedule";

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
          path: "about-us",
          element: <AboutUs />,
        },
        {
          path: "register-schedule",
          element: <RegisterSchedule />,
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
              path: "manager",
              element: <Manager />,
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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
