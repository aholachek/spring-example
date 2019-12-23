import React from "react";
import styled from "styled-components";
import FlippableAnimatedDiv from "../FlippableAnimatedDiv";
const Box = styled.div`
  height: ${props => (props.big ? "5rem" : "2rem")};
  width: ${props => (props.big ? "5rem" : "2rem")};
  background-color: fuchsia;
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
      <Box
        as={FlippableAnimatedDiv}
        flipKey={big}
        onClick={() => setBig(!big)}
        big={big}
      />
    </Container>
  );
}

export default SimpleFlipExample;
