export const shuffleArray = (arr: unknown[]) => {
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array");
  }

  const array = [...arr];

  for (let i = array.length - 1; i > 0; i--) {
    
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
