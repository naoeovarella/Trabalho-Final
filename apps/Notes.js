import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import Window from '../components/Window';

const STORAGE_KEY = 'winlike_notes_v1';

function loadNotes() {
  if (typeof window === 'undefined' || !window.localStorage) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveNotes(notes) {
  if (typeof window === 'undefined' || !window.localStorage) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function Notes({ onClose, darkMode }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('Crie uma nota com um nome e salve para aparecer como um ícone novo.');

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const selectedNote = useMemo(
    () => notes.find((item) => item.id === selectedId) || null,
    [notes, selectedId]
  );

  const saveNote = () => {
    const name = title.trim() || 'Nota sem nome';
    const text = content.trim();

    if (!text) {
      setMessage('Digite algo na nota antes de salvar.');
      return;
    }

    const note = {
      id: Date.now().toString(),
      title: name,
      content: text,
      updatedAt: new Date().toLocaleString('pt-BR'),
    };

    const nextNotes = [note, ...notes];
    setNotes(nextNotes);
    saveNotes(nextNotes);
    setTitle('');
    setContent('');
    setSelectedId(note.id);
    setMessage(`Nota "${name}" salva com sucesso.`);
  };

  const openNote = (id) => {
    const note = notes.find((item) => item.id === id);
    if (!note) return;

    setSelectedId(id);
    setTitle(note.title);
    setContent(note.content);
    setMessage(`Nota "${note.title}" carregada para edição.`);
  };

  const deleteNote = (id) => {
    const note = notes.find((item) => item.id === id);
    const nextNotes = notes.filter((item) => item.id !== id);
    setNotes(nextNotes);
    saveNotes(nextNotes);

    if (selectedId === id) {
      setSelectedId(null);
      setTitle('');
      setContent('');
    }

    setMessage(note ? `Nota "${note.title}" excluída.` : 'Nota excluída.');
  };

  const updateSelected = () => {
    if (!selectedId) {
      setMessage('Selecione uma nota salva para atualizar.');
      return;
    }

    const nextNotes = notes.map((item) =>
      item.id === selectedId
        ? {
            ...item,
            title: title.trim() || 'Nota sem nome',
            content: content.trim(),
            updatedAt: new Date().toLocaleString('pt-BR'),
          }
        : item
    );

    setNotes(nextNotes);
    saveNotes(nextNotes);
    setMessage('Nota atualizada.');
  };

  return (
    <Window title="Bloco de Notas" onClose={onClose} darkMode={darkMode}>
      <View style={[styles.window, darkMode && styles.windowDark]}>
        <Text style={[styles.subtitle, darkMode && styles.textDark]}>
          Nomeie a nota, salve e ela vira um ícone de nota à sua direita. Você também pode excluir qualquer nota salva.
        </Text>

        <View style={styles.panel}>
          <TextInput
            style={[styles.input, darkMode && styles.inputDark]}
            value={title}
            onChangeText={setTitle}
            placeholder="Nome da nota"
            placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
          />

          <TextInput
            style={[styles.textArea, darkMode && styles.inputDark]}
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Digite o conteúdo da nota..."
            placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
            textAlignVertical="top"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={saveNote}>
              <Text style={styles.primaryButtonText}>Salvar nova nota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={updateSelected}>
              <Text style={[styles.secondaryButtonText, darkMode && styles.textDark]}>Atualizar nota</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>Notas salvas</Text>
          <Text style={[styles.helper, darkMode && styles.textMutedDark]}>{notes.length} nota(s)</Text>
        </View>

        <ScrollView style={styles.notesList} contentContainerStyle={styles.notesContent}>
          {notes.length === 0 ? (
            <Text style={[styles.emptyText, darkMode && styles.textDark]}>Nenhuma nota salva ainda.</Text>
          ) : (
            notes.map((item) => (
              <View key={item.id} style={[styles.noteCard, darkMode && styles.noteCardDark]}>
                <TouchableOpacity style={styles.noteMain} onPress={() => openNote(item.id)}>
                  <View style={styles.noteIconBox}>
                    <Text style={styles.noteIcon}>📝</Text>
                  </View>
                  <View style={styles.noteTextBox}>
                    <Text style={[styles.noteTitle, darkMode && styles.textDark]}>{item.title}</Text>
                    <Text style={[styles.notePreview, darkMode && styles.textMutedDark]} numberOfLines={2}>
                      {item.content || 'Sem conteúdo ainda.'}
                    </Text>
                    <Text style={[styles.noteMeta, darkMode && styles.textMutedDark]}>Atualizada em {item.updatedAt}</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.noteActions}>
                  <TouchableOpacity style={styles.openButton} onPress={() => openNote(item.id)}>
                    <Text style={styles.openButtonText}>Abrir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(item.id)}>
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <Text style={[styles.status, darkMode && styles.textDark]}>{message}</Text>
        {selectedNote ? (
          <Text style={[styles.activeNote, darkMode && styles.textDark]}>Nota ativa: {selectedNote.title}</Text>
        ) : null}
      </View>
    </Window>
  );
}

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 10,
  },
  windowDark: {
    backgroundColor: '#111827',
  },
  subtitle: {
    color: '#374151',
    fontSize: 12,
    marginBottom: 8,
  },
  textDark: {
    color: '#f3f4f6',
  },
  textMutedDark: {
    color: '#cbd5e1',
  },
  panel: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputDark: {
    backgroundColor: '#1f2937',
    color: '#f3f4f6',
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  textArea: {
    minHeight: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#111827',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  helper: {
    fontSize: 11,
    color: '#475569',
  },
  notesList: {
    maxHeight: 260,
  },
  notesContent: {
    paddingBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#475569',
  },
  noteCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  noteCardDark: {
    backgroundColor: '#1f2937',
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  noteMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    marginRight: 8,
  },
  noteIcon: {
    fontSize: 16,
  },
  noteTextBox: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  notePreview: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  noteMeta: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 6,
  },
  openButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#dbeafe',
  },
  openButtonText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '700',
  },
  status: {
    marginTop: 8,
    fontSize: 11,
    color: '#111827',
  },
  activeNote: {
    marginTop: 4,
    fontSize: 11,
    color: '#111827',
  },
});