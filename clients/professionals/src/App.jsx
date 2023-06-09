import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Login from './components/login/Login';
import { AuthProvider } from './components/auth/AuthContext';
import SignUpPage from './components/signup/SignUpPage';
import Professionals from './components/professionals/Professionals';
import SearchResultProf from './components/professionals/results/SearchResultProf';
import { UserProvider } from './components/auth/UserContext';
import { ClientHouseProvider } from './components/auth/ClientHouseContext';

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <UserProvider>
          <ClientHouseProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home/profile/prof/search" element={<Professionals />} />
                <Route path="/home/profile/prof/search/result" element={<SearchResultProf />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </ClientHouseProvider>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
