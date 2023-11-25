import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user/userSlice'
import callSlice from './call/callSlice'

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    call: callSlice.reducer
  }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
