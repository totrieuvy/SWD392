import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import các slice
import { userSlice } from "./features/userSlice";
import { childrenSelectedSlice } from "./features/childrenSelectedSlice";
import { selectedVaccinatedChildrenSlice } from "./features/selectedVaccinatedChildren";
import { doctorSlice } from "./features/doctorSlice";

// Cấu hình persist cho từng reducer
const userPersistConfig = {
  key: "user",
  storage,
  // Nếu muốn bỏ qua một số trường không muốn persist
  // blacklist: ['someTemporaryField']
};

const childSelectedPersistConfig = {
  key: "selectedChild",
  storage,
};

const vaccinatedChildPersistConfig = {
  key: "selectedVaccinatedChild",
  storage,
};

const doctorPersistConfig = {
  key: "doctor",
  storage,
};

export const store = configureStore({
  reducer: {
    user: persistReducer(userPersistConfig, userSlice.reducer),
    selectedChild: persistReducer(childSelectedPersistConfig, childrenSelectedSlice.reducer),
    selectedVaccinatedChild: persistReducer(vaccinatedChildPersistConfig, selectedVaccinatedChildrenSlice.reducer),
    doctor: persistReducer(doctorPersistConfig, doctorSlice.reducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);
