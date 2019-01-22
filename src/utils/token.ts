export default (token: string) => {
    if (typeof token === 'string' && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
        try {
            return JSON.parse(window.atob(token.split('.')[1].replace('-', '+').replace('_', '/')));
        } catch (e) {
            return 'Invalid JWT Token';
        }
    } else {
        return 'Invalid JWT Token';
    }
};
