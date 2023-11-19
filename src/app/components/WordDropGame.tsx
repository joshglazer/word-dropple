"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useCallback, useMemo, useState } from "react";
import {
  checkWordValid,
  generateBoard,
  getRandomLetter,
  resetBoardSelection,
} from "./helpers";

const newBoard = generateBoard();

export default function WordDropGame() {
  const [board, setBoard] = useState<Board>(newBoard);
  const [selectedLetters, setSelectedLetters] = useState<BoardLetter[]>([]);

  function handleClick(boardLetter: BoardLetter) {
    const { columnIndex, rowIndex } = boardLetter;

    if (boardLetter.isSelected) {
      const newSelectedLetters = [];
      for (const selectedLetter of selectedLetters) {
        if (
          selectedLetter.rowIndex !== boardLetter.rowIndex ||
          selectedLetter.columnIndex !== boardLetter.columnIndex
        ) {
          newSelectedLetters.push(selectedLetter);
        } else {
          break;
        }
      }

      setSelectedLetters(newSelectedLetters);

      const newBoard = resetBoardSelection(board);

      newSelectedLetters.forEach(({ columnIndex, rowIndex }) => {
        newBoard.columns[columnIndex].letters[rowIndex].isSelected = true;
      });

      setBoard(newBoard);
      return;
    }

    let canSelectLetter = false;

    // check if a new word is being started
    if (!selectedLetters.length) {
      canSelectLetter = true;
    }

    // check if adjacent
    if (!canSelectLetter) {
      const lastLetter = selectedLetters[selectedLetters.length - 1];
      if (
        lastLetter.columnIndex - 1 <= columnIndex &&
        lastLetter.columnIndex + 1 >= columnIndex &&
        lastLetter.rowIndex - 1 <= rowIndex &&
        lastLetter.rowIndex + 1 >= rowIndex
      ) {
        canSelectLetter = true;
      }
    }

    if (canSelectLetter) {
      const updatedBoard = structuredClone(board);
      const currentLetter = updatedBoard.columns[columnIndex].letters[rowIndex];
      currentLetter.isSelected = !currentLetter.isSelected;
      const newSelectedLetters = [...selectedLetters, currentLetter];
      setBoard(updatedBoard);
      setSelectedLetters(newSelectedLetters);
    }
  }

  const selectedLettersDisplay: string = useMemo(
    () => selectedLetters.map((letter) => letter.letter).join(""),
    [selectedLetters]
  );

  const submitGuess = useCallback(() => {
    const isWordValid = checkWordValid(selectedLettersDisplay);
    if (isWordValid) {
      const newBoard = resetBoardSelection(board);

      selectedLetters.forEach(({ columnIndex, rowIndex }) => {
        newBoard.columns[columnIndex].letters.splice(rowIndex, 1);
      });

      newBoard.columns.map((column, columnIndex) => {
        while (column.letters.length < 5) {
          column.letters.unshift({
            letter: getRandomLetter(),
            isSelected: false,
            columnIndex: columnIndex,
            rowIndex: 0,
          });
        }
        return column;
      });

      newBoard.columns.map((column) =>
        column.letters.map((letter, rowIndex) => (letter.rowIndex = rowIndex))
      );

      setBoard(newBoard);
      setSelectedLetters([]);
    } else {
      const newBoard = resetBoardSelection(board);
      setBoard(newBoard);
      setSelectedLetters([]);
    }
  }, [selectedLettersDisplay, board, selectedLetters]);

  return (
    <Paper sx={{ margin: "0 auto", width: "auto" }}>
      <Stack direction="row">
        {board?.columns.map((column, index) => (
          <Stack key={index} direction="column">
            {column.letters.map((boardLetter) => {
              const { rowIndex, isSelected, letter } = boardLetter;
              return (
                <Box
                  key={rowIndex}
                  bgcolor={isSelected ? "primary.main" : undefined}
                  onClick={() => handleClick(boardLetter)}
                  sx={{ padding: 2 }}
                >
                  {letter}
                </Box>
              );
            })}
            <br />
          </Stack>
        ))}
      </Stack>
      {!!selectedLetters.length && <div>Word: {selectedLettersDisplay}</div>}
      <Button color="primary" onClick={submitGuess}>
        Guess
      </Button>
    </Paper>
  );
}
