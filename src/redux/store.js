import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./features/userSlice";
import { childrenSelectedSlice } from "./features/childrenSelectedSlice";
import { selectedVaccinatedChildrenSlice } from "./features/selectedVaccinatedChildren";
import { doctorSlice } from "./features/doctorSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    selectedChild: childrenSelectedSlice.reducer,
    selectedVaccinatedChild: selectedVaccinatedChildrenSlice.reducer,
    doctor: doctorSlice.reducer,
  },
});
