import { useState } from 'react';
// import { CustomStory } from './components/QueryFields/QInputPair/CustomStory';
import { QInputPair } from './components/QueryFields/QInputPair/QInputPair';

const formatDisplayValues = (min: any, max: any) => `${min} - ${max}`;
const customSubfields = {
  min: { id: 'low', label: 'Low', intialValue: 1 },
  max: { id: 'high', label: 'Hi', intialValue: 3 },
};

export const Sandbox = () => {
  const [callStack, setCallStack] = useState([] as any[]);

  const handleChange = (...args: any) => {
    /// const x = callStack.concat(['1']);
    setCallStack(callStack.concat([args]));
  };

  return (
    <>
      <QInputPair
        // presetOption="minmax"
        // subfields={customSubfields}
        // formatDisplayValues={formatDisplayValues}
        id="pairSandbox"
        onChange={handleChange}
      />
      {/* <QInputPair presetOption="minmax" onChange={handleChange} id="Sandbox" /> */}
      <ul>
        {callStack.map((call, idx) => (
          <li key={idx}>{JSON.stringify(call)}</li>
        ))}
      </ul>
    </>
  );
};
