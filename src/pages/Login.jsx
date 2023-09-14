import { Container, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Gmail from "../assests/images/gmail.png";
import Outlook from "../assests/images/outlook.png";
import ICloud from "../assests/images/icloud.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function Login() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setToken(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      if (!localStorage.getItem("MAX_NUMBER")) {
        localStorage.setItem("MAX_NUMBER", 5);
      }
      if (!localStorage.getItem("DATE")) {
        localStorage.setItem("DATE", "today");
      }
      navigate("/");
    }
  }, [navigate, token]);
  return (
    <Container
      maxW="full"
      h="100vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#E9EEFF"
      gap="20px"
    >
      <Flex
        backgroundColor="#fff"
        alignItems="center"
        p="10px"
        rounded="20px"
        gap="10px"
        cursor="pointer"
        w="250px"
        onClick={login}
      >
        <Image src={Gmail} w="50px" h="50px" />
        <Text fontWeight="600">Connect with Gmail</Text>
      </Flex>
      <Flex
        backgroundColor="#fff"
        alignItems="center"
        p="10px"
        rounded="20px"
        gap="10px"
        cursor="pointer"
        w="250px"
      >
        <Image src={Outlook} w="50px" h="50px" />
        <Text fontWeight="600">Connect with Outlook</Text>
      </Flex>
      <Flex
        backgroundColor="#fff"
        alignItems="center"
        p="10px"
        rounded="20px"
        gap="10px"
        cursor="pointer"
        w="250px"
      >
        <Image src={ICloud} w="50px" h="50px" />
        <Text fontWeight="600">Connect with ICloud</Text>
      </Flex>
    </Container>
  );
}

export default Login;
