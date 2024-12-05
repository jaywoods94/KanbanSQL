import { JwtPayload, jwtDecode } from 'jwt-decode';

interface AuthToken extends JwtPayload {
  username: string;
  exp: number;
}

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<AuthToken>(token);
    } catch (error) {
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    // Return false if there is no token
    if (!token) return false;
    // Return true if token exists and is not expired
    return !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<AuthToken>(token);
      // Check if the token has expired
      // exp is in seconds, Date.now() is in milliseconds
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      // If there's an error decoding the token, consider it expired
      return true;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    // Save token to localStorage
    localStorage.setItem('id_token', idToken);
    // Redirect to home page
    window.location.assign('/');
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    // Redirect to login page
    window.location.assign('/login');
  }
}

export default new AuthService();
