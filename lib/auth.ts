import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User, getUser, Login, loginUser, Register, addUser } from "./users"

export function useAuth() {
  const client = useQueryClient()
  const user = useQuery({
    queryFn: () => getUser(),
    queryKey: ["getUser"],    
    staleTime: 1000 * 60 * 5, // 5 minutes of stale time
    // Refetches when we need fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const login = useMutation({
    mutationFn: async(credentials: Login) => {
      return await loginUser(credentials)
    },
    onSuccess(data) {
      console.log("Login successful, updating cache with user data:", data)
      // First, directly set the user data in the cache
      client.setQueryData(["getUser"], data)
      // Then invalidate to trigger a refetch
      client.invalidateQueries({ queryKey: ["getUser"] })

      console.log("User data after login:", data)
    }
  })

  const logout = useMutation({
    mutationFn: async() => {},
    onSuccess() {
      client.invalidateQueries()
    }
  })

  const register = useMutation({
    mutationFn: async(credentials: Register) => {
      const response = await addUser(credentials)
      return response
    },
    onSuccess(data) {
      // Update the cache directly with the user data
      client.setQueryData(["getUser"], data)
      // Also invalidate to ensure a fresh fetch
      client.invalidateQueries({ queryKey: ["getUser"] })
    }
  })

  return {
    user: user.data as User,
    loading: user.isLoading,
    error: user.error,
    login: login.mutate,
    logout: logout.mutate,
    register: register.mutate,
  }
}
