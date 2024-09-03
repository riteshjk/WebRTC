import { useCallback, useEffect, useRef, useState } from "react"

export const useStateWithCallback = (initialState) =>{
  const [state, setState] = useState(initialState)
  const cbRef = useRef(null)
  // this function is nothing but our setClients whcih is coming from useWebRTC hook
  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb

    setState(prevState => {
      return typeof newState === 'function'
        ? newState(prevState)
        : newState
    })
  },[])

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state)
      cbRef.current = null
    }
  }, [state])

  return [state, updateState]
}