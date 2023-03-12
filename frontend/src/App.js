import './App.css';
import { Routes, Route } from "react-router-dom";
import Chatpage from './Pages/Chatpage'
import HomePage from './Pages/HomePage'

function App() {
  return (
    <div className="App">
      {/* Hare Krishna */}
      <Routes>
        <Route path='/chats' element={<Chatpage></Chatpage>} />
        <Route path='/' element={<HomePage/>} exact/>
      </Routes>
      
    </div>
  );
}

export default App;
