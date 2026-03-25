const API = import.meta.env.VITE_API_URL;
export const validateToken = async () => {
    try {
      // No need to manually get the token from cookies, it's automatically sent with credentials: 'include'
      // const response = await fetch('http://localhost:5000/auth/validateToken', {
      const response = await fetch(`${API}/auth/validateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // This ensures cookies are sent along with the request
      });
  
      if (!response.ok) {
        console.error('[ERROR] Invalid or expired token');
        throw new Error('Invalid token');
        
      }
  
      const data = await response.json();
      console.log('[INFO] Token validated successfully', data);
      return data.user;  // Assuming the API returns a `user` object
    } catch (error) {
      console.error('[ERROR] Token validation failed:', error);
      return null;
    }
  };
  