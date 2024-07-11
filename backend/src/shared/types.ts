import mongoose from "mongoose";

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};


export interface Pet {
  _id: string;
  name: string;
  age: string;
  weigh: string;
  breed_id: string;
  owner_id: string;
  sex: string;
  breed_type: string;
  img: string;
}
export interface UserType {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: Boolean; 

}

export interface VetType {
  _id: string;
  name: string;
  address: string;
  phone: string;
  service: string[];
  user_id: string;
  createdAt: Date;
  imageUrls: string[];
  lastUpdated : Date;
  description: string;
}

export interface BookingType {
  _id: string;
  ownerId: string;
  petId: string;
  vetId:string;
  phoneOwner: string;
  date: Date;
  status: number;
}

export interface OwnerType {
  _id: string;
  name: string;
  email: string;
  pass: string;
  phone: string;
  role: number;
  img: string;
}

export interface PetType {
  _id: string;
  name: string;
  age: string;
  weigh: string;
  breed_id: string;
  owner_id: string;
  sex: string;
  breed_type: string;
  img: string;
}

export interface BreedType {
  _id: string;
  name: string;
  array: [];
}

export interface Breed{
  _id: string;
  name:  string;
  img: string;
  id_type: string;
}

// export interface MedicalRecord {
//   _id: string;
//   petId: string;
//   ownerId: string;
//   vetId: string;
//   visitDate: string;
//   reasonForVisit: string;
//   symptoms: string;
//   diagnosis: string;
//   treatmentPlan: string;
//   medications: Medication[];
//   notes: string;
// }

// interface Medication {
//   name: string;
//   dosage: string;
//   instructions: string;
// }


export interface ServiceType {
  _id: string;
  name: string;
  price: number;
  duration: number;
  available: boolean;
  id_vet: string;
}
// export type VetCType = {
//   _id: string;
//   name: string;
//   address: string;
//   phone: string;
//   service?: string[];
//   description: string;
//   user_id: string;
//   createdAt: Date;
//   imageUrls?: string[];
//   lastUpdated: Date;
//   booking?: any[];
// };
export interface VetCType {
  _id: string;
  name: string;
  address: string;
  phone: string;
  service: string[];
  user_id: string;
  createdAt: Date;
  imageUrls: string[];
  lastUpdated: Date;
  description?: string;
  booking?: BookingType[];
  medicalrecord?: MedicType[];
} 

export interface MedicType {
  _id: string;
  petId: string;
  ownerId: string;
  vetId: string;
  visitDate: Date;
  reasonForVisit: string;
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  notes?: string;
  medications: MedicationType[]; // Add this line
}

export interface MedicationType {
  name: string;
  dosage: string;
  instructions: string;
}
