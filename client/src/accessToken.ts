let accessToken = "";

export const setAccessToken = (aT: string) => {
  accessToken = aT;  
}

export const getAccessToken = () => {
  return accessToken;
}