import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import Edit from "../assests/images/edit.png";
import { useNavigate } from "react-router-dom";

function Header({ textInput, setTextInput }) {
  const navigate = useNavigate();
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="25px">All Messages</Text>
        <Button
          border="unset"
          backgroundColor="#4D77FF"
          h="30px"
          w="50px"
          cursor="pointer"
          onClick={() => navigate("/settings")}
          _hover={{}}
        >
          <Image src={Edit} w="20px" />
        </Button>
      </Flex>
      <Input
        h="40px"
        px="10px"
        fontSize="15px"
        placeholder="Search Message"
        border="1px solid #ccc"
        bg="#fff"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />
    </>
  );
}

export default Header;
