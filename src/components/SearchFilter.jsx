//search functie

import { Flex, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
//------------------

//1️⃣ State create
//2️⃣ Filterlogica schrijven
//3️⃣ Functies maken voor search- en filterveranderingen
//4️⃣ UI bouwen met search- en filtervelden
//5️⃣ Component in de pagina gebruiken
export const SearchFilter = ({ events, categories, onFilter }) => {
  //benodigen props v.d andere component
  //1️⃣ State create
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  //2️⃣ Filterlogica schrijven
  const applyFilter = (term, category) => {
    //parameter doorgeven van juiste update van

    let filteredEvents = Array.isArray(events) ? events : [];
    if (term) {
      //zoekmachine
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(term.toLowerCase())
      );
    }
    //selectionOptions
    //filter functie
    if (category) {
      filteredEvents = filteredEvents.filter((event) =>
        event.categoryIds.includes(parseInt(category))
      );
    }
    onFilter(filteredEvents);
  };

  //3️⃣ Functies maken voor search- en filterveranderingen
  const handleSearch = (e) => {
    //zoekmachineveld als er wat wordt ingevoerd
    const term = e.target.value;
    setSearchTerm(term);
    applyFilter(term, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilter(searchTerm, category);
  };

  ////4️⃣ UI bouwen met search- en filtervelden
  return (
    <Flex
      justifyContent="center"
      gap="1rem"
      w={{ base: "100%", sm: "100%", md: "100%" }}
    >
      <Input
        placeholder="Search events"
        value={searchTerm}
        onChange={handleSearch}
        w={{ base: "75%", sm: "100%" }}
      />

      <Select
        placeholder="Select All"
        value={selectedCategory}
        onChange={handleCategoryChange}
        w={{ base: "45%", sm: "40%" }}
        fontSize={{ base: "0.8em", sm: "0.9em", md: "1em" }}
      >
        {Object.entries(categories).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
