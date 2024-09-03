import { useCallback, useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback"
import socketInit from "../Socket/index";
import { ACTIONS } from "../actions";
import freeice from "freeice"


export const useWebRTC = (roomId,user) =>{

  // now in this hhok when new client will gte added so wee need to do lots of chnages to update it so we build our 
  // custom hook so basically when we call setClients and after that the second parameter we aill get as a function.
  const [clients, setClients] = useStateWithCallback([])

  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);

  useEffect(() => {
    socket.current = socketInit()
   },[])

 
  const addNewClient = useCallback((newClient,cb)=>{
    const lookingFor = clients.find(client => client.id === newClient.id)
    if(lookingFor === undefined){
      setClients(existingClients => [...existingClients,newClient],cb)
    }
  },[clients,setClients])
  // capture media

  let localMediaStream = useRef(null);
  useEffect(() => {
    const startCapture = async () =>{
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
    
      })
    }
    startCapture().then(() => {
      addNewClient(user,()=>{
        const localElement = audioElements.current[user.id]
        if(localElement){
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current
        }

        // socket emit JOIN socket io

        socket.current.emit(ACTIONS.JOIN, {
          roomId,
          user
        })

      })
    })

    return () => {
      // leaving the room
      localMediaStream.current?.getTracks().forEach(track => track.stop())

      socket.current.emit(ACTIONS.LEAVE, {
        roomId,
      })
    }
  },[])


  useEffect(() => {
    const handleNewPeer =async({peerId,createOffer,user:remoteUser}) =>{
      // if already connected then give warning
       if(peerId in connections.current){
         return console.warn('Already connected to ${peerId} (${user.name})')
       }
       connections.current[peerId] = new RTCPeerConnection({
        // our local computer dont know its publice id so it will help computer to know its public id so we can send it to other machine
         iceServers: freeice()
       });
       
       // handle new ice candidate
       connections.current[peerId].onicecandidate = (event) =>{
         socket.current.emit(ACTIONS.RELAY_ICE, {
           peerId,
           icecandidate: event.candidate
         })
       }

       // handle on track on this connection

       connections.current[peerId].ontrack = ({
        streams : [remoteStream]
       }) =>{
         addNewClient(remoteUser,()=>{
          if(audioElements.current[remoteUser.id]){
            audioElements.current[remoteUser.id].srcObject = remoteStream
          }
          else{
            let settled = false;
            const interval = setInterval(() => {
              if(audioElements.current[remoteUser.id]){
                audioElements.current[remoteUser.id].srcObject = remoteStream
                settled = true;
              }
              if(settled){
                clearInterval(interval);
              }
             
            }, 1000);
          }
         })
       }

       // Add local track to remote connections

       localMediaStream.current.getTracks().forEach(track => {
         connections.current[peerId].addTrack(track, localMediaStream.current)
       })

       // create offer

       if(createOffer){
         const offer = await connections.current[peerId].createOffer()
          
         await connections.current[peerId].setLocalDescription(offer);
         // send offer to another client
         socket.current.emit(ACTIONS.RELAY_SDP, {
           peerId,
           sessionDescription: offer
         })
       }
    }    
     
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)

    return () =>{
      socket.current.off(ACTIONS.ADD_PEER)
    }
  },[])

// handle ice candiadate
  // useEffect(() => {
  //   socket.current.on(ACTIONS.ICE_CANDIDATE, ({peerId, icecandidate})=>{
  //     if(icecandidate){
  //       connections.current[peerId].addIceCandidate(icecandidate)
  //     }
  //   })

  //   return () =>{
  //     socket.current.off(ACTIONS.ICE_CANDIDATE)
  //   }
  // },[])

  useEffect(() => {
    const handleICECandidate = ({ peerId, icecandidate }) => {
      if (icecandidate) {
        const connection = connections.current[peerId];
        if (connection.remoteDescription && connection.remoteDescription.type) {
          connection.addIceCandidate(icecandidate);
        } else {
          // Queue the ICE candidates if remote description is not yet set
          if (!connections.current[peerId].queuedCandidates) {
            connections.current[peerId].queuedCandidates = [];
          }
          connections.current[peerId].queuedCandidates.push(icecandidate);
        }
      }
    };
  
    socket.current.on(ACTIONS.ICE_CANDIDATE, handleICECandidate);
  
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // handle sdp
  useEffect(() => {
    const handleRemoteSdp = async ({peerId, sessionDescription: remoteSessionDescription}) =>{
      connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription))

      // if session description is type of offer then create answer
      if(remoteSessionDescription.type === 'offer'){
        const connection = connections.current[peerId]
        const answer = await connection.createAnswer()
        connection.setLocalDescription(answer)
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer
        })
      }
    }
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp)

    return () =>{
      socket.current.off(ACTIONS.SESSION_DESCRIPTION)
    }
  },[])

  // handle romve peer

  useEffect(() => {
    const handleRemovePeer = async({peerId,userId}) =>{
      if(connections.current[peerId]){
        connections.current[peerId].close()
      }

      delete connections.current[peerId]

      delete audioElements.current[peerId]

      setClients(existingClients => existingClients.filter(client => client.id !== userId))
    }
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)

    return () =>{
      socket.current.off(ACTIONS.REMOVE_PEER)
    }
  },[])

  const providerRef = (instance, userId) =>{
    audioElements.current[userId] = instance;
  }


  return {clients,providerRef}
}