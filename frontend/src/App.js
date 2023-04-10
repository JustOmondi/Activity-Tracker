import './App.css';
import Header from './components/Header';
import SubgroupsPage from './pages/SubgroupsPage';
import MembersPage from './pages/MembersPage';

export const BASE_API_URL = 'http://127.0.0.1:8000/api'

function App() {
  return (
    <div className="App">
      <Header />
      <SubgroupsPage />
      <MembersPage />
      My App
    </div>
  );
}

export default App;
