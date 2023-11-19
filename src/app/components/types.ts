interface Board {
  columns: BoardColumn[];
}

interface BoardColumn {
  letters: BoardLetter[];
}

interface BoardLetter {
  letter: string;
  isSelected: boolean;
  columnIndex: number;
  rowIndex: number;
}
