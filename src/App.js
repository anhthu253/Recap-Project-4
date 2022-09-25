import logo from "./logo.svg";
import "./App.css";
import ColorCards from "./pages/colorcards/ColorCards";
import ColorGroups from "./pages/colorgroups/ColorGroups";

function App() {
  return (
    <div className="App">
      <header></header>
      <main>
        <ColorGroups />
      </main>
    </div>
  );
}

export default App;
