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

interface IObj<T> {
  [key: string]: T;
  [key: number]: T;
}

interface ITableItem {
  row: string;
  column: string;
  value: number;
}

interface IColumnItem {
  column: string;
  value: number;
}

export class TableData {
  private constructor(public readonly obj: IObj<IObj<number>>) {}

  static nestedObject(obj: IObj<IObj<number>>) {
    return new TableData(obj);
  }

  static itemList(obj: ITableItem[]): TableData {
    const rows = unique(obj.map((item) => item.row));
    const table = {} as IObj<IObj<number>>;
    rows.forEach((row) => {
      table[row] = {};
    });
    obj.forEach((item) => {
      table[item.row][item.column] = item.value;
    });
    return new TableData(table);
  }

  static columnList(obj: IColumnItem[]): TableData {
    const table = {} as IObj<IObj<number>>;
    obj.forEach((item, index) => {
      table[index] = {};
    });
    obj.forEach((item, index) => {
      table[index][item.column] = item.value;
    });
    return new TableData(table);
  }

  static getAllRows(obj: IObj<IObj<number>>): string[] {
    return Object.keys(obj);
  }

  getAllRows(): string[] {
    return TableData.getAllRows(this.obj);
  }

  static getAllColumns(obj: IObj<IObj<number>>): string[] {
    const columnsSet = new Set<string>();
    Object.keys(obj).forEach((key1) =>
      Object.keys(obj[key1]).forEach((key2) => {
        columnsSet.add(key2);
      })
    );
    return Array.from(columnsSet);
  }

  getAllColumns(): string[] {
    return TableData.getAllColumns(this.obj);
  }
}
