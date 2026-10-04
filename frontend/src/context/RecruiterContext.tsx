import React, { createContext, useContext, useState } from "react";

interface RecruiterContextType {
  isRecruiterModalOpen: boolean;
  openRecruiterModal: () => void;
  closeRecruiterModal: () => void;
  toggleRecruiterModal: () => void;
}

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export const RecruiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);

  return (
    <RecruiterContext.Provider
      value={{
        isRecruiterModalOpen,
        openRecruiterModal: () => setIsRecruiterModalOpen(true),
        closeRecruiterModal: () => setIsRecruiterModalOpen(false),
        toggleRecruiterModal: () => setIsRecruiterModalOpen((prev) => !prev),
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
};

export const useRecruiter = () => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error("useRecruiter must be used within a RecruiterProvider");
  }
  return context;
};
