import { useRef } from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export const Portal = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>()
  const [, forceUpdate] = useState({})

  useEffect(() => {
    containerRef.current = document.createElement("div")
    document.body.appendChild(containerRef.current)
    forceUpdate({})
    return () => {
      document.body.removeChild(containerRef.current)
    }
  }, [])

  return containerRef.current ? createPortal(children, containerRef.current) : null
}
