import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Window from '../components/Window';

const baseSolvedGrid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
];

function shuffle(array) {
  return array
    .map((value) => ({ value, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}

function createSolvedGrid() {
  const digitMap = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const rowOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const colOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);

  return rowOrder.map((row) => colOrder.map((col) => digitMap[baseSolvedGrid[row][col] - 1]));
}

function createPuzzle(solution) {
  const puzzle = solution.map((row) => row.slice());
  const cells = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]);
  const blanks = 42 + Math.floor(Math.random() * 6);

  for (let index = 0; index < blanks; index += 1) {
    const position = cells[index];
    const row = Math.floor(position / 9);
    const col = position % 9;
    puzzle[row][col] = 0;
  }

  return puzzle;
}

function createNewGame() {
  const solution = createSolvedGrid();
  return { solution, puzzle: createPuzzle(solution) };
}

function findConflicts(grid) {
  const conflicts = new Set();

  for (let row = 0; row < 9; row += 1) {
    const seen = new Map();
    for (let col = 0; col < 9; col += 1) {
      const value = grid[row][col];
      if (!value) continue;
      if (seen.has(value)) {
        const firstCol = seen.get(value);
        conflicts.add(`${row}-${col}`);
        conflicts.add(`${row}-${firstCol}`);
      } else {
        seen.set(value, col);
      }
    }
  }

  for (let col = 0; col < 9; col += 1) {
    const seen = new Map();
    for (let row = 0; row < 9; row += 1) {
      const value = grid[row][col];
      if (!value) continue;
      if (seen.has(value)) {
        const firstRow = seen.get(value);
        conflicts.add(`${row}-${col}`);
        conflicts.add(`${firstRow}-${col}`);
      } else {
        seen.set(value, row);
      }
    }
  }

  for (let boxRow = 0; boxRow < 3; boxRow += 1) {
    for (let boxCol = 0; boxCol < 3; boxCol += 1) {
      const seen = new Map();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row += 1) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col += 1) {
          const value = grid[row][col];
          if (!value) continue;
          if (seen.has(value)) {
            const previous = seen.get(value);
            conflicts.add(`${row}-${col}`);
            conflicts.add(`${previous.row}-${previous.col}`);
          } else {
            seen.set(value, { row, col });
          }
        }
      }
    }
  }

  return conflicts;
}

export default function Sudoku({ onClose, darkMode }) {
  const initialGame = useMemo(() => createNewGame(), []);
  const [solutionGrid, setSolutionGrid] = useState(initialGame.solution);
  const [grid, setGrid] = useState(initialGame.puzzle);
  const [selected, setSelected] = useState([0, 0]);
  const [hasWon, setHasWon] = useState(false);
  const [message, setMessage] = useState('Continue preenchendo as casas vazias.');

  const conflictCells = useMemo(() => findConflicts(grid), [grid]);

  const solved = useMemo(
    () => grid.every((row, rowIndex) => row.every((value, colIndex) => value === solutionGrid[rowIndex][colIndex])) && conflictCells.size === 0,
    [grid, solutionGrid, conflictCells]
  );

  useEffect(() => {
    if (solved && !hasWon) {
      setHasWon(true);
      setMessage('Parabéns! Você venceu. Novo desafio gerado com outra ordem de números.');
      setTimeout(() => {
        const nextGame = createNewGame();
        setSolutionGrid(nextGame.solution);
        setGrid(nextGame.puzzle);
        setSelected([0, 0]);
        setHasWon(false);
      }, 700);
    }
  }, [solved, hasWon]);

  const placeNumber = (value) => {
    const [row, col] = selected;
    if (solutionGrid[row][col] === grid[row][col] && grid[row][col] !== 0) return;

    setGrid((current) =>
      current.map((item, r) =>
        item.map((cell, c) => (r === row && c === col ? value : cell))
      )
    );
  };

  const resetGrid = () => {
    const nextGame = createNewGame();
    setSolutionGrid(nextGame.solution);
    setGrid(nextGame.puzzle);
    setSelected([0, 0]);
    setHasWon(false);
    setMessage('Novo desafio pronto.');
  };

  return (
    <Window
      title="Sudoku"
      onClose={onClose}
      darkMode={darkMode}
      windowStyle={styles.gameWindow}
      contentStyle={styles.gameContent}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.intro, darkMode && styles.textDark]}>Selecione uma casa vazia e use os números abaixo para jogar.</Text>
        <View style={styles.board}>
          {grid.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((value, colIndex) => {
                const isSelected = selected[0] === rowIndex && selected[1] === colIndex;
                const isLocked = solutionGrid[rowIndex][colIndex] === grid[rowIndex][colIndex] && grid[rowIndex][colIndex] !== 0;
                const isConflict = conflictCells.has(`${rowIndex}-${colIndex}`);
                return (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.cell,
                      darkMode && styles.cellDark,
                      (colIndex + 1) % 3 === 0 && styles.cellDivider,
                      (rowIndex + 1) % 3 === 0 && styles.rowDivider,
                      isSelected && styles.selectedCell,
                      isConflict && styles.conflictCell,
                      isLocked && styles.lockedCell,
                    ]}
                    onPress={() => setSelected([rowIndex, colIndex])}
                  >
                    <Text style={[styles.value, darkMode && styles.textDark, isLocked && styles.lockedText]}>{value || ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
        <View style={styles.controls}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <TouchableOpacity key={n} style={styles.numberButton} onPress={() => placeNumber(n)}>
              <Text style={styles.numberText}>{n}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.numberButton, styles.clearButton]} onPress={() => placeNumber(0)}>
            <Text style={styles.numberText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.numberButton, styles.resetButton]} onPress={resetGrid}>
            <Text style={styles.numberText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.status, darkMode && styles.textDark]}>
          {message}
        </Text>
      </ScrollView>
    </Window>
  );
}

const styles = StyleSheet.create({
  gameWindow: {
    top: 8,
    left: 8,
    right: 8,
    bottom: 74,
    borderRadius: 18,
  },
  gameContent: { paddingHorizontal: 10, paddingVertical: 10 },
  container: { padding: 8 },
  intro: { fontSize: 12, color: '#374151', marginBottom: 8 },
  textDark: { color: '#f3f4f6' },
  board: { alignSelf: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cellDark: { backgroundColor: '#1f2937', borderColor: '#374151' },
  cellDivider: { borderRightWidth: 2, borderRightColor: '#9ca3af' },
  rowDivider: { borderBottomWidth: 2, borderBottomColor: '#9ca3af' },
  selectedCell: { backgroundColor: 'rgba(56, 189, 248, 0.16)' },
  conflictCell: { backgroundColor: 'rgba(248, 113, 113, 0.15)' },
  lockedCell: { backgroundColor: 'rgba(244, 114, 182, 0.08)' },
  lockedText: { color: '#111827', fontWeight: '800' },
  value: { fontSize: 13, fontWeight: '700', color: '#111827' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  numberButton: {
    minWidth: 40,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  clearButton: { backgroundColor: '#ef4444' },
  resetButton: { backgroundColor: '#10b981' },
  numberText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  status: { marginTop: 10, fontSize: 12, color: '#111827' },
});
