//Component nieuwe evenement toevoegen

import { useState } from "react";
import {
  Box,
  Input,
  Text,
  Textarea,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
//------------------

export const EventAdd = ({ users, categories, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdBy: "",
    newUser: "",
    location: "",
    categoryIds: [],
    startTime: "",
    endTime: "",
    // Extra velden voor "Sport"
    playerCount: "",
    level: "",
  });

  const [error, setError] = useState();

  const fields = [
    { name: "newUser", placeholder: "Jouw naam", type: "text" },
    { name: "image", placeholder: "Alleen URL voor afbeelding", type: "text" },
    { name: "title", placeholder: "Titel van het evenement", type: "text" },
    {
      name: "description",
      placeholder: "Beschrijving van het evenement",
      type: "textarea",
    },
    {
      name: "location",
      placeholder: "Locatie van het evenement",
      type: "text",
    },
    { name: "startTime", placeholder: "Starttijd", type: "datetime-local" },
    { name: "endTime", placeholder: "Eindtijd", type: "datetime-local" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedValues = [...e.target.selectedOptions].map((o) => o.value);
    setFormData((prev) => ({
      ...prev,
      categoryIds: selectedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      "title",
      "description",
      "categoryIds",
      "image",
      "location",
      "startTime",
      "endTime",
    ];

    // Extra controle voor "Sport"-velden als "Sport" is geselecteerd
    const isSportSelected = formData.categoryIds.includes("sport"); // Voorbeeld categorie-ID
    if (isSportSelected && (!formData.playerCount || !formData.level)) {
      setError(
        "Vul het aantal spelers en niveau in als 'Sport' is geselecteerd."
      );
      return;
    }

    if (
      requiredFields.some((field) => !formData[field]) ||
      (!formData.createdBy && !formData.newUser)
    ) {
      setError("Vul alle verplichte velden in of geef een maker op.");
      return;
    }

    let userId = formData.createdBy;
    if (formData.newUser) {
      const existingUser = users.find(
        (u) => u.name.toLowerCase() === formData.newUser.toLowerCase()
      );
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = Date.now();
        const newUser = { id: userId, name: formData.newUser };

        try {
          const usersResponse = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });
          if (!usersResponse.ok) throw new Error("Gebruiker toevoegen mislukt");
        } catch (error) {
          setError("Fout bij het toevoegen van een nieuwe gebruiker.");
          return;
        }
      }
    }

    const newEvent = {
      id: Date.now(),
      createdBy: userId,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      location: formData.location,
      categoryIds: formData.categoryIds,
      startTime: formData.startTime,
      endTime: formData.endTime,
      ...(isSportSelected && {
        playerCount: formData.playerCount,
        level: formData.level,
      }), // Voeg extra velden toe als "Sport" is geselecteerd
    };

    try {
      const eventResponse = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!eventResponse.ok) throw new Error("Evenement toevoegen mislukt");

      const savedEvent = await eventResponse.json();
      onAddEvent(savedEvent);

      setFormData({
        title: "",
        description: "",
        image: "",
        createdBy: "",
        newUser: "",
        location: "",
        categoryIds: [],
        startTime: "",
        endTime: "",
        playerCount: "",
        level: "",
      });
    } catch (error) {
      setError("Fout bij het toevoegen van het evenement.");
      console.error("Fout bij het toevoegen van het evenement:", error);
    }
  };

  const uniqueUsers = Array.from(
    new Map(users.map((u) => [u.name.toLowerCase(), u])).values()
  );

  // Controleer of "Sport" is geselecteerd
  const isSportSelected = formData.categoryIds.includes("sport"); // Pas "sport" aan naar de juiste categorie-ID

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      w={{ base: "100%", md: "500px" }}
      maxW="600px"
      mx="auto"
      mt={4}
    >
      <VStack spacing={4} align="stretch">
        {error && (
          <Text color="red.500" textAlign="center" mb={0}>
            {error}
          </Text>
        )}

        {fields.map((field) => (
          <Box key={field.name}>
            {field.type === "textarea" ? (
              <Textarea
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.name !== "newUser" || !formData.createdBy}
                size="sm"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                resize="vertical"
                minH="100px"
              />
            ) : (
              <Input
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.name !== "newUser" || !formData.createdBy}
                size="sm"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
            )}
          </Box>
        ))}

        <Select
          name="createdBy"
          placeholder="Selecteer bestaande maker"
          value={formData.createdBy}
          onChange={handleChange}
          size="sm"
          borderColor="gray.300"
          borderRadius="md"
          _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
        >
          {uniqueUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>

        <Select
          multiple
          value={formData.categoryIds}
          onChange={handleCategoryChange}
          size="sm"
          borderColor="gray.300"
          borderRadius="md"
          _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
          h="100px"
        >
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>

        {/* Extra velden voor "Sport" */}
        {isSportSelected && (
          <VStack spacing={4} align="stretch">
            <Box>
              <Input
                name="playerCount"
                placeholder="Aantal spelers"
                type="number"
                value={formData.playerCount || ""}
                onChange={handleChange}
                required={isSportSelected}
                size="sm"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
            </Box>
            <Box>
              <Input
                name="level"
                placeholder="Niveau (bijv. Beginner, Gevorderd)"
                type="text"
                value={formData.level || ""}
                onChange={handleChange}
                required={isSportSelected}
                size="sm"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              />
            </Box>
          </VStack>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          size="md"
          borderRadius="md"
          boxShadow="md"
          _hover={{ bg: "blue.600", transform: "scale(1.02)" }}
          transition="all 0.2s ease-in-out"
        >
          Evenement Toevoegen
        </Button>
      </VStack>
    </Box>
  );
};
