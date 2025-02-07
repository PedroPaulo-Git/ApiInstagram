import React from "react";
import Congratulations from "../app/assets/congratulations.png";
const Congratulations = () => {
  return (
    <div className="max-w-[450px] w-full mx-auto">
      <div className="flex flex-col text-white">
        <Image
          src={Congratulations}
          width={100}
          height={100}
          className="w-80 object-contain"
        />
      </div>
    </div>
  );
};

export default Congratulations;
