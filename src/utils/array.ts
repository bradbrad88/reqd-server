export function moveArrayItem(arr: Array<any>, oldIndex: number, newIndex: number) {
  const newArr = [...arr];
  const item = newArr.splice(oldIndex, 1)[0];
  newArr.splice(newIndex, 0, item);
  return newArr;
}

export function createArrayOfLength(length: number) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
}
