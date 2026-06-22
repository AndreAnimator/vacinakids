import { Vaccine } from "../vaccine/vaccine.model";

export interface Child {
  id: string;
  age: number;
  name: string;
  vaccines_taken: Vaccine[];
}

export interface ChildForm {
  name: string;
  age: number;
  vaccines_taken: string[]; // Array of vaccine IDs
}