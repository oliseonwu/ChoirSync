import React, { createContext, useContext, useState, useCallback } from "react";
import Parse from "@/services/Parse";

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  groupId: string | null;
};

type UserContextType = {
  getCurrentUserData: () => UserData;

  updateCurrentUserData: (
    firstName: string,
    lastName: string,
    email: string,
    profileImageUrl: string,
    groupId: string
  ) => void;
};

const initialUserData: UserData = {
  firstName: "",
  lastName: "",
  email: "",
  profileImageUrl: "",
  groupId: "",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUserData, setCurrentUserData] =
    useState<UserData>(initialUserData);

  const updateCurrentUserData = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      profileImageUrl: string,
      groupId: string
    ) => {
      setCurrentUserData({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profileImageUrl: profileImageUrl,
        groupId: groupId,
      });
    },
    [currentUserData]
  );

  const getCurrentUserData = useCallback(() => {
    return currentUserData;
  }, [currentUserData]);

  return (
    <UserContext.Provider
      value={{
        getCurrentUserData: getCurrentUserData,
        updateCurrentUserData: updateCurrentUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
