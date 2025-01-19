import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import CustomerApp from "./layout/Customer/Customer";
import HomePage from "./pages/Customer/HomePage/HomePage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomerApp />,
      children: [
        {
          index: true,
          element: <HomePage />,
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
