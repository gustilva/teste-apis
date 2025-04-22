export const withoutTrailingSlash = (input: string) => {
  if (! input) {
    return '';
  }

  while (input.startsWith('/')) {
    // tslint:disable-next-line:no-parameter-reassignment
    input = input.slice(1);
  }

  return input;
};
