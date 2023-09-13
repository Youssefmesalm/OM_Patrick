import { Navigate } from 'react-router-dom';
// @mui

// ----------------------------------------------------------------------


export const fetchToken = (token) => {
  return localStorage.getItem('token');
}
export const setToken = (token) => {
  localStorage.setItem('token', token);
}
export default function RequireToken({ children }) {
  let auth = fetchToken();
if(!auth)
  return  <Navigate to="/login"   />
  else
  return children;
}
