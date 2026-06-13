import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Window from '../components/Window';

const initialPieces = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const pieceMap = {
  '♜': 'rook', '♞': 'knight', '♝': 'bishop', '♛': 'queen', '♚': 'king', '♟': 'pawn',
  '♖': 'rook', '♘': 'knight', '♗': 'bishop', '♕': 'queen', '♔': 'king', '♙': 'pawn',
};

const whitePieces = new Set(['♖', '♘', '♗', '♕', '♔', '♙']);
const pieceValues = {
  '♙': 1,
  '♘': 3,
  '♗': 3,
  '♖': 5,
  '♕': 9,
  '♔': 100,
  '♟': 1,
  '♞': 3,
  '♝': 3,
  '♜': 5,
  '♛': 9,
  '♚': 100,
};

function isWhite(piece) { return whitePieces.has(piece); }

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function isCenterSquare(row, col) {
  return (row === 3 || row === 4) && (col === 3 || col === 4);
}

function isPathClear(board, fromRow, fromCol, toRow, toCol) {
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);

  let row = fromRow + rowStep;
  let col = fromCol + colStep;

  while (row !== toRow || col !== toCol) {
    if (board[row][col]) return false;
    row += rowStep;
    col += colStep;
  }
  return true;
}

function isLegalMove(board, fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const target = board[toRow][toCol];

  if (!piece) return false;
  if (piece === target) return false;
  if (target && isWhite(piece) === isWhite(target)) return false;

  const type = pieceMap[piece];
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const absRow = Math.abs(rowDiff);
  const absCol = Math.abs(colDiff);

  if (type === 'pawn') {
    const direction = isWhite(piece) ? -1 : 1;
    if (colDiff === 0) {
      const oneStep = fromRow + direction;
      if (toRow === oneStep && !target && !board[oneStep][fromCol]) return true;
      const twoStep = fromRow + direction * 2;
      if (fromRow === (isWhite(piece) ? 6 : 1) && toRow === twoStep && !target && !board[oneStep][fromCol] && !board[twoStep][fromCol]) return true;
      return false;
    }
    return absRow === 1 && absCol === 1 && target && isWhite(piece) !== isWhite(target) && toRow === fromRow + direction;
  }

  if (type === 'knight') {
    return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
  }

  if (type === 'bishop') {
    return absRow === absCol && isPathClear(board, fromRow, fromCol, toRow, toCol);
  }

  if (type === 'rook') {
    return (rowDiff === 0 || colDiff === 0) && isPathClear(board, fromRow, fromCol, toRow, toCol);
  }

  if (type === 'queen') {
    return ((rowDiff === 0 || colDiff === 0) || absRow === absCol) && isPathClear(board, fromRow, fromCol, toRow, toCol);
  }

  if (type === 'king') {
    return absRow <= 1 && absCol <= 1;
  }

  return false;
}

function getLegalMoves(board, fromRow, fromCol) {
  const moves = [];

  for (let toRow = 0; toRow < 8; toRow += 1) {
    for (let toCol = 0; toCol < 8; toCol += 1) {
      if (isLegalMove(board, fromRow, fromCol, toRow, toCol)) {
        moves.push([toRow, toCol]);
      }
    }
  }

  return moves;
}

function chooseAiMove(board, difficulty) {
  const aiMoves = [];

  board.forEach((row, fromRow) => {
    row.forEach((cell, fromCol) => {
      if (!cell || isWhite(cell)) return;

      getLegalMoves(board, fromRow, fromCol).forEach(([toRow, toCol]) => {
        const captured = board[toRow][toCol];
        const baseScore = captured ? (pieceValues[captured] || 0) : 0;
        const centerBonus = isCenterSquare(toRow, toCol) ? 1 : 0;
        const attackBonus = captured && (pieceValues[captured] || 0) >= 5 ? 2 : 0;
        const difficultyBonus = difficulty === 'hard' ? 1 : 0;

        aiMoves.push({
          fromRow,
          fromCol,
          toRow,
          toCol,
          captured,
          score: baseScore + centerBonus + attackBonus + difficultyBonus,
        });
      });
    });
  });

  if (aiMoves.length === 0) return null;

  if (difficulty === 'easy') {
    return aiMoves[Math.floor(Math.random() * aiMoves.length)];
  }

  aiMoves.sort((a, b) => b.score - a.score);

  if (difficulty === 'medium') {
    const topMoves = aiMoves.slice(0, Math.max(1, Math.floor(aiMoves.length * 0.45)));
    return topMoves[Math.floor(Math.random() * topMoves.length)];
  }

  return aiMoves[0];
}

