import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from '@/components/pages/EditProfileModal';
import { User } from '@/lib/users';
import { useAuth } from '@/lib/auth';

export default function AccountScreen() {
  const { user, loading, refetching, editUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSave = (updatedUser: User) => {
    // Handle saving user data
    editUser(updatedUser)
    setShowEditModal(false);
  };

  // Show loading state if user data is not available yet
  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>User Profile</Text>
        
        {refetching && (
          <View style={styles.refetchingContainer}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.refetchingText}>Updating profile...</Text>
          </View>
        )}
        
        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity 
              style={styles.modifyButton} 
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.modifyButtonText}>Modify</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoGrid}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
            
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
            
            <Text style={styles.infoLabel}>Account Type:</Text>
            <Text style={styles.infoValue}>
              {user.administrator ? 'Administrator' : 'Regular User'}
            </Text>
          </View>
        </View>
        
        {/* Contacts Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contacts</Text>
          
          {user.contacts && user.contacts.length > 0 ? (
            <View style={styles.contactsContainer}>
              {user.contacts.map((contactRelation, index) => (
                <View 
                  // Use a combination of id and index to ensure uniqueness
                  key={contactRelation.id ? `contact-${contactRelation.id}` : `contact-index-${index}`} 
                  style={styles.contactItem}
                >
                  <Text style={styles.contactName}>
                    {contactRelation.contact?.name || "Unknown Contact"}
                  </Text>
                  <Text style={styles.contactEmail}>
                    {contactRelation.contact?.email || "No email"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noContactsText}>No contacts found.</Text>
          )}
        </View>

        {/* Edit Profile Modal */}
        {user && (
          <EditProfileModal
            visible={showEditModal}
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={handleSave}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  refetchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  refetchingText: {
    marginLeft: 8,
    color: '#0284c7',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modifyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modifyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  infoLabel: {
    width: '40%',
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  infoValue: {
    width: '60%',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  contactsContainer: {
    marginTop: 12,
  },
  contactItem: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noContactsText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 12,
  },
});