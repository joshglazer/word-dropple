import words from "an-array-of-english-words";

function getRandomLetter(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet.charAt(randomIndex);
}

function generateBoard(): Board {
  const maxColumns = 5;
  const maxRows = 5;

  let board: Board = { columns: [] };

  for (let columnIndex = 0; columnIndex < maxColumns; columnIndex++) {
    const boardColumn: BoardColumn = { letters: [] };
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      const boardLetter: BoardLetter = {
        letter: getRandomLetter(),
        isSelected: false,
        columnIndex,
        rowIndex,
      };
      boardColumn.letters.push(boardLetter);
    }
    board.columns.push(boardColumn);
  }

  return board;
}

function resetBoardSelection(board: Board): Board {
  const newBoard = structuredClone(board);
  newBoard.columns.map(({ letters }) =>
    letters.map((letter) => (letter.isSelected = false))
  );
  return newBoard;
}

function checkWordValid(word: string): boolean {
  if (word.length < 3) {
    return false;
  }

  return words.indexOf(word.toLowerCase()) >= 0;
}

export { getRandomLetter, generateBoard, resetBoardSelection, checkWordValid };
