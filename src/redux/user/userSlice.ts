import { createSlice } from '@reduxjs/toolkit'

const initUser = {
  currentUser: {
    id: '',
    name: '',
    username: '',
    email: '',
    actived: false,
    status: '',
    role: '',
    avatar: ''
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState: initUser,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = { ...action.payload }
    },
    updatePartialUser: (
      state,
      action: {
        payload: { [key in keyof Partial<typeof initUser.currentUser>]: any }
        type: string
      }
    ) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    }
  }
})

export const { updateUser, updatePartialUser } = userSlice.actions
export default userSlice