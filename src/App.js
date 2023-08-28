import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Home } from './pages/Home/Home';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import { ScoreBoard } from './pages/ScoreBoard/ScoreBoard';
import { About } from './pages/About/About';
import "primereact/resources/themes/lara-light-indigo/theme.css";                                            
        
function App() {
  return (
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='score-board/' element={<ScoreBoard />} />
          <Route path='about/' element={<About />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
