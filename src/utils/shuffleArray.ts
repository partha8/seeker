// Fisher-Yates (aka Knuth) Shuffle.
export const shuffleArray = (arr: any) => {
  let currentIndex = arr.length,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // swap
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
};
