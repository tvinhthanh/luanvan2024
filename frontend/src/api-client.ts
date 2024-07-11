import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  BookingType,
  MedicType,
  Pet,
  ServiceType,
  UserType,
  VetCType,
} from "../../backend/src/shared/types";
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message);
    }

    const body = await response.json();
    localStorage.setItem('token', body.token); // Store the token upon successful login
    console.log('Stored token:', body.token); // Log the stored token for verification
    return body; // Return the response body if needed
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error('Failed to sign in');
  }
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
// export const fetchBookings = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/bookings`, {
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch bookings");
//   }
//   return response.json();
// };

// export const deleteBooking = async (bookingId: string) => {
//   const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
//     method: "DELETE",
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to delete booking");
//   }
//   return response.json();
// };

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
export const fetchPetByOwnerId = async (ownerId: string): Promise<Pet[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pet/${ownerId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pets");
    }
    const data = await response.json();
    return data as Pet[]; // Đảm bảo rằng dữ liệu được trả về là một mảng các đối tượng Pet
  } catch (error) {
    throw new Error("Failed to fetch pets"); // Xử lý lỗi nếu cần thiết
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

export const fetchVet = async (): Promise<VetCType> => {
  const response = await fetch(`${API_BASE_URL}/api/vet`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vet");
  }

  return response.json();
};

export const fetchVetById = async (vetId: string): Promise<VetCType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-vet/${vetId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch vet');
  }

  return response.json();
};

export const fetchMyVets = async (userId: string): Promise<VetCType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-vet?user_id=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include credentials if needed (e.g., cookies)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch vets');
  }

  return response.json();
};

export const addMyVet = async (name : string, phone: string, address:string,img: string,description: string,userId: string) => {
  let vetData = {
    name: name,
    phone : phone,
    address: address,
    img : img,
    description: description,
    userId: userId
  }
        const response = await fetch(`${API_BASE_URL}/api/my-vet`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vetData),
      });
      alert(vetData)
      if (!response.ok) {
        throw new Error('Failed to add vet');
      }
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

export const addBreed = async (breedData: string, img: string, id_type:string) => {
  let breed = {
    name : breedData,
    img :img,
    id_type : id_type
  }
  const response = await fetch(`${API_BASE_URL}/api/breed`,
   {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(breed)
  }, );

  if (!response.ok) {
    throw new Error('Failed to add breed');
  }

  return response.json();
};

export const updateVet = async (id: string, vetData: {
  name: string;
  address: string;
  phone: string;
  imageUrls: string[];
}) => {
  const response = await fetch(`${API_BASE_URL}/api/my-vet/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vetData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update vet';
    if (response.status === 404) {
      errorMessage = 'Vet not found';
    } else if (response.status === 500) {
      errorMessage = 'Server error';
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateBreed = async (breedId: string, breedData: string, img: string, id_type:string) => {
  let breed = 
  {
    id : breedId,
    name:breedData,
    img : img,
    id_type : id_type   
  }
    const response = await fetch(`${API_BASE_URL}/api/breed/${breedId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(breed),
    });

    if (!response.ok) {
      throw new Error('Failed to update breed');
    }

  return response.json();
};
export const fetchBreedById = async (breedId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/breed/${breedId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch breed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breed by id:', error);
    throw error; // Rethrow the error for the caller to handle
  }
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
//service
// export const fetchService = async (vetId: string) => {
//   const response = await fetch(`${API_BASE_URL}/api/service`, {
//     method: 'GET',
//     credentials: 'include',
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch service');
//   }

//   return response.json();
// };
export const fetchServicesForVet = async (vetId: string): Promise<ServiceType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/service/${vetId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};
export const fetchServiceById = async (ser_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/service/${ser_id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching service by id:', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const addService = async (name: string, price: string, duration: string, available: boolean, vetId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/service/${vetId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Ensure cookies are sent with the request
    body: JSON.stringify({ name, price, duration, available, vetId }),
  });

  if (!response.ok) {
    throw new Error('Error adding service');
  }

  return response.json();
};

export const updateService = async (service: ServiceType): Promise<ServiceType> => {
  const response = await fetch(`${API_BASE_URL}/api/service/${service._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials:"include",
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    throw new Error("Failed to update service");
  }
  return response.json();
};
export const deleteService = async (ser_id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/service/${ser_id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete breed');
  }

  return response.json();
};
//booking
export const fetchBookings = async (vetId: string): Promise<BookingType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings/${vetId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
};
export const fetchBookingById = async (bookingId: string): Promise<BookingType> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch booking details");
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};
// export const addService = async (name: string, price: string, duration: string, available: boolean, vetId: string) => {
//   const response = await fetch(`${API_BASE_URL}/api/service/${vetId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include', // Ensure cookies are sent with the request
//     body: JSON.stringify({ name, price, duration, available, vetId }),
//   });

//   if (!response.ok) {
//     throw new Error('Error adding service');
//   }

//   return response.json();
// };
export const addBooking = async (newBooking: BookingType): Promise<BookingType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify(newBooking),
  });

  if (!response.ok) {
    throw new Error('Failed to add booking');
  }

  return response.json();
};

export const deleteBooking = async (bookingId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-vet/bookings/${bookingId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }
  return response.json();
};

// Hàm gọi API để tạo bản ghi y tế mới
export const createMedicalRecord = async (medicalRecordData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(medicalRecordData),
    });
    if (!response.ok) {
      throw new Error('Failed to create medical record');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

// Hàm gọi API để lấy danh sách bản ghi y tế dựa trên vetId
// API client function to fetch vetId based on userId
export const fetchVetIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    // Call API to fetch vetId based on userId
    const response = await fetch(`${API_BASE_URL}/my-vet/vetId?user_id=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch vetId');
    }
    const data = await response.json();
    return data.vetId; // Assuming your API returns vetId in the response
  } catch (error) {
    console.error('Error fetching vetId:', error);
    throw error;
  }
};

// Hàm gọi API để cập nhật bản ghi y tế theo ID
export const updateMedicalRecord = async (medicalRecordId: string, updatedData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medical-records/${medicalRecordId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Failed to update medical record');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
};

// Hàm gọi API để xóa bản ghi y tế theo ID
export const deleteMedicalRecord = async (medicalRecordId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/medical-records/${medicalRecordId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete medical record');
    }
    return { message: 'Medical record deleted' };
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
};
export const fetchMedicalRecordsByVetId = async (vetId: string): Promise<MedicType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/medical-records/${vetId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};
// export async function fetchMedicalRecordById(recordId: string): Promise<MedicType[]>  {
//   const response = await fetch(`${API_BASE_URL}/api/medical-records/${recordId}`, {
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch services');
//   }

//   return response.json();
// }
export async function fetchMedicalRecordById(recordId: string): Promise<MedicType> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/medical-records/${recordId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch medical record: ${response.status}`);
    }

    const data = await response.json();
    return data as MedicType;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}
export const updateBookingStatus = async (bookingId: string, newStatus: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error updating booking status`);
  }
};