// store/slices/employeesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: "E001",
    name: "Ashaa Rao",
    email: "asha.rao@example.com",
    role: "Software Engineer",
    status: "Active",
  },
  {
    id: "E002",
    name: "Ravi Patel",
    email: "ravi.patel@example.com",
    role: "Product Manager",
    status: "Active",
  },
];

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.unshift(action.payload);
    },
    deleteEmployee: (state, action) =>
      state.filter((e) => e.id !== action.payload),
    updateEmployee: (state, action) => {
      const i = state.findIndex((x) => x.id === action.payload.id);
      if (i >= 0) state[i] = action.payload;
    },
  },
});

export const { addEmployee, deleteEmployee, updateEmployee } =
  employeesSlice.actions;
export default employeesSlice.reducer;
