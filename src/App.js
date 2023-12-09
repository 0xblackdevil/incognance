import "./App.css";
import { useState } from "react";
import PolygonIDVerifier from "./PolygonIDVerifier";
import VcGatedDapp from "./VcGatedDapp";
import { Center, Card, Image, CardBody, Container } from "@chakra-ui/react";

function App() {
  // if you're developing and just want to see the dapp without going through the Polygon ID flow,
  // temporarily set this to "true" to ignore the Polygon ID check and go straight to the dapp page
  const [provedAccessBirthday, setProvedAccessBirthday] = useState(false);
  return (
    <>
      {provedAccessBirthday ? (
        <VcGatedDapp />
      ) : (

        <Center className="vc-check-page">
          <div className="drop-shadow-lg"> 
          <Container>
            <Card
              style={{
                border: "2px solid #4338ca",
              }}
            >
             
              <CardBody style={{ paddingBottom: 0 }}>
                <p>
                  A governance protocol powered by <span className="text-indigo-700 font-bold">Polygon ID</span>.
                  It was created at EthIndia'23 by <span className="font-bold">@0xblackdevil</span> and <span className="font-bold">@ShivamDeshmukh</span>.
                </p>

                <PolygonIDVerifier
                  publicServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                  }
                  localServerURL={
                    process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                  }
                  credentialType={"KYCAgeCredential"}
                  issuerOrHowToLink={
                    ""
                  }
                  onVerificationResult={setProvedAccessBirthday}
                />
                <image
                  src="./assests/home.svg"
                  alt="Polygon devs image"
                  borderRadius="lg"
                />
              </CardBody>

                <p
                  style={{
                    position: "absolute",
                    bottom: "-15px",
                    right: "0",
                    fontSize: "8px",
                  }}
                >
                  Spacial thanks to <span className="font-bold">Steph</span> for template 
                </p>
             
            </Card> 
          </Container>
            </div>
        </Center>
      )}
    </>
  );
}

export default App;
