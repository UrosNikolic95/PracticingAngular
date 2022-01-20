export interface ITypedObject<T> {
  [key: string]: T;
}

export type IDoubleTypedObject<T> = ITypedObject<ITypedObject<T>>;

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function getAllColumns(obj: IDoubleTypedObject<number>): string[] {
  const columnsSet = new Set<string>();
  Object.keys(obj).forEach((row) =>
    Object.keys(obj[row]).forEach((column) => columnsSet.add(column))
  );
  return Array.from(columnsSet);
}

export function CreateTableV1(obj: IDoubleTypedObject<number>) {
  const rows = Object.keys(obj);
  const columns = getAllColumns(obj);
  const table = CreateEmtyTable(rows.length, columns.length);
  rows.forEach((row, index1) => {
    columns.forEach((column, index2) => {
      if (obj[row][column]) {
        table[index1][index2] = obj[row][column];
      }
    });
  });

  return table;
}

export function CreateTableV2(obj: IDoubleTypedObject<number>) {
  const rows = Object.keys(obj);
  const columns = getAllColumns(obj);
  const table = CreateEmtyTable(rows.length, columns.length);
  rows.forEach((row, index1) => {
    columns.forEach((column, index2) => {
      if (obj[row][column]) {
        table[index1][index2] = obj[row][column];
      }
    });
  });

  return table;
}

export function Invert(arr: string[]): ITypedObject<number> {
  return arr.reduce((reduced, item, index) => {
    reduced[item] = index;
    return reduced;
  }, {} as ITypedObject<number>);
}

export async function IterateTroughDoubleObject<T>(
  obj: IDoubleTypedObject<T>,
  func: (val: T, row: string, column: string) => Promise<void> | void
): Promise<void> {
  for (const key1 in obj) {
    for (const key2 in obj[key1]) {
      await func(obj[key1][key2], key1, key2);
    }
  }
}

export async function IterateTroughTable<T>(
  obj: T[][],
  func: (value: T, row: number, column: number) => Promise<void> | void
): Promise<void> {
  for (let index1 = 0; index1 < obj.length; index1++) {
    for (let index2 = 0; index2 < obj[index1].length; index2++) {
      await func(obj[index1][index2], index1, index2);
    }
  }
}

export function CreateEmtyTable(rows: number, columns: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 0)
  );
}
