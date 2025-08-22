//Component in EventsPage:  Alleen de button voor Nieuwe event add

import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { EventAdd } from "./EventAdd";

export const ButtonAdd = ({ users, categories, onAddEvent }) => {
  //useState voor button
  const [showForm, setShowForm] = useState(false); //begin waarde false=geen actie

  const toggleFormVisibility = () => {
    setShowForm(!showForm); //!--> = true, hier wordt op geklikt
    console.log("Button is geklick");
  };
  return (
    <Flex direction="column" align="center" w="100%" p={2}>
      <Button
        onClick={toggleFormVisibility}
        bg="#A0D3F2"
        color="white"
        fontWeight="bold"
        borderRadius="md"
        boxShadow="md"
        _hover={{ bg: "#8BC1E8", transform: "scale(1.05)" }} // Hover-effect
        transition="all 0.2s ease-in-out"
        w={{ base: "100%", sm: "200px" }} // Volle breedte op mobiel, vaste breedte op grotere schermen
        maxW="200px"
        py={3} // Verticale padding voor een grotere knop
      >
        {showForm ? "Cancel" : "Add Event"}{" "}
        {/* met ShowForm bepaald de tekst
            -omdat bij useState(false=geen actie = "Add Event")
            -Geklikt is true (tegenstelling ) = "Cancel"
        */}
      </Button>

      {/* Als op Add event klikt komt de formulie zichtbaar */}
      {showForm && (
        <EventAdd
          //props meegeven, anders werkt niet
          users={users}
          categories={categories}
          onAddEvent={onAddEvent}
        />
      )}
    </Flex>
  );
};
