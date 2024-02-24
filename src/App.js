import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import AddMantos from './screens/AddMantos';
import Home from './screens/Home';
import Edit from './screens/Edit';
import AddComponents from './screens/AddComponents';
import EditComponents from './screens/EditComponents';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Login/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/add' element={<AddMantos />} />
        <Route path='/addc/:key' element={<AddComponents />} />
        <Route path='/edit/:id' element={<Edit />} />
        <Route path='/editc/:key' element={<EditComponents />} />
      </Routes>
    </Router>
  );
}

export default App;