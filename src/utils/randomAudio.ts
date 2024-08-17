import audiosData from "./audiosData";

export default (type: string) => {
  const { sounds } = audiosData.find((data) => data.type === type)!;
  const index = Math.floor(Math.random() * sounds.length);
  return sounds[index];
};
