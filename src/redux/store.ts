import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user/userSlice'
import socketSlice from './socket/socketSlice'

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    socket: socketSlice.reducer
  }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
