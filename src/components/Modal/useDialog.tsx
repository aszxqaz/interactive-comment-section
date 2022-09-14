import { useContext } from "react"
import { DialogOptions, ModalContext } from "./Modal"

export const useDialog = () => {
  const { dialogOptions, setDialogOptions } = useContext(ModalContext)

  const showDialog = (options: DialogOptions) => {
    setDialogOptions(options)
  }

  return showDialog
}
