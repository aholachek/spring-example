import React from "react"
import { config } from "react-spring"
import styled from "styled-components"
import Slider from "@material-ui/core/Slider"
import Dismiss from "./DismissFullScreenDemo"
import InteractiveContainer from "./Video/InteractiveContainer"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const responsivePadding = `
  padding: 1rem;
  @media (min-width: 992px) {
    padding: 1rem 2rem 1rem 2rem;
  }
`
const InteractiveContainerPositioner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  @media (min-width: 992px) {
    margin-top: 0;
    min-width: 40%;
  }
`

const StyledRadioGroupContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: hsla(0, 0%, 0%, 0.2);
  ${responsivePadding};
  @media (min-width: 992px) {
    border-radius: 9px;
  }
  .MuiIconButton-label {
    color: #9a86fd;
  }
  .MuiFormControlLabel-label {
    margin-right: 1rem;
    font-size: 0.95rem !important;
    @media (min-width: 768px) {
      font-size: 1rem !important;
    }
  }
  .MuiFormGroup-root {
    flex-direction: row;
    width: 25rem;
    .MuiSvgIcon-root {
      font-size: 1rem;
    }
    .PrivateRadioButtonIcon-root-30 {
      color: #9a86fd;
    }
  }

  > div:first-of-type {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  }
`
const LabelFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  input[type="text"] {
    background-color: transparent;
    color: white;
    border: 0;
    font-size: 1rem;
    width: 3.5rem;
    padding: 0.2rem;
    font-weight: bold;
    border-bottom: 1px solid #9a86fd;
    &:focus {
      outline: none;
      border-bottom: 1px solid white;
      background-color: hsla(100, 100%, 109%, 0.1);
    }
  }
