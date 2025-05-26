import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { ThemedView } from '@/components/ui/ThemedView'
import { ThemedText } from '@/components/ui/ThemedText'
import { useAuth } from '@/lib/auth'
import { getContactsByUser, addContact, removeContact, searchContacts } from '@/lib/contacts'
  
export default function ContactsScreen() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  // Fetch user's contacts
  const { data: userContacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts', user?.id],
    queryFn: () => user?.id ? getContactsByUser(user.id.toString()) : Promise.resolve([]),
    enabled: !!user?.id,
  })

  // Add contact mutation
  const { mutate: addContactMutate, isPending: isAddingContact } = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', user?.id] })
      setSearchResults([])
      setSearchTerm('')
    },
  })

  // Remove contact mutation
  const { mutate: removeContactMutate, isPending: isRemovingContact } = useMutation({
    mutationFn: ({ userId, contactId }: { userId: number, contactId: number }) => 
      removeContact(userId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', user?.id] })
    },
  })

  // Debounce search
  let searchTimeout: NodeJS.Timeout | null = null
  
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    if (value.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    
    setIsSearching(true)
    
    searchTimeout = setTimeout(async () => {
      try {
        const data = await searchContacts(value, user?.id)
        
        // Ensure data is an array before filtering
        const dataArray = Array.isArray(data) ? data : [];
        
        // Filter out the current user and existing contacts
        setSearchResults(dataArray.filter((currentUser: any) => 
          currentUser.id !== user?.id && 
          !userContacts?.some((contact: any) => contact.contactId === currentUser.id)
        ))
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to search users")
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const handleAddContact = (contactId: number) => {
    if (!user?.id) return
    
    addContactMutate({
      userId: user.id,
      contactId,
    })
  }

  const handleRemoveContact = (contactId: number) => {
    if (!user?.id) return
    
    removeContactMutate({ 
      userId: user.id, 
      contactId 
    })
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title" style={styles.header}>Contacts</ThemedText>
        
        {/* Search Bar */}
        <ThemedView style={styles.searchContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Add New Contact</ThemedText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          
          {error ? (
            <ThemedView style={styles.errorBox}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          ) : null}
          
          {isSearching ? (
            <ActivityIndicator size="small" color="#0a7ea4" style={styles.indicator} />
          ) : null}
          
          {searchResults.length > 0 ? (
            <ThemedView style={styles.resultsContainer}>
              {searchResults.map((contact) => (
                <ThemedView key={`search-${contact.id}`} style={styles.resultItem}>
                  <View>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactEmail}>{contact.email}</ThemedText>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => handleAddContact(contact.id)}
                    disabled={isAddingContact}
                  >
                    <ThemedText style={styles.addButtonText}>
                      {isAddingContact ? 'Adding...' : 'Add'}
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              ))}
            </ThemedView>
          ) : searchTerm.length >= 2 && !isSearching ? (
            <ThemedText style={styles.noResultsText}>No users found matching your search.</ThemedText>
          ) : null}
        </ThemedView>
        
        {/* Contacts List */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Your Contacts</ThemedText>
        
        {contactsLoading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={styles.indicator} />
        ) : userContacts && userContacts.length > 0 ? (
          <ThemedView style={styles.contactsContainer}>
            {userContacts.map((contact: any) => (
              <ThemedView key={`contact-${contact.id || contact.contactId}`} style={styles.contactItem}>
                <View>
                  <ThemedText style={styles.contactName}>
                    {contact.contact?.name || "Unknown Contact"}
                  </ThemedText>
                  <ThemedText style={styles.contactEmail}>
                    {contact.contact?.email || "No email"}
                  </ThemedText>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => handleRemoveContact(contact.contactId)}
                  disabled={isRemovingContact}
                >
                  <ThemedText style={styles.removeButtonText}>
                    {isRemovingContact ? 'Removing...' : 'Remove'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))}
          </ThemedView>
        ) : (
          <ThemedText style={styles.noContactsText}>No contacts found.</ThemedText>
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
  },
  header: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  searchContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#b71c1c',
  },
  indicator: {
    marginVertical: 10,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#666',
  },
  noContactsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  }
})