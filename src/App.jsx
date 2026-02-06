import { Routes, Route } from 'react-router-dom';
import Component from './Component';
import LoginPage from './components/LoginPage';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Component />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}
