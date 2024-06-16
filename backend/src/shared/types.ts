import mongoose from "mongoose";


export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

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
  service: string;
  user_id: string;
  createdAt?: Date;
  imageUrls: string;
  lastUpdated : Date;
}

export interface BookingType {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
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
}

export interface MedicalRecord {
  _id: string;
  userID: string;
  pet: string;
  date: string;
  description: string;
  status: 'open' | 'closed' | 'pending';
}