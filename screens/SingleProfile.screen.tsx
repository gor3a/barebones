import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LogType, Pet} from '@/types';
import {petService} from "@/services/petService";
import {BodyTab} from "@/components/BodyTab";
import {VetTab} from "@/components/VetTab";
import {WeightTab} from "@/components/WeightTab";


type RootStackParamList = {
  SingleProfile: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'SingleProfile'>;

const PetCard = ({pet}: { pet: Pet }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{pet.name}</Text>
    <Text>Species: {pet.species}</Text>
    <Text>Age: {pet.age} years</Text>
  </View>
);

export const SingleProfileScreen: React.FC<Props> = ({route}) => {
  const {id} = route.params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LogType>('weight');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      const pet = await petService.getPetById(id);
      setPet(pet);
    })()
  }, [showModal])

  useEffect(() => {
    (async () => {
      try {
        const pet = await petService.getPetById(id);
        setPet(pet);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={styles.loader}/>;
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  const renderLogs = () => {
    switch (activeTab) {
      case 'weight':
        return <WeightTab pet={pet} showModal={showModal} setShowModal={setShowModal} styles={styles}/>

      case 'body':
        return <BodyTab pet={pet} showModal={showModal} setShowModal={setShowModal} styles={styles}/>

      case 'vet':
        return <VetTab pet={pet} showModal={showModal} setShowModal={setShowModal} styles={styles}/>

    }
  };

  return (
    <View style={styles.container}>
      <PetCard pet={pet}/>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'weight' && styles.activeTab]}
          onPress={() => setActiveTab('weight')}
        >
          <Text style={styles.tabText}>Weight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'body' && styles.activeTab]}
          onPress={() => setActiveTab('body')}
        >
          <Text style={styles.tabText}>Body</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'vet' && styles.activeTab]}
          onPress={() => setActiveTab('vet')}
        >
          <Text style={styles.tabText}>Vet</Text>
        </TouchableOpacity>
      </View>

      {renderLogs()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    marginTop: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthSummary: {
    padding: 16,
    backgroundColor: '#e6f3ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  healthStatus: {
    padding: 16,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  activeTab: {
    borderColor: '#007AFF',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  logItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
  addButton: {
    color: '#0984e3'
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
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  }
});
