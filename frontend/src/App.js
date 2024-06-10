import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from './pages/Home';
import AddHeader from './pages/AddHeader';

function App() {
  return (
    <div className="App">
      <Router>
        <div className='navigasi bg-primary'>
          <Link to='/' className='mx-5'>Homepage</Link>
          <Link to='/addheader'>Add a Header</Link>
        </div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addheader' element={<AddHeader />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
