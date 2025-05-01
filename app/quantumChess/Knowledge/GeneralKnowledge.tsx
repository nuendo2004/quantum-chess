import { useState } from "react";
import Superposition from "./Superposition";
import Entanglement from "./Entanglement";

const GeneralKnowledge = () => {
  const [curretConponent, setCurrentComponent] = useState(
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-bold">What Is Quantum Chess?</h2>
      <p className="text-lg">
        Imagine if your chess pieces could be in two places at once. Sounds like
        cheating, right? Nope — that’s *quantum*.
      </p>
      <p className="text-lg">
        Quantum mechanics is the science of tiny things doing really weird
        stuff. Like particles that can exist in multiple spots at the same time
        (*superposition*), or instantly affect each other from across the board
        (*entanglement*).
      </p>
      <p className="text-lg">
        Quantum Chess takes classic chess and supercharges it with these
        mind-bending rules. You won’t always know what’s real until you make a
        move — just like a Schrödinger’s Knight!
      </p>
      <p className="text-lg font-semibold text-purple-300">
        It’s part strategy, part chaos, and 100% brain-bending fun.
      </p>

      <div
        onClick={() => setCurrentComponent(<Superposition />)}
        className="underline cursor-pointer"
      >
        How do I make a Superposition Move
      </div>
      <div
        onClick={() => setCurrentComponent(<Entanglement />)}
        className="underline cursor-pointer"
      >
        How do I make a Entanglement Move
      </div>
    </div>
  );
  return curretConponent;
};

export default GeneralKnowledge;
