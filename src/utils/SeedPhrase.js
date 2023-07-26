export const SeedPhrase = {

  shuffle: (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  },

  getChooseIndecies: (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
  },

  generateSeed: () => {
    return [
      'ridge',
      'during',
      'describe',
      'idle',
      'dynamic',
      'minor',
      'discover',
      'obtain',
      'taxi',
      'banana',
      'high',
      'universe'
    ];
  }
}