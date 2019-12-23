import React from "react";
import { storiesOf } from "@storybook/react";
import TwoBecomeOne from "../2BecomeOneDemo";
import SimpleFlipDemo from "../SimpleFlipDemo";
import DismissFullScreenDemo from "../DismissFullScreenDemo";

storiesOf("FLIP", module)
  .add("simplest example", () => <SimpleFlipDemo />)
  .add("FLIP with two different components", () => <TwoBecomeOne />)
  .add("with custom springs (same spring used for drag + flip)", () => (
    <DismissFullScreenDemo />
  ));
