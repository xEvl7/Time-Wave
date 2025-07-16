import React, { useState } from "react";
import { Switch, useTheme } from "react-native-paper";

type ToggleSwitchProps = {
  defaultOn?: boolean;
  onToggle?: (value: boolean) => void;
};

const ToggleSwitch = ({ defaultOn = false, onToggle }: ToggleSwitchProps) => {
  const [value, setValue] = useState(defaultOn);
  const { colors } = useTheme();
  const chevronColor = "#FF8D13";

  const handleToggle = () => {
    const newValue = !value;
    setValue(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <Switch
      value={value}
      onValueChange={handleToggle}
      color={chevronColor} // active track + thumb color
      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }} // optional: slightly smaller
    />
  );
};

export default ToggleSwitch;
