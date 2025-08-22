import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Card,
  Flex,
  Heading,
  Image,
  Text,
  Tag,
  Button,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useCategories } from "../contexts/CategoriesContext";
import { useUsers } from "../contexts/UsersContext";
import { formatDate, formatTime } from "../utils/DateUtils";
import { Edit } from "../components/Edit";
//------------------

export const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const categories = useCategories();
  const users = useUsers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete mislukt");
      toast({
        title: "Event verwijderd",
        description: "Het evenement is succesvol verwijderd.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      closeDeleteDialog();
      navigate("/events");
    } catch (err) {
      toast({
        title: "Error bij verwijderen",
        description: err.message || "Onbekende fout",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Loading...</div>;

  const creator = users.find((user) => user.id === event.createdBy);

  return (
    <div>
      <Flex justify="center" align="center" minH="100vh" p={4}>
        <VStack spacing="0.5rem" w="100%" maxW={{ base: "100%", md: "525px" }}>
          <Box w="100%" textAlign="left" mt={3} mb={3}>
            <Button onClick={() => navigate("/events")} bg="#a0d3f2">
              ← Back
            </Button>
          </Box>

          <Card
            w="100%"
            h="auto"
            bg="#a0d3f2"
            maxW={{ base: "100%", md: "525px" }}
          >
            {/* Header kaart */}
            <Tag
              fontSize={{ base: "0.6em", md: "0.5em" }}
              position="absolute"
              top="0.5rem"
              right="0.5rem"
              h="1.2rem"
              shadow="md"
              colorScheme="red"
              px="0.5rem"
            >
              {creator ? (
                <Text>Gemaakt door: {creator.name}</Text>
              ) : (
                <Text>Creator unknown</Text>
              )}
            </Tag>
            <Flex>
              <Image
                src={event.image || "/fallback.jpg"}
                alt={event.title}
                objectFit="cover"
                w="100%"
                h="auto"
              />
            </Flex>

            {/* informatie v.d kaart */}
            <Flex w="100%" p="0.5rem" gap={{ base: "0.5rem", md: "1rem" }}>
              <Flex
                direction="column"
                justifyContent="start"
                w={{ base: "100%", md: "50%" }}
              >
                <Heading fontSize={{ base: "1.2em", md: "2em" }}>
                  {event.title}
                </Heading>

                <Text
                  fontSize={{ base: "0.7em", md: "1em" }}
                  h="auto"
                  maxH="5rem"
                  overflowY="auto"
                  lineHeight="1.5"
                >
                  {event.description}
                </Text>
              </Flex>
              <Flex
                direction="column"
                alignItems="end"
                w={{ base: "100%", md: "50%" }}
                fontSize={{ base: "0.8em", md: "1em" }}
                gap="0.2rem"
                pr="0.5rem"
              >
                <Text fontSize="0.8em">
                  <strong>Category:</strong>{" "}
                  {event.categoryIds && event.categoryIds.length > 0
                    ? event.categoryIds
                        .map((id) => categories[id] || "Onbekend")
                        .join(", ")
                    : "Onbekend"}
                </Text>
                <Text fontSize="0.8em">
                  <strong>Location:</strong> {event.location || "Onbekend"}
                </Text>
              </Flex>
            </Flex>

            {/* footer kaart */}
            <Flex
              fontSize={{ base: "0.7em", md: "0.8em" }}
              color="gray.600"
              bg="#ffffffb3"
              textAlign="center"
              borderRadiusBottum="10px"
              shadow="xl"
              padding="0.5rem"
              w="100%"
            >
              {/* Date en tijd box */}
              <Box w="50%">
                <Flex direction="row" gap="0.5rem">
                  <Text w="2.1rem" fontWeight="700">
                    Date:
                  </Text>
                  <Text w="auto">{formatDate(event.startTime)}</Text>
                </Flex>
                <Flex direction="row" justifyContent="start" gap="0.5rem">
                  <Text w="2.1rem" fontWeight="700">
                    Time:
                  </Text>
                  <Text w="auto">
                    {formatTime(event.startTime)} t/m{" "}
                    {formatTime(event.endTime)} uur.
                  </Text>
                </Flex>
              </Box>

              {/* knoppen voor bewerking kaard */}
              <Box w="50%">
                <Flex p="0.3rem" gap="0.5rem" justifyContent="right">
                  <Button
                    onClick={onOpen}
                    w="3.5rem"
                    h="auto"
                    fontSize="1em"
                    bg="#a0d3f2"
                    color="black"
                  >
                    Bewerk
                  </Button>
                  <Button
                    onClick={openDeleteDialog}
                    w="4rem"
                    fontSize="1em"
                    colorScheme="red"
                  >
                    Verwijder
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </VStack>

        {event && (
          <Edit
            isOpen={isOpen}
            onClose={onClose}
            eventData={event}
            onEventUpdated={(updated) => setEvent(updated)}
          />
        )}

        {/* Informatie dialoog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeDeleteDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Event verwijderen
              </AlertDialogHeader>

              <AlertDialogBody>
                Weet je zeker dat je dit evenement wilt verwijderen? Deze actie
                kan niet ongedaan worden gemaakt.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeDeleteDialog}>
                  Annuleer
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Verwijder
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </div>
  );
};
