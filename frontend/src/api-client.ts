import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  Pet,
  UserType,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import { BiBookReader } from "react-icons/bi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/create-hotel`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUser = async (userData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    credentials: "include",
    body: userData,
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const updateUser = async (userId: string, userData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    credentials: "include",
    body: userData,
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};

//owners
export const fetchOwner = async () => {
  const response = await fetch(`${API_BASE_URL}/api/owner`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch owners");
  }

  return response.json();
};

export const createOwner = async (ownerData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/owner`, {
    method: "POST",
    credentials: "include",
    body: ownerData,
  });

  if (!response.ok) {
    throw new Error("Failed to create owner");
  }

  return response.json();
};

export const updateOwner = async (ownerId: string, ownerData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/owner/${ownerId}`, {
    method: "PUT",
    credentials: "include",
    body: ownerData,
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

export const deleteOwner = async (ownerId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/owner/${ownerId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete owner");
  }

  return response.json();
};
export const fetchBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  return response.json();
};

export const deleteBooking = async (bookingId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }
  return response.json();
};

export const createPet = async (petData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/pet`, {
    method: "POST",
    credentials: "include",
    body: petData,
  });

  if (!response.ok) {
    throw new Error("Failed to create pet");
  }

  return response.json();
};

export const updatePet = async (petId: string, petData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/pet/${petId}`, {
    method: "PUT",
    credentials: "include",
    body: petData,
  });

  if (!response.ok) {
    throw new Error("Failed to update pet");
  }

  return response.json();
};
export const fetchpet = async (): Promise<Pet[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pet`);
    if (!response.ok) {
      throw new Error("Failed to fetch pet");
    }
    const data = await response.json();
    return data as Pet[]; // Đảm bảo rằng dữ liệu được trả về là một mảng của các đối tượng Pet
  } catch (error) {
    throw new Error("Failed to fetch pet"); // Xử lý lỗi nếu cần thiết
  }
};
export const fetchpet1 = async (petId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/pet/${petId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pet");
  }

  return response.json();
};
export const deletePet = async (petId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/pet/${petId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete pet");
  }

  return response.json();
};

export const searchPet = async (searchParams: any) => {
  const queryParams = new URLSearchParams();
  // Thêm các tham số tìm kiếm vào queryParams

  const response = await fetch(`${API_BASE_URL}/api/pet/search?${queryParams.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to search pet");
  }

  return response.json();
};

export const fetchVet = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vet`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vets");
  }

  return response.json();
};

export const createVet = async (ownerData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/vet`, {
    method: "POST",
    credentials: "include",
    body: ownerData,
  });

  if (!response.ok) {
    throw new Error("Failed to create vet");
  }

  return response.json();
};

export const updateVet = async (vetId: string, vetData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/owner/${vetId}`, {
    method: "PUT",
    credentials: "include",
    body: vetData,
  });

  if (!response.ok) {
    throw new Error("Failed to update vet");
  }

  return response.json();
};

export const deleteVet = async (vetId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/vet/${vetId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete vet");
  }

  return response.json();
};

export const fetchBreeds = async () => {
  const response = await fetch(`${API_BASE_URL}/api/breed`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch breeds');
  }

  return response.json();
};

export const addBreed = async (breedData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/breed`, {
    method: 'POST',
    credentials: 'include',
    body: breedData,
  });

  if (!response.ok) {
    throw new Error('Failed to add breed');
  }

  return response.json();
};

export const updateBreed = async (breedId: string, breedData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/breed/${breedId}`, {
      method: 'PUT',
      credentials: 'include',
      body: breedData,
    });

    if (!response.ok) {
      throw new Error('Failed to update breed');
    }

  return response.json();
};

export const deleteBreed = async (breedId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/breed/${breedId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete breed');
  }

  return response.json();
};
//breedtype
export const fetchBreedType = async () => {
  const response = await fetch(`${API_BASE_URL}/api/breedType`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch breedType');
  }

  const data = await response.json();
  return data; // The response should already contain the mapped breed types with their breeds
};

export const addBreedType = async (breedData: string) => {
  alert("Add "+breedData+" to DB success");
  let breedType = {
    name: breedData
  }
  const response = await fetch(`${API_BASE_URL}/api/breedType`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(breedType),
  });

  if (!response.ok) {
    throw new Error('Failed to add breedType');
  }

  return response.json();
};

export const updateBreedType = async (breedId: string, breedData: string) => {
  let breadType = {
    name: breedData
  }
  const response = await fetch(`${API_BASE_URL}/api/breedType/${breedId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(breadType),
  });
  if (!response.ok) {
    throw new Error('Failed to update breedType');
  }
  return response.json();
};

export const deleteBreedType = async (breedId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/breedType/${breedId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
  },
  });

  if (!response.ok) {
    throw new Error('Failed to delete breed');
  }
  const text = await response.text();
  if (text) {
      try {
          const data = JSON.parse(text);
          return data;
      } catch (error) {
          console.error("Error parsing response:", error);
      }
  }
  return response.json();
};