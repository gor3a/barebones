import React from "react";
import {petService} from "@/services/petService";
import {FlatList, Text, View} from "react-native";
import {Button, Modal, Portal} from "react-native-paper";
import {TabsProps} from "@/types/TabsProps";
import Toast from "react-native-toast-message";
import {PaperSelect} from "react-native-paper-select";
import {BodyCondition} from "@/constant";
import {ListItem} from "react-native-paper-select/lib/typescript/interface/paperSelect.interface";

export const BodyTab = ({pet, showModal, setShowModal, styles}: TabsProps) => {
  const [bodyCondition, setBodyCondition] = React.useState<BodyCondition | null>(null);

  const keys = Object.keys(BodyCondition)
    .filter(key => isNaN(Number(key))) as (keyof typeof BodyCondition)[];

  const bodyConditionOptions: ListItem[] = keys.map(key => ({
    _id: key,
    value: BodyCondition[key],
  }));


  const handleAddBodyLog = async () => {
    try {
      if (!bodyCondition) throw new Error('Body condition is required');
      await petService.addBodyConditionLog(pet.id, bodyCondition, new Date());
      setBodyCondition(null);
      setShowModal(false);
    } catch (err: Error | any) {
      setShowModal(false);
      Toast.show({
        type: 'error',
        text1: err?.message || 'Failed to add body condition log',
      })
    }
  }

  return <>
    <FlatList
      data={pet.body_condition_logs}
      renderItem={({item}) => (
        <View style={styles.logItem}>
          <Text>Body Condition: {item.body_condition}</Text>
          <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
    <Button
      style={styles.addButton}
      onPress={() => setShowModal(true)}
    >
      Add New Body Condition
    </Button>

    {/* Modal */}
    <Portal>
      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New Body Condition</Text>
        </View>

        <PaperSelect
          label='Body Condition'
          value={bodyCondition || ''}
          onSelection={(value) => {
            setBodyCondition(value.selectedList[0].value as any)
          }}
          arrayList={bodyConditionOptions}
          selectedArrayList={bodyConditionOptions.filter(option => option.value === bodyCondition)}
          multiEnable={false}
        >
        </PaperSelect>


        <View style={styles.modalButtons}>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleAddBodyLog}
            disabled={!bodyCondition}
          >
            Save Body Condition
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
