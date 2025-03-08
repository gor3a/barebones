import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, FAB, List, Modal, Portal, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {petService} from "@/services/petService";
import {Pet} from "@/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/App";

interface AddPetProps {
  showAddPetModal: boolean;
  setShowAddPetModal: (show: boolean) => void;
}

const AddPet = ({showAddPetModal, setShowAddPetModal}: AddPetProps) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddPet = async () => {
    setLoading(true);
    setError('');

    try {
      const pet = {
        name,
        species,
        breed,
        age,
        owner_id: 'ed13bd43-78c4-4cca-ae85-008c9fe67597',
      }
      const result = await petService.addPet(pet);
      setName('');
      setSpecies('');
      setBreed('');
      setAge('');
      setShowAddPetModal(false);
    } catch (err) {
      setError('Failed to add pet');
    } finally {
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
          <Text style={styles.modalTitle}>New Vet Visit</Text>
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
          value={age}
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
            Save Visit
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await petService.getPets();
      setPets(data);
    } catch (err) {
      setError('Failed to refresh pets');
    } finally {
      setRefreshing(false);
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
        setError('Failed to load pets');
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader}/>;
  }

  if (error) {
    return <List.Subheader style={styles.error}>{error}</List.Subheader>;
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