`
const PaddedContainer = styled.div`
  @media (min-width: 992px) {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  color: white;
  max-width: 1300px;
  width: 100%;
  margin: 2rem auto;
  -webkit-font-smoothing: antialiased;

  .MuiSlider-rail {
    opacity: 0.2;
  }
  .MuiSlider-root {
    color: rgb(154, 134, 253);
  }

  .MuiSlider-markLabel {
    color: hsla(250, 100%, 100%, 0.7);
  }

  .MuiSlider-markLabelActive {
    color: white !important;
  }

  .PrivateValueLabel-label-23 {
    color: #2a2734;
  }
`

const PanelContainer = styled.div`
  user-select: none !important;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .MuiSlider-root {
    margin-bottom: 2rem;
  }

  .MuiSlider-markLabel {
    font-size: .7rem !important;
    @media (min-width: 992px) {
      font-size: 1rem;
      display: block;
    }
  }

  > div {
    @media (min-width: 992px) {
      min-width: 25rem;
    }

    background: hsla(0, 0%, 0%, 0.2);
    ${responsivePadding};

    overflow: hidden;
    @media (min-width: 992px) {
      border-radius: 9px;
    }
    &:first-of-type {
      margin-bottom: 1rem;
    }
  }
  label {
    display: block;
    margin-bottom: 2.5rem;
    position: relative;
    font-size: 1rem;
    font-weight: bold;
  }
`

const convertVars = (dampingRatio, frequencyResponse) => {
  return {
    tension: Math.pow((2 * Math.PI) / frequencyResponse, 2),
    friction: (4 * Math.PI * dampingRatio) / frequencyResponse
  }
}

const LazyInput = ({ value, onChange, ...rest }) => {
  const [isInternal, setIsInternal] = React.useState(null)

  return (
    <input
      {...rest}
      onBlur={e => {
        setIsInternal(false)
      }}
      onKeyUp={e => {
        let num = parseFloat(e.target.value)
        if (Number.isNaN(num)) num = 0
        onChange(e, num)
      }}
      onFocus={e => {
        setIsInternal(true)
      }}
      value={isInternal ? null : value}
    />
  )
}

const ControlPanel = props => {
  const { tension, friction, update } = props

  const handleChange = name => (event, val) => {
    update({ tension, friction, [name]: val })
  }

  const handleChanges = ({ tension, friction }) => {
    update({ tension, friction })
  }

  const frequencyResponse = (2 * Math.PI) / Math.sqrt(tension)

  const dampingRatio = (friction * frequencyResponse) / (4 * Math.PI)

  const handleComputedValChange = name => (e, val) => {
    let newDampingRatio = dampingRatio
    let newFrequencyResponse = frequencyResponse

    if (name === "frequencyResponse") newFrequencyResponse = val
    else if (name === "dampingRatio") newDampingRatio = val

    const newVals = convertVars(newDampingRatio, newFrequencyResponse)
    update(newVals)
  }

  const selectedConfig =
    Object.keys(config).find(configName => {
      const c = config[configName]
      return c.tension === tension && c.friction === friction
    }) || false

  return (
    <PanelContainer>
      <div>
        <StyledRadioGroupContainer>
          <RadioGroup
            aria-label="config"
            name="config"
            value={selectedConfig}
            onChange={(event, val) => {
              const selectedConfig = config[val]
              handleChanges(selectedConfig)
            }}
          >
            {Object.keys(config).map(c => {
              if (c === "molasses") return null
              return (
                <FormControlLabel
                  value={c}
                  label={c}
                  control={<Radio color="orange" />}
                />
              )
            })}
          </RadioGroup>
        </StyledRadioGroupContainer>
        <Flex>
          <div>
            <div>
              <LabelFlex>
                <label title="aka tension">stiffness</label>
                <LazyInput
                  aria-label="stiffness"
                  type="text"
                  value={tension.toFixed(0)}
                  onChange={handleChange("tension")}
                />
              </LabelFlex>

              <Slider
                min={0.1}
                max={600}
                marks={[
                  { value: 100, label: "weak tension" },
                  { value: 300, label: "strong tension" }
                ]}
                name="tension"
                value={tension.toFixed(0)}
                onChange={handleChange("tension")}
                valueLabelDisplay="auto"
              />
            </div>
            <div>
              <LabelFlex>
                <label title="aka friction">damping</label>
                <LazyInput
                  aria-label="damping"
                  type="text"
                  value={friction.toFixed(0)}
                  onChange={handleChange("friction")}
                />
              </LabelFlex>
              <Slider
                min={0}
                max={260}
                name="friction"
                marks={[
                  { value: 10, label: "light friction" },
                  { value: 120, label: "significant friction" }
                ]}
                value={friction.toFixed(0)}
                onChange={handleChange("friction")}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          <div>
            <LabelFlex>
              <label>damping ratio</label>
              <LazyInput
                aria-label="damping ratio"
                type="text"
                value={parseFloat(dampingRatio.toFixed(2))}
                onChange={handleComputedValChange("dampingRatio")}
              />
            </LabelFlex>
            <Slider
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: "infinite" },
                { value: 0.5, label: "bouncy" },
                { value: 1, label: "no bounce" }
              ]}
              value={parseFloat(dampingRatio.toFixed(2))}
              onChange={handleComputedValChange("dampingRatio")}
              valueLabelDisplay="auto"
            />
            <LabelFlex>
              <label>frequency response</label>
              <LazyInput
                aria-label="frequency response"
                type="text"
                value={parseFloat(frequencyResponse.toFixed(2))}
                onChange={handleComputedValChange("frequencyResponse")}
              />
            </LabelFlex>
            <Slider
              min={0.01}
              max={3}
              step={0.1}
              value={parseFloat(frequencyResponse.toFixed(2))}
              onChange={handleComputedValChange("frequencyResponse")}
              valueLabelDisplay="auto"
              marks={[
                { value: 0, label: "fast" },
                { value: 1, label: "slow" },
                { value: 2.8, label: "very slow" }
              ]}
            />
          </div>
        </Flex>
      </div>
    </PanelContainer>
  )
}

const SpringExample = () => {
  const [config, setConfig] = React.useState({
    tension: 170,
    friction: 26
  })

  return (
    <PaddedContainer>
      <ControlPanel {...config} update={setConfig} />
      <InteractiveContainerPositioner>
        <InteractiveContainer>
          <Dismiss config={config} />
        </InteractiveContainer>
      </InteractiveContainerPositioner>
    </PaddedContainer>
  )
}

export default SpringExample
