import { JSONContent } from "@tiptap/react";
import { serializeMark } from "./marks";

function handleBasicMarks(node: JSONContent): string {
  if (!node.text) return '';
  
  let text = node.text;
  
  if (!node.marks) return text;
  
  node.marks.forEach((mark) => {
    text = serializeMark(mark.type, text, mark.attrs);
  });

  return text;
}