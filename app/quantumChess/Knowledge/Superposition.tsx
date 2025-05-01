import React from "react";
const Superposition = () => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold">What’s Superposition?</h2>
      <p className="text-lg">
        Superposition is like a quantum piece being a ghost. It&apos;s not fixed
        to one spot—it can exist on{" "}
        <span className="italic">multiple squares at once</span> until someone
        tries to interact with it or &apos;measure&apos; it.
      </p>
      <p className="text-lg">
        In Quantum Chess, when you put a piece into superposition, it will split
        to two pieces . You can move both pieces, if an opponent attempts a
        capture on one of its potential squares, you perform a &apos;quantum
        measurement&apos;—it randomly collapses onto{" "}
        <span className="italic">just one</span> of those squares based on
        probabilities.
      </p>
      <p className="text-lg">
        But beware! This probabilistic nature means you can&apos;t be sure{" "}
        <span className="italic">where</span> it will end up. It might land
        perfectly for your attack... or collapse right where your opponent can
        take it. High risk, high reward!
      </p>
    </div>
  );
};

export default Superposition;
