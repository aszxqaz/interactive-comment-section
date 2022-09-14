import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { Layout } from "src/sections/Layout"
import { getComments, getMe } from "client/api/fetchers"
import { Comments } from "../src/sections/Comments/Comments"
import { createContext } from "react"
import { UserEntityServerResponse } from "server/server-response.types"
import { useMeQuery } from "client/api/useQueries"

export const UserContext = createContext<UserEntityServerResponse>(undefined)

export default function Home() {
  const { data: user } = useMeQuery()

  return (
    <UserContext.Provider value={user}>
      <Layout>
        <div style={{ paddingInline: 20 }}>
          <Comments />
        </div>
      </Layout>
    </UserContext.Provider>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(["comments"], getComments)
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
