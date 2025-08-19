//hergebruiken context: users label v.d aanmaken event.

import { createContext, useContext, useEffect, useState } from "react";

//------------------

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={users}>{children}</UsersContext.Provider>
  );
};

// Custom hook
export const useUsers = () => useContext(UsersContext);
