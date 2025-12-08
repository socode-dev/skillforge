export const shuffleArray = (arr: any[]) => {
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array");
  }

  let array = [...arr];

  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random number from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
