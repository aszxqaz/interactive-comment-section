import { useQuery } from "@tanstack/react-query";
import { getComments, getMe } from "./fetchers";

export const useMeQuery = () => useQuery(['user'], getMe)
export const useCommentsQuery = () => useQuery(["comments"], getComments)