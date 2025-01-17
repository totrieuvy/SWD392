import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <>Home page</>,
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
