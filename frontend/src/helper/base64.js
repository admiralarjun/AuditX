export const encodeBase64 = (input) => {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    return btoa(input);
  };
  

export const decodeBase64 = (input) => {
if (typeof input !== 'string') {
    throw new Error('Input must be a string');
}
return atob(input);
};
