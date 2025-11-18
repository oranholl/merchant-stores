import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Stores } from './pages/Stores';
import { Products } from './pages/Products';
import { Analytics } from './pages/Analytics';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav style={{ 
        backgroundColor: '#343a40', 
        padding: '15px 20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/stores" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
          🏪 Merchant Stores
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/stores" style={{ color: 'white', textDecoration: 'none' }}>
            Stores
          </Link>
          <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>
            📊 Analytics
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:storeId/products" element={<Products />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Navigate to="/stores" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
