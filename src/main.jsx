import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);
