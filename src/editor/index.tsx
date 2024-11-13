"use client";

import Editor from "./editor";

export default function BlogcodeEditorContainer() {
  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <Editor name="content" />
    </div>
  );
}