//hergebruiken context: Categories
import { createContext, useContext, useEffect, useState } from "react";
//------------------

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await response.json();

        const newCategories = {};
        categoriesData.forEach((category) => {
          newCategories[category.id] = category.name;
        });

        setCategories(newCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
};

//Customer hook

export const useCategories = () => useContext(CategoriesContext);
