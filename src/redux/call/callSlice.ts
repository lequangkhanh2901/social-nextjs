import { createSlice } from '@reduxjs/toolkit'
import { CallStatus } from '~/helper/enum/message'

const initCall = {
  call: {
    status: CallStatus.NORMAL,
    conversationId: ''
  }
}

const callSlice = createSlice({
  name: 'call',
  initialState: initCall,
  reducers: {
    changeCallStatus(
      state,
      actions: {
        payload: CallStatus
      }
    ) {
      state.call = { ...state.call, status: actions.payload }
    },
    startCall(
      state,
      action: {
        payload: {
          status: CallStatus
          conversationId: string
        }
      }
    ) {
      state.call = action.payload
    },
    updateCall(
      state,
      action: {
        payload: {
          status: CallStatus
          conversationId: string
        }
      }
    ) {
      state.call = action.payload
    }
  }
})

export const { changeCallStatus, startCall, updateCall } = callSlice.actions
export default callSlice
