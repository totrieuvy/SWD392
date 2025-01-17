import { RouterProvider, createBrowserRouter } from "react-router-dom";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <>test commit</>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
