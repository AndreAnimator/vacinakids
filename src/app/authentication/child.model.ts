import { Vaccine } from "../vaccine/vaccine.model";

export interface VaccineTaken {
  vaccineId: string;
  dateTaken: string;
}
export interface Child {
  id: string;
  age: number;
  name: string;
  vaccines_taken: VaccineTaken[];
}

export interface ChildForm {
  name: string;
  age: number;
  vaccines_taken: VaccineTaken[];
}