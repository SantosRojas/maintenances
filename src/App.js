import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import AddMantos from './screens/AddMantos';
import Home from './screens/Home';
import Edit from './screens/Edit';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/add' element={<AddMantos/>} />
        <Route path='/edit/:id' element={<Edit />} />
      </Routes>
    </Router>
  );
}

export default App;