import { useState, type SyntheticEvent } from 'react';
import './BasicModel.css';

const BasicModel = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOutput(`Basic model response for "${input}"`);
  };

  return (
    <div className="basic-model-wrapper">
      <h2>Basic Model</h2>
      <p>This is a placeholder for your basic model UI and UX.</p>
      <form onSubmit={handleGenerate} className="basic-model-form">
        <input
          type="text"
          placeholder="Type a simple prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim()}>
          Generate
        </button>
      </form>
      {output && <div className="basic-model-output">{output}</div>}
    </div>
  );
};

export default BasicModel;
