//Component alleen de Evenement kaart

import { Link } from "react-router-dom";
import { Heading, Card, Flex, Text, Image, Tag } from "@chakra-ui/react";
import { formatDate, formatTime } from "../utils/DateUtils";
//------------------

export const EventCard = ({ event, creator }) => {
  console.log("Event categorieën in EventCard456:", event.categories);
  return (
    <Link to={`/events/${event.id}`}>
      <Card
        key={event.id}
        maxW="300px"
        h="400px"
        overflow="hidden"
        bg="#A0D3F2"
        boxShadow="lg"
        borderRadius="md"
      >
        <Tag
          fontSize="0.5em"
          position="absolute" // Plaats de tag absoluut
          top="0.5rem"
          right="0.5rem" // Verplaats naar de rechterbovenhoek
          h="1rem"
          shadow="xl"
          colorScheme="red"
        >
          {creator ? (
            <Text>Gemaakt door: {creator.name}</Text>
          ) : (
            <Text>Maker onbekend</Text>
          )}
        </Tag>
        <Flex>
          <Image
            src={event.image}
            alt={event.title}
            w="100%"
            h="180px" // Verhoogde hoogte voor de afbeelding
            objectFit="cover"
          />
        </Flex>

        <Flex direction="column" p="0.5rem" flex="1" justify="space-between">
          <Flex direction="column" flex="1">
            <Heading fontSize="1.5em" noOfLines={1} mb="0.5rem">
              {event.title}
            </Heading>
            <Text
              fontSize="1em"
              noOfLines={3}
              overflow="hidden"
              textOverflow="ellipsis"
              flex="1" // Laat de beschrijving de ruimte vullen
            >
              {event.description}
            </Text>
          </Flex>
          <Text
            fontSize="0.8em"
            color="gray.600"
            bg="rgba(255, 255, 255, 0.7)"
            p="0.2rem"
            textAlign="start"
            borderRadius="5px"
            shadow="xl"
            mt="0.5rem"
            w="100%"
          >
            <Flex direction="row" gap="0.5rem" p="0.2rem 0.2rem 0.2rem 0.8rem">
              <Text w="2.8rem" fontWeight="700">
                Datum:
              </Text>
              <Text w="auto">{formatDate(event.startTime)}</Text>
            </Flex>
            <Flex
              direction="row"
              justifyContent="start"
              gap="0.5rem"
              p="0.2rem 0.2rem 0.2rem 0.8rem"
            >
              <Text w="2.8rem" fontWeight="700">
                Tijd:
              </Text>
              <Text w="auto">
                {formatTime(event.startTime)} t/m {formatTime(event.endTime)}{" "}
                uur.
              </Text>
            </Flex>
          </Text>
        </Flex>
      </Card>
    </Link>
  );
};
