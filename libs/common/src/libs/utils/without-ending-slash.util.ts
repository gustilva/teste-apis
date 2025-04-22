export const withoutEndingSlash = (input: string) => {
  if (! input) {
    return '';
  }

  const sInput = (input || '').toString();

  return sInput[sInput.length - 1] === '/'
    ? sInput.slice(0, sInput.length - 1)
    : sInput;
};
