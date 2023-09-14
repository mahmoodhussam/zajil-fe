import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [date, setDate] = useState(localStorage.getItem("DATE"));
  const [maxMessages, setMaxMessages] = useState(
    localStorage.getItem("MAX_NUMBER")
  );
  const navigate = useNavigate();
  const handleSave = () => {
    localStorage.setItem("DATE", date);
    localStorage.setItem("MAX_NUMBER", maxMessages);
    navigate("/");
  };
  return (
    <Container
      maxW="full"
      h="100vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      px="10vw"
      py="6vh"
      backgroundColor="#E9EEFF"
      gap="20px"
    >
      <Flex alignItems="center">
        <Text w="200px">Max Number of messages: </Text>
        <Box ml="10px" w="300px">
          <Input
            type="number"
            backgroundColor="#fff"
            defaultValue={maxMessages}
            onChange={(e) => setMaxMessages(e.target.value)}
          />
        </Box>
      </Flex>
      <Flex justifyContent="flex-start" alignItems="center">
        <Text w="200px">Display message date: </Text>
        <Box ml="10px" w="300px" backgroundColor="#fff">
          <Select value={date} onChange={(e) => setDate(e.target.value)}>
            <option value="today">From Today</option>
            <option value="yesterday">From Yesterday</option>
          </Select>
        </Box>
      </Flex>
      <Button
        backgroundColor="blue.300"
        color="#fff"
        _hover=""
        onClick={handleSave}
      >
        Save
      </Button>
    </Container>
  );
}

export default Settings;
