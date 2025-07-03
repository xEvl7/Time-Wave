export function truncateText(text: string, maxLength: number): string {
  let length = 0;
  let result = '';

  for (const char of text) {
    length += char.charCodeAt(0) > 255 ? 2 : 1; // 中文字符算 2，英文算 1
    if (length > maxLength) {
      result += '...';
      break;
    }
    result += char;
  }

  return result;
};
