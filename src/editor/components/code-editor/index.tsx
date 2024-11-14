import Editor from "@monaco-editor/react";
import type { EditorProps } from "@monaco-editor/react";

export interface CodeEditorProps extends Omit<EditorProps, 'theme'> {
  darkMode?: boolean;
}

const CodeEditor = ({ darkMode = false, ...props }: CodeEditorProps) => {
  return (
    <Editor
      theme={darkMode ? "vs-dark" : "light"}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        automaticLayout: true,
        ...props.options
      }}
      {...props}
    />
  );
};

export default CodeEditor;