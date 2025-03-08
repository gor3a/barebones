import {Pet} from '@/types';
import {BodyCondition} from "@/constant";
import {supabase} from "@/services/supabase";

export const petService = {
  async getPets(): Promise<Pet[]> {
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User not logged in");

    const {data, error} = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', {ascending: false});

    if (error) throw error;
    return data as Pet[];
  },

  async getPetById(id: string): Promise<Pet | null> {
    const {data, error} = await supabase
      .from('pets')
      .select(`
    *,
    body_condition_logs(*),
    vet_visit_logs(*),
    weight_logs(*)
  `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data as Pet;
  },

  async addPet(pet: {
    name: string;
    species: string;
    breed?: string | null;
    age: number | string;
    owner_id: string;
  }): Promise<Pet | null> {
    const {data, error} = await supabase
      .from('pets')
      .insert([pet])
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as Pet;
  },
  async addVetVisit(
    petId: string,
    notes: string,
    date: Date
  ): Promise<boolean> {
    const {error} = await supabase.from('vet_visit_logs').insert([
      {
        pet_id: petId,
        notes,
        date: date.toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  },
  async addWeightLog(petId: string, weight: string, date: Date) {
    const {error} = await supabase.from('weight_logs').insert([
      {
        pet_id: petId,
        weight,
        date: date.toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      return false;
    }
    return true;
  },
  async addBodyConditionLog(
    petId: string,
    bodyCondition: BodyCondition,
    date: Date
  ) {
    const {error} = await supabase.from('body_condition_logs').insert([
      {
        pet_id: petId,
        body_condition: bodyCondition,
        date: date.toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return true;
  }
};
