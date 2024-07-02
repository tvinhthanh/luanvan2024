import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { VetCType } from "../../../backend/src/shared/types";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  userRole: number | null;
  stripePromise: Promise<Stripe | null>;
  userId: string;
  id_vet: string; // Include id_vet in AppContext
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

  // Fetch user data including userId and id_vet from the API
  const { isError: isErrorToken, data: tokenData } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  const { isError: isErrorVets, data: vetData } = useQuery<VetCType[], Error>(
    ["fetchMyVets", tokenData?.userId], // Use userId as part of the query key
    () => apiClient.fetchMyVets(tokenData?.userId || ""), // Pass userId to fetchMyVets function
    {
      retry: false,
      enabled: !!tokenData?.userId, // Only enable query when userId is available
    }
  );

  // Combine isError checks
  const isError = isErrorToken || isErrorVets;

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        userRole: tokenData?.isAdmin,
        stripePromise,
        userId: tokenData?.userId,
        id_vet: vetData && vetData.length > 0 ? vetData[0]._id : "", // Check if vetData is defined and has elements
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
