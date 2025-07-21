
'use client';

import { useEffect, useState, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import { cn } from '@/utils/cn';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editor, setEditor] = useState<CodeMirror.Editor | null>(null);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    if (textareaRef.current && !editor) {
      const cm = CodeMirror.fromTextArea(textareaRef.current, {
        mode: 'javascript',
        theme: theme,
        lineNumbers: true,
        readOnly: readOnly ? 'nocursor' : false,
      });

      cm.on('change', () => {
        onChange(cm.getValue());
      });

      setEditor(cm);
    }

    return () => {
      if (editor) {
        editor.toTextArea();
        setEditor(null);
      }
    };
  }, [editor, readOnly, onChange]);

  useEffect(() => {
    if (editor) {
      editor.setOption('theme', theme);
    }
  }, [theme, editor]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-1 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="default">Light</option>
          <option value="solarized dark">Dark</option>
          <option value="monokai">Monokai</option>
        </select>
      </div>
      <textarea ref={textareaRef} defaultValue={value} className={cn('codemirror-editor')} />
    </div>
  );
}