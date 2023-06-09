import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Login from './components/login/Login';
import { AuthProvider } from './components/auth/AuthContext';
import SignUpPage from './components/signup/SignUpPage';
import ShoppingList from './components/shopping-list/ShoppingList';
import CreateItem from './components/shopping-list/create/CreateItem';
import Cart from './components/shopping-list/read/Cart';
import UpdateItem from './components/shopping-list/update/UpdateItem';
import DisableItem from './components/shopping-list/disable/DisableItem';
import { UserProvider } from './components/auth/UserContext';
import { CartProvider } from './components/auth/CartContext';

function App() {
  return (
    <div className='app'>
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home/profile/shopping-list" element={<ShoppingList />} />
              <Route path="/home/profile/shopping-list/create" element={<CreateItem />} />
              <Route path="/home/profile/shopping-list/cart" element={<Cart />} />
              <Route path="/home/profile/shopping-list/update" element={<UpdateItem />} />
              <Route path="/home/profile/shopping-list/disable" element={<DisableItem />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
    </div>
  );
}

export default App;
