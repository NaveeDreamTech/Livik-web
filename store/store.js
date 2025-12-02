// store/store.js
import { configureStore } from "@reduxjs/toolkit";
// import your slices here (example names)
import employeesReducer from "./slices/employeesSlice";
import approvalsReducer from "./slices/approvalsSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    approvals: approvalsReducer,
  },
  // devTools enabled by default in development
});
