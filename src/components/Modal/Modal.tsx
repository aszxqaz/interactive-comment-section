import { createContext, Dispatch, ReactNode, useReducer, useState } from "react"
import { Dialog, DialogProps } from "../Popups/Dialog"

type ModalProviderProps = {
  children: ReactNode
}

export type DialogOptions = DialogProps

type ModalContext = {
  dialogOptions: DialogOptions
  setDialogOptions: Dispatch<DialogOptions>
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null)
  console.log("modal render")
  return (
    <ModalContext.Provider value={{ dialogOptions, setDialogOptions }}>
      {children}
      <Dialog
        {...dialogOptions}
        onClose={() => {
          setDialogOptions(opts => ({ ...opts, isOpened: false }))
        }}
      />
      )
    </ModalContext.Provider>
  )
}
