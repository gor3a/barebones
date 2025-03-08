import React from "react";
import {petService} from "@/services/petService";
import {FlatList, Text, View} from "react-native";
import {Button, Modal, Portal, TextInput} from "react-native-paper";
import {TabsProps} from "@/types/TabsProps";
import Toast from "react-native-toast-message";

export const VetTab = ({pet, showModal, setShowModal, styles}: TabsProps) => {
  const [notes, setNotes] = React.useState<string | null>(null);

  const handleAddVetVisit = async () => {
    try {
      if (!notes) throw new Error('Notes are required');
      await petService.addVetVisit(pet.id, notes, new Date());
      setNotes(null);
      setShowModal(false);
    } catch (err: Error | any) {
      setShowModal(false);
      Toast.show({
        type: 'error',
        text1: err?.message || 'Failed to add vet visit',
      })
    }
  }

  return <>
    <FlatList
      data={pet.vet_visit_logs}
      renderItem={({item}) => (
        <View style={styles.logItem}>
          <Text>Notes: {item.notes}</Text>
          <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
    <Button
      style={styles.addButton}
      onPress={() => setShowModal(true)}
    >
      Add New Vet Visit
    </Button>

    {/* Modal */}
    <Portal>
      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New Vet Visit</Text>
        </View>

        <TextInput
          label="Notes"
          value={notes || ''}
          onChangeText={setNotes}>
        </TextInput>


        <View style={styles.modalButtons}>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleAddVetVisit}
            disabled={!notes}
          >
            Save Vet Visit
          </Button>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  </>
}
