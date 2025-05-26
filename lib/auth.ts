import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User, getUser, Login, loginUser, Register, addUser, updateUser } from "./users"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Session ID storage key
const SESSION_ID_KEY = "sport4everyone_session_id"

export function useAuth() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const client = useQueryClient()

  // Load the session ID from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSessionId = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem(SESSION_ID_KEY)
        if (storedSessionId) {
          setSessionId(storedSessionId)
        }
      } catch (error) {
        console.error("Error loading session ID:", error)
      }
    }
    
    loadSessionId()
  }, [])

  // Function to save session ID to AsyncStorage
  const saveSessionId = async (newSessionId: string | null) => {
    try {
      if (newSessionId) {
        await AsyncStorage.setItem(SESSION_ID_KEY, newSessionId)
      } else {
        await AsyncStorage.removeItem(SESSION_ID_KEY)
      }
      setSessionId(newSessionId)
    } catch (error) {
      console.error("Error saving session ID:", error)
    }
  }

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
      const [userData, newSessionId] = await loginUser(credentials)
      // Save session ID to AsyncStorage
      await saveSessionId(newSessionId)
      return userData
    },
    onSuccess(data) {
      // First, directly set the user data in the cache
      client.setQueryData(["getUser"], data)
      // Then invalidate to trigger a refetch
      client.invalidateQueries({ queryKey: ["getUser"] })
    }
  })

  const logout = useMutation({
    mutationFn: async() => {
      // Clear session ID from AsyncStorage
      await saveSessionId(null)
    },
    onSuccess() {
      client.invalidateQueries()
    }
  })

  const register = useMutation({
    // ...existing code...
  })

  const editUser = useMutation({
    mutationFn: async(userData: User) => {
      if (!sessionId) {
        throw new Error("No session ID available. Please log in again.")
      }
      const res = updateUser(userData, sessionId)
      return res
    },
    onSuccess(data) {
      client.invalidateQueries({ queryKey: ["getUser"] })
    },
    // Optimistic update to immediately reflect changes in the UI
    onMutate: async(newUserData) => {
      // Cancel outgoing refetches
      await client.cancelQueries({ queryKey: ["getUser"] })
      
      // Save previous value
      const previousUser = client.getQueryData(["getUser"])
      
      // Optimistically update to new value
      client.setQueryData(["getUser"], newUserData)
      
      // Return context with the previous value
      return { previousUser }
    },
    onError: (err, newData, context) => {
      // If mutation fails, use the context to roll back
      client.setQueryData(["getUser"], context.previousUser)
    },
    onSettled: () => {
      // Always refetch after error or success
      client.invalidateQueries({ queryKey: ["getUser"] })
    }
  })

  return {
    user: user.data as User,
    loading: user.isLoading,
    refetching: user.isRefetching,
    error: user.error,
    login: login.mutate,
    logout: logout.mutate,
    register: register.mutate,
    editUser: editUser.mutate,
    sessionId,
  }
}