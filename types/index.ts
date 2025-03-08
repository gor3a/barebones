export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age: number | string;
  created_at: any;
  owner_id: string;
  weight_logs: WeightLog[] | null;
  body_condition_logs: BodyConditionLog[] | null;
  vet_visit_logs: VetVisitLog[] | null;

}

export interface WeightLog {
  id: string;
  pet_id: string;
  weight: any;
  date: string;
}

export interface BodyConditionLog {
  date: string;
  id: string;
  body_condition: string | number;
  pet_id: string;
}

export type LogType = 'weight' | 'body' | 'vet' | any;

export interface VetVisitLog {
  id: string;
  pet_id: string;
  notes: string;
  date: string;
}