export default function Chess({ onClose, darkMode }) {
  const [board, setBoard] = useState(initialPieces);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('white');
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('machine');
  const [difficulty, setDifficulty] = useState('medium');
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);
  const [message, setMessage] = useState('Selecione uma peça e depois a casa de destino.');

  const movePiece = (row, col) => {
    if (winner) return;

    const piece = board[row][col];

    if (selected) {
      const [fromRow, fromCol] = selected;
      const movingPiece = board[fromRow][fromCol];
      const targetPiece = board[row][col];

      if (fromRow === row && fromCol === col) {
        setSelected(null);
        setMessage('Peça desmarcada.');
        return;
      }

      if (targetPiece && isWhite(movingPiece) === isWhite(targetPiece)) {
        setSelected([row, col]);
        setMessage(`Peça selecionada: ${targetPiece}. Agora toque na próxima casa.`);
        return;
      }

      if (!isLegalMove(board, fromRow, fromCol, row, col)) {
        setMessage('Movimento inválido para esta peça.');
        return;
      }

      if (isWhite(movingPiece) ? turn !== 'white' : turn !== 'black') {
        setMessage('Agora é a vez da outra cor.');
        return;
      }

      const nextBoard = cloneBoard(board);
      const captured = nextBoard[row][col];
      nextBoard[fromRow][fromCol] = '';
      nextBoard[row][col] = movingPiece;

      const nextTurn = turn === 'white' ? 'black' : 'white';

      if (captured) {
        if (isWhite(movingPiece)) {
          setCapturedWhite((prev) => [...prev, captured]);
        } else {
          setCapturedBlack((prev) => [...prev, captured]);
        }
      }

      setBoard(nextBoard);
      setSelected(null);
      setTurn(nextTurn);

      if (captured === '♚' || captured === '♔') {
        const winnerLabel = isWhite(movingPiece) ? 'Brancas' : 'Pretas';
        setWinner(`Vitória das ${winnerLabel.toLowerCase()}!`);
        setMessage(`${winnerLabel} capturaram o rei adversário. Vitória de ${winnerLabel}!`);
        return;
      }

      if (gameMode === 'machine' && nextTurn === 'black') {
        setMessage(`Você moveu ${movingPiece} para (${row + 1}, ${col + 1}). A máquina está pensando...`);

        setTimeout(() => {
          const chosenMove = chooseAiMove(nextBoard, difficulty);

          if (!chosenMove) {
            setWinner('Brancas venceram!');
            setMessage('A máquina não tem movimentos válidos. Vitória das brancas!');
            return;
          }

          const aiPiece = nextBoard[chosenMove.fromRow][chosenMove.fromCol];
          const aiCaptured = nextBoard[chosenMove.toRow][chosenMove.toCol];

          const aiBoard = cloneBoard(nextBoard);
          aiBoard[chosenMove.fromRow][chosenMove.fromCol] = '';
          aiBoard[chosenMove.toRow][chosenMove.toCol] = aiPiece;

          if (aiCaptured) {
            setCapturedBlack((prev) => [...prev, aiCaptured]);
          }

          setBoard(aiBoard);
          setTurn('white');

          if (aiCaptured === '♔' || aiCaptured === '♚') {
            setWinner('Vitória das pretas!');
            setMessage('A máquina capturou o seu rei. Vitória das pretas!');
            return;
          }

          setMessage(`A máquina jogou ${aiPiece} para (${chosenMove.toRow + 1}, ${chosenMove.toCol + 1}). Sua vez!`);
        }, 350);
        return;
      }

      setMessage(`Jogada concluída. Agora é a vez das ${nextTurn === 'white' ? 'brancas' : 'pretas'}.`);
      return;
    }

    if (!piece) {
      setMessage('Selecione uma peça válida.');
      return;
    }

    if ((isWhite(piece) && turn !== 'white') || (!isWhite(piece) && turn !== 'black')) {
      setMessage('É a vez da outra cor.');
      return;
    }

    setSelected([row, col]);
    setMessage(`Peça selecionada: ${piece}. Espaços válidos destacados em verde.`);
  };

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    const [fromRow, fromCol] = selected;
    return getLegalMoves(board, fromRow, fromCol);
  }, [selected, board]);

  const status = useMemo(() => `${turn === 'white' ? 'Brancas' : 'Pretas'} jogam agora.`, [turn]);

  const resetBoard = () => {
    setBoard(cloneBoard(initialPieces));
    setSelected(null);
    setTurn('white');
    setWinner(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMessage('Nova partida iniciada. Selecione uma peça e depois a casa de destino.');
  };

  return (
    <Window
      title="Xadrez"
      onClose={onClose}
      darkMode={darkMode}
      windowStyle={styles.gameWindow}
      contentStyle={styles.gameContent}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.intro, darkMode && styles.textDark]}>Selecione uma peça e depois a casa de destino. Os movimentos válidos ficam destacados.</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'machine' && styles.modeButtonActive]}
            onPress={() => {
              setGameMode('machine');
              resetBoard();
              setMessage('Modo alterado para jogar contra a máquina.');
            }}
          >
            <Text style={[styles.modeButtonText, gameMode === 'machine' && styles.modeButtonTextActive]}>Contra a máquina</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'twoPlayers' && styles.modeButtonActive]}
            onPress={() => {
              setGameMode('twoPlayers');
              resetBoard();
              setMessage('Modo alterado para dois jogadores.');
            }}
          >
            <Text style={[styles.modeButtonText, gameMode === 'twoPlayers' && styles.modeButtonTextActive]}>2 jogadores</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.difficultyRow}>
          {['easy', 'medium', 'hard'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.difficultyButton, difficulty === level && styles.difficultyButtonActive]}
              onPress={() => {
                setDifficulty(level);
                setMessage(`Dificuldade da IA definida como ${level === 'easy' ? 'fácil' : level === 'medium' ? 'média' : 'difícil'}.`);
              }}
            >
              <Text style={[styles.difficultyText, difficulty === level && styles.difficultyTextActive]}>
                {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Média' : 'Difícil'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.turn, darkMode && styles.textDark]}>{status}</Text>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((piece, colIndex) => {
              const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;
              const isAvailableMove = legalMoves.some(([moveRow, moveCol]) => moveRow === rowIndex && moveCol === colIndex);

              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    darkMode && styles.cellDark,
                    (rowIndex + colIndex) % 2 === 0 ? styles.light : styles.dark,
                    isSelected && styles.selectedCell,
                    isAvailableMove && styles.availableMove,
                  ]}
                  onPress={() => movePiece(rowIndex, colIndex)}
                >
                  {piece ? <Text style={styles.piece}>{piece}</Text> : isAvailableMove ? <Text style={styles.moveHint}>•</Text> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.capturePanel}>
          <View style={styles.captureBox}>
            <Text style={[styles.captureLabel, darkMode && styles.textDark]}>Brancas capturaram</Text>
            <Text style={[styles.capturePieces, darkMode && styles.textDark]}>{capturedWhite.length ? capturedWhite.join(' ') : '—'}</Text>
          </View>
          <View style={styles.captureBox}>
            <Text style={[styles.captureLabel, darkMode && styles.textDark]}>Pretas capturaram</Text>
            <Text style={[styles.capturePieces, darkMode && styles.textDark]}>{capturedBlack.length ? capturedBlack.join(' ') : '—'}</Text>
          </View>
        </View>
        <Text style={[styles.status, darkMode && styles.textDark]}>
          {winner || message}
        </Text>

        {winner ? (
          <View style={styles.overlay}>
            <View style={[styles.overlayCard, darkMode && styles.overlayCardDark]}>
              <Text style={styles.overlayEmoji}>🏆</Text>
              <Text style={styles.overlayTitle}>Vitória!</Text>
              <Text style={[styles.overlayText, darkMode && styles.textDark]}>{winner}</Text>
              <TouchableOpacity style={styles.overlayButton} onPress={resetBoard}>
                <Text style={styles.overlayButtonText}>Nova partida</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
  intro: { fontSize: 12, color: '#374151', marginBottom: 4 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  difficultyRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  modeButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: 'rgba(37, 99, 235, 0.7)',
  },
  modeButtonText: { fontSize: 11, color: '#111827' },
  modeButtonTextActive: { color: '#1d4ed8', fontWeight: '700' },
  difficultyButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  difficultyButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.7)',
  },
  difficultyText: { fontSize: 11, color: '#111827' },
  difficultyTextActive: { color: '#047857', fontWeight: '700' },
  turn: { fontSize: 11, color: '#2563eb', marginBottom: 8 },
  textDark: { color: '#f3f4f6' },
  row: { flexDirection: 'row' },
  cell: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cellDark: { borderColor: 'rgba(255,255,255,0.15)' },
  light: { backgroundColor: '#f8fafc' },
  dark: { backgroundColor: '#cbd5e1' },
  selectedCell: { backgroundColor: 'rgba(56, 189, 248, 0.25)' },
  availableMove: { backgroundColor: 'rgba(34, 197, 94, 0.18)' },
  moveHint: { fontSize: 12, color: '#047857', fontWeight: '700' },
  piece: { fontSize: 18 },
  capturePanel: { flexDirection: 'row', gap: 8, marginTop: 8 },
  captureBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  captureLabel: { fontSize: 10, color: '#334155', marginBottom: 2 },
  capturePieces: { fontSize: 12, color: '#111827' },
  status: { marginTop: 10, fontSize: 12, color: '#111827' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  overlayCard: {
    width: '88%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.98)',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    alignItems: 'center',
  },
  overlayCardDark: { backgroundColor: 'rgba(17, 24, 39, 0.98)' },
  overlayEmoji: { fontSize: 28, marginBottom: 4 },
  overlayTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  overlayText: { fontSize: 13, color: '#111827', textAlign: 'center', marginBottom: 10 },
  overlayButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  overlayButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
