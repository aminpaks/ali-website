export const storageGet = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key))[key];
  } catch {
    return fallback;
  }
};
export const storageSet = (key, value) => {
  localStorage.setItem(key, JSON.stringify({ [key]: value }));
  return value;
};

const USER_SESSION_ID = 'userSessionId';

export const getUserSessionId = () => storageGet(USER_SESSION_ID);
export const setUserSessionId = (id) => storageSet(USER_SESSION_ID, id);
