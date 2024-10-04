import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import AddMantos from './screens/AddMantos';
import Home from './screens/Home';
import AddComponents from './screens/AddComponents';
import EditComponents from './screens/EditComponents';

function App({setPrimaryColor}) {
  return (
    <Router>
      <Routes>
        <Route index element={<Login setPrimaryColor ={setPrimaryColor}/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/add' element={<AddMantos />} />
        <Route path='/addc/:key' element={<AddComponents />} />
        <Route path='/editc/:key' element={<EditComponents />} />
      </Routes>
    </Router>
  );
}

export default App;