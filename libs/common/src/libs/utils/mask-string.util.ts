export const DEFAULT_UNMASKED_NUM_CHARACTERS = 4;
export const DEFAULT_MASK_CHARACTER = '*';

interface Options {
    numCharacters: number;
    regex: RegExp;
    strategy?: (input: string) => string;
}

export function maskString(input: string, withOptions?: Partial<Options>): string {
    try {
        const options: Options = {
            numCharacters: DEFAULT_UNMASKED_NUM_CHARACTERS,
            regex: /./g,
            ...withOptions,
        };

        if (!(typeof input === 'string')) {
            return input;
        }

        const trimmed = input.trim();

        if (options.strategy) {
            return options.strategy(input);
        }

        if (trimmed.length < options.numCharacters) {
            return trimmed.replace(/./g, DEFAULT_MASK_CHARACTER);
        } else {
            const base = trimmed
                .slice(0, Math.max(0, trimmed.length - options.numCharacters))
                .replace(options.regex, DEFAULT_MASK_CHARACTER);
            const masked = trimmed.slice(trimmed.length - options.numCharacters);

            return base.length > 0 ? base.replace(/./g, DEFAULT_MASK_CHARACTER) + masked : masked.replace(/./g, DEFAULT_MASK_CHARACTER);
        }
    } catch (e) {
        console.error(e);

        return '';
    }
}
