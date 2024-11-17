export type MarkHandler = (text: string, attrs?: Record<string, unknown>) => string;

const markHandlers: Record<string, MarkHandler> = {
  bold: (text) => `**${text}**`,
  italic: (text) => `*${text}*`,
  underline: (text) => `<u>${text}</u>`,
  strike: (text) => `~~${text}~~`,
  textStyle: (text, attrs) => `<span data-color="${attrs?.color}" style="color: ${attrs?.color}">${text}</span>`,
  highlight: (text, attrs) => `<mark data-color="${attrs?.color}" style="background-color: ${attrs?.color}">${text}</mark>`,
};

export function serializeMark(type: string, text: string, attrs?: Record<string, unknown>): string {
  const handler = markHandlers[type];
  return handler ? handler(text, attrs) : text;
};
