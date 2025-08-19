import { useState, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { Grid, Text, Box, Flex } from "@chakra-ui/react";
import { ButtonAdd } from "../components/ButtonAdd";
import { SearchFilter } from "../components/SearchFilter";
import { useCategories } from "../contexts/CategoriesContext";
import { useUsers } from "../contexts/UsersContext";
//------------------
export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const categories = useCategories(); // gebruikt categoriecontext
  const users = useUsers(); // Gebruikers via userContext

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:3000/events");
        if (!eventsResponse.ok) {
          throw new Error("Fout bij ophalen van gegevens");
        }

        const eventsData = await eventsResponse.json();

        console.log(
          "Event IDs:",
          eventsData.map((e) => e.id)
        ); // Controleer of IDs bestaan

        setEvents(eventsData);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  console.log("Events data:", events);

  //Functie om de nieuwe Event toevoegen en automatisch opnieuw laden
  const handleNewEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/events"); // Haal de nieuwste events op
      if (!response.ok) {
        // FIX: juiste check voor fouten
        throw new Error("Failed to update new Events");
      }
      const updatedEvents = await response.json();
      setEvents(updatedEvents); // FIX: Gebruik juiste functie naam
    } catch (error) {
      console.error("Error refreshing the events:", error);
    }
  };

  return (
    <div>
      <Flex direction="column" gap="1rem" p="1rem">
        {/* Header Zoekmachine */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          w="100%"
          maxW="800px"
          mx="auto"
        >
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="500"
            textAlign="center"
          >
            Welcome Events Applications App
          </Text>
          <Flex
            w={{ base: "100%", md: "500px" }}
            maxW="600px"
            justifyContent="center"
            alignItems="center"
            p="0.5rem"
          >
            <SearchFilter
              events={events}
              categories={categories}
              onFilter={setFilteredEvents}
            />
          </Flex>
        </Flex>

        {/* Section toevoeging evenement */}
        <Flex>
          <ButtonAdd
            //props meegeven, anders werkt niet
            users={users}
            categories={categories}
            onAddEvent={handleNewEvent}
          />
        </Flex>

        {/* Section Evenement kaarten */}

        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          w="100%"
        >
          <Box h="auto">
            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "1fr",
                md: "repeat(2, minmax(250px, 300px))", // 2 kaarten op md (≥ 768px)
                lg: "repeat(3, minmax(250px, 300px))", // 3 kaarten op lg (≥ 992px)
                xl: "repeat(auto-fit, minmax(250px, 300px))", // 4+ kaarten op xl (≥ 1280px)
              }}
              gap="1rem"
              maxW="1320px"
              mx="auto"
            >
              {filteredEvents.map((event) => {
                console.log("Single Event:", {
                  id: event.id,
                  title: event.title,
                  hasImage: !!event.image,
                });
                const creator = users.find(
                  (user) => user.id === event.createdBy
                );
                return (
                  <EventCard key={event.id} event={event} creator={creator} />
                );
              })}
            </Grid>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};
