import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import AddMantos from './screens/AddMantos';
import Home from './screens/Home';

// import Home from './pages/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/add' element={<AddMantos/>} />
      </Routes>
    </Router>
  );
}

export default App;