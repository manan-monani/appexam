'use client';

import { useEffect, useRef } from 'react';
import { basicSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { useTheme } from '@/hooks/useTheme';
import '@/styles/editor.css';

// CodeMirror wrapper for the coding environment
// Reference: HackerRank Clone document, Section 5.3 (Code Editor Implementation)

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = 'javascript' }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        language === 'javascript' ? javascript() : [], // Add more languages as needed
        isDarkMode ? oneDark : [],
        keymap.of([
          ...defaultKeymap,
          {
            key: 'Ctrl-Enter',
            run: () => {
              onChange(viewRef.current!.state.doc.toString());
              return true;
            },
          },
        ]),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, [language, isDarkMode, onChange]);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="codemirror-editor" />;
}