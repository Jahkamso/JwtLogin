// DataFetchingComponent.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Data = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');

        if(token){
            console.log("Token is: ", token)
        } else {
            console.log("Token not found")
        }

        if (!token) {
            // No token found, redirect to login
            window.location.href = '/login';
            return;
          }

        if (token) {
          const response = await axios.get('http://localhost:5000/api/data', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("API Data ", response.data.data)
          setUserData(response.data.data);
        } else {
          console.error('Token not found');
        }
      } catch (error) {
        console.error('Error fetching data', error);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run this effect once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Here's your Information, {userData.name} 👇🏻</h2>
      {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
      <h4>Name: {userData.name}</h4>
      <h4>Username: {userData.username}</h4>
      <h4>Email: {userData.email}</h4>
      <h4>Website: {userData.website}</h4>
      <ul>
        <h3>Address</h3>
      {Object.entries(userData.address).map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
        </li>
      ))}
      <h3>Company</h3>
      {Object.entries(userData.company).map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
        </li>
      ))}
    </ul>
      {/* <h3>Address</h3>
      <h4>City: {userData.address.city}</h4> */}
    </div>
  );
};

export default Data;
