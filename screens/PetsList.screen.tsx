import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, FAB, List, Modal, Portal, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {petService} from "@/services/petService";
import {Pet} from "@/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/App";
import Toast from "react-native-toast-message";
import {supabase} from "@/services/supabase";

interface AddPetProps {
  showAddPetModal: boolean;
  setShowAddPetModal: (show: boolean) => void;
}

const AddPet = ({showAddPetModal, setShowAddPetModal}: AddPetProps) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleAddPet = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    if (!user.data.user?.id) {
      Toast.show({
        type: 'error',
        text1: 'User not found',
      });
      setLoading(false);
      return;
    }

    try {
      const pet = {
        name,
        species,
        breed,
        age,
        owner_id: user.data.user.id,
      }
      await petService.addPet(pet);
      setName('');
      setSpecies('');
      setBreed('');
      setAge('');
      setShowAddPetModal(false);
    } catch (err: Error | any) {
      Toast.show({
        type: 'error',
        text1: err?.message || 'Error adding pet',
      })
    } finally {
      setShowAddPetModal(false);
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={showAddPetModal}
        onDismiss={() => setShowAddPetModal(false)}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New Pet</Text>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Species"
          value={species}
          onChangeText={setSpecies}
          style={styles.input}
        />
        <TextInput
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          style={styles.input}
        />
        <TextInput
          label="Age"
          keyboardType='numeric'
          value={age}
          defaultValue="0"
          onChangeText={setAge}
          style={styles.input}
        />

        <View style={styles.modalButtons}>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleAddPet}
            disabled={loading}
          >
            Save Pet
          </Button>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={() => setShowAddPetModal(false)}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

export const PetsListScreen = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRefresh = async () => {
    try {
      const data = await petService.getPets();
      setPets(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load pets',
      })
    }
  };

  useEffect(() => {
    (async () => {
      await handleRefresh();
    })()
  }, [showAddPetModal]);


  useEffect(() => {
    (async () => {
      try {
        const data = await petService.getPets();
        setPets(data);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Failed to load pets',
        })
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader}/>;
  }

  return (
    <>
      {pets.length === 0 ? (
        <List.Section style={styles.emptyContainer}>
          <List.Icon icon="paw" color="#bdbdbd"/>
          <List.Subheader style={styles.emptyText}>
            No pets found. Tap + to add a new pet!
          </List.Subheader>
        </List.Section>
      ) : (
        <List.Section style={styles.container}>
          <List.Subheader style={styles.subheader}>My Pets</List.Subheader>
          {pets.map(pet => (
            <List.Item
              key={pet.id}
              title={pet.name}
              description={`${pet.species} • ${pet.breed || 'Unknown breed'}`}
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon={pet.species === 'Dog' ? 'dog' : 'cat'}
                  style={styles.avatar}
                />
              )}
              right={props => <List.Icon {...props} icon="chevron-right"/>}
              onPress={() => navigation.navigate('SingleProfile', {id: pet.id})}
              style={styles.listItem}
            />
          ))}
        </List.Section>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          setShowAddPetModal(true);
        }}
      />
      <AddPet showAddPetModal={showAddPetModal} setShowAddPetModal={setShowAddPetModal}/>
    </>
  )
    ;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: '#fff',
  },
  subheader: {
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  avatar: {
    backgroundColor: '#e3f2fd',
  },
  listItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 20,
    backgroundColor: '#2196f3',
    color: '#fff',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    paddingBottom: 16,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#0984e3',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#0984e3',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9e9e9e',
    marginTop: 16,
  },
});
