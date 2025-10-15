import { createContext, useState, useMemo } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Tránh object bị tạo lại mỗi lần render
  const value = useMemo(() => ({ loading, setLoading }), [loading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
