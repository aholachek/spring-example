import React from "react";
import styled from "styled-components";
import FlippableAnimatedDiv from "../FlippableAnimatedDiv";
const Box = styled.div`
  height: 2rem;
  width: 2rem;
  background-color: fuchsia;
`;

const AnotherBox = styled.div`
  height: 5rem;
  width: 5rem;
  background-color: teal;
`;

const Container = styled.div`
  height: 100vh;
  width: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function SimpleFlipExample() {
  const [big, setBig] = React.useState(false);

  return (
    <Container>
      {big ? (
        <Box
          as={FlippableAnimatedDiv}
          flipId="big"
          onClick={() => setBig(!big)}
          big={big}
        />
      ) : (
        <AnotherBox
          as={FlippableAnimatedDiv}
          flipId="big"
          onClick={() => setBig(!big)}
          big={big}
        />
      )}
    </Container>
  );
}

export default SimpleFlipExample;
