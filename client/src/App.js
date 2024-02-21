import { useEffect } from "react";
import './App.css';
const { ipcRenderer } = window;

function App() {
  useEffect(() => {
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
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <body>
          <h1>Hello World!</h1>
          We are using Node.js <span id="node-version"></span>,
          Chromium <span id="chrome-version"></span>,
          Electron <span id="electron-version"></span>,
          and Python <span id="py-version"></span>
        </body>
      </header>
    </div>
  );
}

export default App;
