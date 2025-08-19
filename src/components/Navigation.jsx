//Navigatie balk

import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
//------------------

export const Navigation = () => {
  return (
    <Box as="nav" bg="#66BCF2">
      <Flex
        as="ul"
        direction="row"
        gap="1rem"
        listStyleType="none"
        justifyContent="center"
        fontSize="1.5em"
        color="white"
      >
        <Box as="li">
          <Link to="/">Events</Link>
        </Box>
      </Flex>
    </Box>
  );
};
