import { createSlice } from '@reduxjs/toolkit';
import { Admin } from '../models/Admin';

// Define the admin State Interface
interface AdminState {
  isLoading: boolean
  isLoggedIn: boolean
  admin: Admin 
  error: string
}

const initialState: AdminState = {
  isLoading: false,
  isLoggedIn: false,
  admin: {
    id: 0,
    login: "",
    roles: []
  },
  error: ""
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
      adminLoading: (state) => {
          state.isLoading = true;
      },

      adminCreated: (state, action) => {
          state.isLoggedIn = true
          state.isLoading = false;
          state.error = '';
          state.admin = action.payload;
      },

      adminClosed: () => {
          return initialState;
      },

      adminError: (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
      }
  }
})

export const { adminLoading, adminCreated, adminClosed, adminError } = adminSlice.actions;

export default adminSlice.reducer