import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomerApp from "./layout/Customer/Customer";
import HomePage from "./pages/Customer/HomePage/HomePage";
import AboutUs from "./pages/aboutUs/AboutUs";
import NotFoundPage from "./pages/error/NotFoundPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import SideBar from "./components/sidebar/SideBar";

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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
