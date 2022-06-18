export let accessToken = "";
export const setToken = (newAccessToken: string) => (accessToken = newAccessToken);
export const getToken = () => accessToken;
