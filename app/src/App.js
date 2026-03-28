import Header from "./components/Header";
import Footer from "./components/Footer";
import Students from "./components/Students";
import './App.css';

function App() {

  return (
    <div className="App">
      <div className="App-Inner">
        <Header />

        <div className="App-Body">
          <Students />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
