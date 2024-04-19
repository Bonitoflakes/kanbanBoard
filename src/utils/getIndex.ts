import invariant from "tiny-invariant";

// function reorder<T extends { id: number | string }>({
//   list,
//   origin,
//   destination,
//   devTools = false,
// }: {
//   list: T[];
//   origin: T extends { id: number } ? number : string;
//   destination: T extends { id: number } ? number : string;
//   devTools: boolean;
// }): T[] {
//   if (origin === destination) return list;

//   const originIndex = getIndex(list, origin);
//   const destinationIndex = getIndex(list, destination);

//   // remove the element from list and then add the element in the new position.
//   const newList = list
//     .toSpliced(originIndex, 1)
//     .toSpliced(destinationIndex, 0, list[originIndex]);

//   devTools && console.table(list);
//   devTools && console.table(newList);
//   devTools && console.table(newList === list);
//   return newList;
// }

// export default reorder;

export function getIndex<T extends { id: number | string }>(
  list: T[],
  id: string | number
) {
  const index =
    typeof id === "string"
      ? list.findIndex((l) => l.id === id)
      : (id as number);

  invariant(index !== -1, "id not found in the list provided.");

  return index;
}

