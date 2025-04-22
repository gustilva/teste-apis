import { capitalizeFirstLetter } from './capitalize-first-letter.util';

export function capitalizeFirstLetterAll(input: string): string {
    return input.split(' ').map((word) => capitalizeFirstLetter(word)).join(' ');
}
