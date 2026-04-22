import React from "react";
import AddButton from "./AddButton";
import colors from "../assets/colors.json";
import Colour from "./Colour"; // ✅ FIXED

const Controls = () => {
  return (
    <div id="controls">
      <AddButton />
      {colors.map((color) => (
        <Colour key={color.id} color={color} />
      ))}
    </div>
  );
};

export default Controls;
