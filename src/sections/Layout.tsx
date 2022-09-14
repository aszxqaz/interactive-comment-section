import { useQuery } from "@tanstack/react-query"
import { ReactNode, useContext } from "react"
import { getMe } from "client/api/fetchers"
import { Header } from "./Header"
import { useMeQuery } from "client/api/useQueries"
import { Dialog } from "src/components/Popups/Dialog"
import { ModalProvider } from "src/components/Modal/Modal"
import { UserContext } from "pages"

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const user = useContext(UserContext)
  return (
    <ModalProvider>
      <Header user={user} />
      {children}
    </ModalProvider>
  )
}
