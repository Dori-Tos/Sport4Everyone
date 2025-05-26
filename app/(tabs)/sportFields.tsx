import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'expo-router'
import SportFieldTable from '@/components/pages/SportFieldTable'
import { getSportsCentersByUserId } from '@/lib/sportsCenter'
import { getSportFieldsBySportsCenter } from '@/lib/sportFields'
import { getSports } from '@/lib/sports'

export default function SportFieldsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sportCenters, setSportCenters] = useState([])
  const [sportFieldsByCenter, setSportFieldsByCenter] = useState({})
  const [sports, setSports] = useState([])
  
  // Redirect non-admin users away from this page
  useEffect(() => {
    if (user && user.administrator !== true) {
      router.replace('/')
    }
  }, [user, router])

  // Fetch all required data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (user?.id && user.administrator) {
        // Get sports centers owned by the user
        const centersData = await getSportsCentersByUserId(user.id)
        setSportCenters(centersData)
        
        // Get sport fields organized by center
        if (centersData.length > 0) {
          const fieldsMap = {}
          
          for (const center of centersData) {
            const fields = await getSportFieldsBySportsCenter(center.id)
            fieldsMap[center.id] = fields
          }
          
          setSportFieldsByCenter(fieldsMap)
        }
        
        // Get all sports
        const sportsData = await getSports()
        setSports(sportsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    if (user?.administrator) {
      fetchData()
    }
  }, [user])

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  // If not logged in or not admin, show an error/loading state
  if (!user || user.administrator !== true) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Access restricted to administrators.
        </ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedText type="title" style={styles.header}>Sport Fields Management</ThemedText>
        
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <SportFieldTable 
            sportCenters={sportCenters}
            sportFieldsByCenter={sportFieldsByCenter}
            sports={sports}
            onDataChange={fetchData}
          />
        )}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding at bottom for content
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'red',
  },
  loader: {
    marginTop: 30,
  }
})