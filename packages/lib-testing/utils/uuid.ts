export const createUnsafeUuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // Generates a random integer from 0 to 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // Ensures the '4' and 'a/b/8/9' bits for 'x' and 'y'
    return v.toString(16);
  });
};
