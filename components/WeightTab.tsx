import React from "react";
import {petService} from "@/services/petService";
import {FlatList, Text, View} from "react-native";
import {Button, Modal, Portal, TextInput} from "react-native-paper";
import {TabsProps} from "@/types/TabsProps";
import Toast from "react-native-toast-message";

export const WeightTab = ({pet, showModal, setShowModal, styles}: TabsProps) => {
  const [weight, setWeight] = React.useState<string | null>(null);

  const handleAddWeight = async () => {
    try {
      if (!weight) throw new Error('Weight are required');
      await petService.addWeightLog(pet.id, weight, new Date());
      setWeight(null);
      setShowModal(false);
    } catch (err: Error | any) {
      setShowModal(false);
      Toast.show({
        type: 'error',
        text1: err?.message || 'Failed to add weight',
      })
    }
  }

  return <>
    <FlatList
      data={pet.weight_logs}
      renderItem={({item}) => (
        <View style={styles.logItem}>
          <Text>Notes: {item.weight} Kg</Text>
          <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
    <Button
      style={styles.addButton}
      onPress={() => setShowModal(true)}
    >
      Add New Weight
    </Button>

    <Portal>
      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New Weight</Text>
        </View>

        <TextInput
          label="Weight"
          keyboardType='numeric'
          value={weight || ''}
          onChangeText={setWeight}>
        </TextInput>


        <View style={styles.modalButtons}>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleAddWeight}
            disabled={!weight}
          >
            Save Weight
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
