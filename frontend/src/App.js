import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#000000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid transparent',
          borderTop: '4px solid #FF0050',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
