import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="694439530194-foa19ie04n6otauu307gmtnb7het2t1v.apps.googleusercontent.com">
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </GoogleOAuthProvider>
);
