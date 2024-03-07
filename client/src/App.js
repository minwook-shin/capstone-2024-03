import { useEffect, useState } from "react";
import './App.css';

const { ipcRenderer } = window;

function App() {
  const [taskItems, setTaskItems] = useState([]);

  const [flowItems, setFlowItems] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTaskItems([
      { id: 1, text: "Scroll" },
      { id: 2, text: "Click" },
    ]);
    ipcRenderer.send("versions");
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
    ipcRenderer.on("versions", (event, args) => {
      for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, args[type])
      }
    });

    ipcRenderer.send("py-version");
    ipcRenderer.on("py-version", (event, args) => {
      const element = document.getElementById('py-version');
      if (element) element.innerText = args.py;
    });

    setIsLoading(true);
      ipcRenderer.send("screen");
      ipcRenderer.on("screen", (event, args) => {
      const blob = new Blob([args.screen], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
      setIsLoading(false);
      });
  }, []);

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDrop = (event) => {
    const item = JSON.parse(event.dataTransfer.getData("text/plain"));
    setFlowItems([...flowItems, item]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    console.log(JSON.stringify(flowItems));
  };

  const handleButtonClear = () => {
    setFlowItems([]);
  };

  const handleButtonReload = () => {
    ipcRenderer.send("screen");
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <body>
          <h1>Hello World!</h1>
          We are using Node.js <span id="node-version"></span>,
          Chromium <span id="chrome-version"></span>,
          Electron <span id="electron-version"></span>,
          and Python <span id="py-version"></span>
          <div className="task">
            <h2>Tasks</h2>
            <ul>
              {taskItems.map(item => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, item)}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="flow"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <h2>Flow</h2>
            <ol>
              {flowItems.map(item => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ol>
          </div>
          <div style={{ display: "flex"}}>
            <div style={{ flex: 1 }}>
              <button onClick={handleButtonClick}>Print JSON</button>
              <button onClick={handleButtonClear}>Clear JSON</button>
            </div>
            <div style={{ flex: 1, marginLeft: "20px" }}>
              <button onClick={handleButtonReload}>refresh Screen</button>
              <div style={{ maxWidth: "100%", maxHeight: "100%", overflow: "auto" }}>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <p>{imageSrc && <img id="uploaded-image" src={imageSrc} alt="Uploaded" style={{ maxWidth: "25%", maxHeight: "25%", objectFit: "contain" }} />}</p>
                )}
              </div>
            </div>
          </div>
        </body>
      </header>
    </div>
  );
}

export default App;
