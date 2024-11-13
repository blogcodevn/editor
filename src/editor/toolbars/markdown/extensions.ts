import Markdown from "./markdown";
import { lowlight } from "./utils";

const MarkdownExtensions = [
  Markdown.configure({
    lowlight,
    defaultLanguage: "plain",
    languageClassPrefix: "language-",
  }),
];

export default MarkdownExtensions;
