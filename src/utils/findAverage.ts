export default (arr: number[], currentValue = 0) =>
  arr.reduce((acc, val) => acc + val, currentValue) / arr.length;
