export const DEFAULT_RANDOM_HEX_STRING_LENGTH = 8;

export function generateRandomHexString(length: number = DEFAULT_RANDOM_HEX_STRING_LENGTH): string {
    return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}
