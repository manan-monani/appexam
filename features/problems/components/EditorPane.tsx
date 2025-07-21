'use client';

import CodeEditor from '@/components/CodeEditor';

// Editor pane for the problem workspace
// Reference: HackerRank Clone document, Section 5.3 (Code Editor UI)

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function EditorPane({ value, onChange, language = 'javascript' }: EditorPaneProps) {
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
      <h3 className="text-lg font-medium mb-2">Code Editor</h3>
      <CodeEditor value={value} onChange={onChange} language={language} />
    </div>
  );
}