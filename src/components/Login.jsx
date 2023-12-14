// LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, email });
      const token = response.data.token;

      // Store the token in sessionStorage or a more secure storage method
      sessionStorage.setItem('token', token);

      // Redirect to the data route after successful login
      navigate('/data');
      console.log("Login successful")
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
