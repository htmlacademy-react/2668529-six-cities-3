const TOKEN_KEY = 'six-cities-token';

const getToken = (): string => localStorage.getItem(TOKEN_KEY) ?? '';
const saveToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
const dropToken = (): void => localStorage.removeItem(TOKEN_KEY);

export {getToken, saveToken, dropToken};
