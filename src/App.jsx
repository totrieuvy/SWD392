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
import { toast } from "react-toastify";
import Vaccine from "./pages/ManagerPage/vaccine/Vaccine";
import TotalAccount from "./pages/AdminPage/totalAccount/TotalAccount";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ roleName }) => {
  const user = useSelector((state) => state.user);
  if (roleName == user.roleName) {
    return <Outlet />;
  } else {
    toast.error("You do not have permission to access this page!");
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
              path: "profile/:id",
              element: <div>dashboard</div>,
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
              path: "profile/:id",
              element: <div>dashboard</div>,
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
