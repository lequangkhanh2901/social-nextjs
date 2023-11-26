import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Peer from 'peerjs'
import { toast } from 'react-hot-toast'

import { CallStatus } from '~/helper/enum/message'
import { updateCall } from '~/redux/call/callSlice'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { PEER_HOST, PEER_PORT } from '~/settings/constants'
import socket from '~/untils/socket'

import Button from '~/components/common/Button'

export default function CallBox() {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const { call } = useAppSelector((state: RootState) => state.call)
  const dispatch = useAppDispatch()
  const myVideo = useRef<HTMLVideoElement>(null)
  const oponentVideo = useRef<HTMLVideoElement>(null)
  const conversationId = useParams().conversationId as string
  const myPeer = useRef<Peer | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    myPeer.current = new Peer({
      host: PEER_HOST,
      port: PEER_PORT,
      token: currentUser.id
    })

    socket.on(`call-ended-${conversationId}`, async () => {
      handleStopStream()
      toast.success('Call ended')
      myPeer.current?.disconnect()

      if (call.status === CallStatus.IN_CALL)
        dispatch(
          updateCall({
            conversationId: '',
            status: CallStatus.NORMAL
          })
        )
    })

    return () => {
      socket.off(`call-ended-${conversationId}`)
      handleStopStream()
    }
  }, [])

  useEffect(() => {
    myPeer.current?.on('open', (id) => {
      socket.emit('join-room', {
        conversationId: conversationId,
        userId: id
      })
    })
    ;(async () => {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      addVideoStream(myVideo.current as HTMLVideoElement, streamRef.current)

      myPeer.current?.on('call', (call) => {
        call.answer(streamRef.current as MediaStream)
      })
      socket.on(`user-connected-${conversationId}`, (userId) => {
        connectToNewUser(userId, streamRef.current as MediaStream)
      })
    })()

    return () => {
      handleStopStream()
    }
  }, [myPeer.current])

  const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => video.play())
  }

  const connectToNewUser = (id: string, stream: MediaStream) => {
    const call = myPeer.current?.call(id, stream)
    call?.on('stream', (userVideoStream) => {
      addVideoStream(oponentVideo.current as HTMLVideoElement, userVideoStream)
    })
    call?.on('close', () => {
      oponentVideo.current?.remove()
    })
  }

  const handleEndCall = () => {
    handleStopStream()
    socket.emit('call-ended', conversationId)
    myPeer.current?.disconnect()
    dispatch(
      updateCall({
        conversationId: '',
        status: CallStatus.NORMAL
      })
    )
  }

  const handleStopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }

  return (
    <div className="max-w-[90vw] w-[400px] p-5 rounded-xl">
      <div className="w-full relative">
        <video
          src=""
          ref={myVideo}
          className="aspect-[3/4] w-[80px] absolute top-0 right-0 object-cover"
          muted
        ></video>
        <video
          src=""
          ref={oponentVideo}
          className="aspect-[3/4] object-cover w-full"
        ></video>
      </div>
      <div className="flex justify-evenly">
        <Button title="End call" onClick={handleEndCall} />
      </div>
    </div>
  )
}
