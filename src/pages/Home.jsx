import { Container, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import EmailCard from "../components/EmailCard";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getUserID } from "../helper/gmail";
import Play from "../assests/images/play.png";
import Pause from "../assests/images/pause.png";
import { useNavigate } from "react-router-dom";
function Home() {
  const [data, setData] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(1);
  // let audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentAudio > filterData.length) {
      setIsPlayingAll(false);
      setCurrentAudio(1);
    }
  }, [currentAudio, filterData]);

  // filter data
  useEffect(() => {
    if (textInput) {
      const filterData = data.filter((item) =>
        JSON.stringify(item).includes(textInput)
      );
      setFilterData(filterData);
    } else {
      setFilterData(data);
    }
  }, [data, textInput]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserID(localStorage.getItem("token"), setData, navigate);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const togglePlayPause = () => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
    } else {
      setIsPlayingAll(true);
    }
  };
  return (
    <Container
      maxW="full"
      h="100vh"
      display="flex"
      flexDir="column"
      px="10vw"
      py="6vh"
      backgroundColor="#E9EEFF"
      gap="20px"
    >
      <Header textInput={textInput} setTextInput={setTextInput} />
      <Flex flexDir="column" h="full" overflow="auto" gap="20px">
        {filterData.length ? (
          filterData?.map((item, index) => (
            <EmailCard
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
              isPlayingAll={isPlayingAll}
              setIsPlayingAll={setIsPlayingAll}
              payload={item}
              number={index + 1}
              key={index}
            />
          ))
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <Spinner color="#000000" />
          </Flex>
        )}
      </Flex>
      <Flex alignItems="center" gap="20px">
        <Text>Listen to all messages today: </Text>
        <Image
          src={isPlayingAll ? Pause : Play}
          onClick={() => togglePlayPause()}
        />
      </Flex>
    </Container>
  );
}

export default Home;
