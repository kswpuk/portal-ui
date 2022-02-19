import { configureStore } from '@reduxjs/toolkit'
import navSlice from './navSlice'
import { portalApi } from './portalApi'

export const store = configureStore({
  reducer: {
    nav: navSlice,
    [portalApi.reducerPath]: portalApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(portalApi.middleware),
})