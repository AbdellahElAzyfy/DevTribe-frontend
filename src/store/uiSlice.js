import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobileSidebarOpen: false,
  isMobileSearchOpen: false,
  isDesktopSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openMobileSidebar(state) {
      state.isMobileSidebarOpen = true;
      state.isMobileSearchOpen = false;
    },
    closeMobileSidebar(state) {
      state.isMobileSidebarOpen = false;
    },
    toggleMobileSearch(state) {
      state.isMobileSearchOpen = !state.isMobileSearchOpen;

      if (state.isMobileSearchOpen) {
        state.isMobileSidebarOpen = false;
      }
    },
    openMobileSearch(state) {
      state.isMobileSearchOpen = true;
      state.isMobileSidebarOpen = false;
    },
    closeMobileSearch(state) {
      state.isMobileSearchOpen = false;
    },
    toggleDesktopSidebar(state) {
      state.isDesktopSidebarOpen = !state.isDesktopSidebarOpen;
    },
  },
});

export const {
  openMobileSidebar,
  closeMobileSidebar,
  toggleMobileSearch,
  openMobileSearch,
  closeMobileSearch,
  toggleDesktopSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
