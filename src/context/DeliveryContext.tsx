"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface DeliveryState {
  address: string;
  city: string;
  zipCode: string;
  isServiceable: boolean;
  orderTiming: "now" | "scheduled";
  scheduledDate: string;
  scheduledTime: string;
  hasEnteredAddress: boolean;
}

type DeliveryAction =
  | { type: "SET_ADDRESS"; payload: { address: string; city: string; zipCode: string } }
  | { type: "SET_SERVICEABILITY"; payload: boolean }
  | { type: "SET_TIMING"; payload: { orderTiming: "now" | "scheduled"; scheduledDate?: string; scheduledTime?: string } }
  | { type: "SET_ENTERED"; payload: boolean }
  | { type: "LOAD"; payload: DeliveryState }
  | { type: "RESET" };

const initialState: DeliveryState = {
  address: "",
  city: "",
  zipCode: "",
  isServiceable: false,
  orderTiming: "now",
  scheduledDate: "",
  scheduledTime: "",
  hasEnteredAddress: false,
};

function deliveryReducer(state: DeliveryState, action: DeliveryAction): DeliveryState {
  switch (action.type) {
    case "SET_ADDRESS":
      return { ...state, ...action.payload };
    case "SET_SERVICEABILITY":
      return { ...state, isServiceable: action.payload };
    case "SET_TIMING":
      return {
        ...state,
        orderTiming: action.payload.orderTiming,
        scheduledDate: action.payload.scheduledDate ?? state.scheduledDate,
        scheduledTime: action.payload.scheduledTime ?? state.scheduledTime,
      };
    case "SET_ENTERED":
      return { ...state, hasEnteredAddress: action.payload };
    case "LOAD":
      return action.payload;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface DeliveryContextValue {
  delivery: DeliveryState;
  setAddress: (address: string, city: string, zipCode: string) => void;
  setServiceability: (isServiceable: boolean) => void;
  setTiming: (orderTiming: "now" | "scheduled", scheduledDate?: string, scheduledTime?: string) => void;
  setEntered: (entered: boolean) => void;
  resetDelivery: () => void;
}

const DeliveryContext = createContext<DeliveryContextValue | undefined>(undefined);

const STORAGE_KEY = "dqb-delivery";

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [delivery, dispatch] = useReducer(deliveryReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD", payload: { ...initialState, ...parsed } });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(delivery));
    } catch {
      // Ignore storage errors
    }
  }, [delivery]);

  const setAddress = (address: string, city: string, zipCode: string) => {
    dispatch({ type: "SET_ADDRESS", payload: { address, city, zipCode } });
  };

  const setServiceability = (isServiceable: boolean) => {
    dispatch({ type: "SET_SERVICEABILITY", payload: isServiceable });
  };

  const setTiming = (orderTiming: "now" | "scheduled", scheduledDate?: string, scheduledTime?: string) => {
    dispatch({ type: "SET_TIMING", payload: { orderTiming, scheduledDate, scheduledTime } });
  };

  const setEntered = (entered: boolean) => {
    dispatch({ type: "SET_ENTERED", payload: entered });
  };

  const resetDelivery = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <DeliveryContext.Provider
      value={{ delivery, setAddress, setServiceability, setTiming, setEntered, resetDelivery }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery(): DeliveryContextValue {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error("useDelivery must be used within a DeliveryProvider");
  }
  return context;
}
