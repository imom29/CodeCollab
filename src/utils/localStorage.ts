const USERNAME_KEY = "username";

export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_KEY);
};

export const setUsername = (name: string): void => {
  localStorage.setItem(USERNAME_KEY, name);
};

export const clearUsername = (): void => {
  localStorage.removeItem(USERNAME_KEY);
};
