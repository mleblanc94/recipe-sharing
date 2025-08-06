import decode from 'jwt-decode';

class AuthService {
    getProfile() {
        return decode(this.getToken());
    }

logginIn() {
    const token = this.getToken();
    // Check that the token isnt expired
    return token && !this.isTokenExpired(token) ? true : false;
}

isTokenExpired(token) {
    try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            return true;
        } else return false;
    } catch (err) {
        return false;
    }
}

getToken() {
    return localStorage.getItem('id_token');
}

login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
}

logout() {
    localStorage.removeItem('id_token');
    window.location.replace('/signin');
}
}

export default new AuthService();
