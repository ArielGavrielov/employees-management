import './App.css';
import Employees from './Employees/Employees';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Employees management</h1>
        </header>
        <div className="App-body">
        <Routes>
          <Route exact path="/" element={<Employees />} />
          <Route path='*' exact element={<NotFound />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

const NotFound = () => {
  return (
    <h3>404 - Page not found</h3>
  );
}
export default App;
