import { isNotNullOrUndefined } from './is-not-null-or-undefined.util';

export function numberOrDefault(
    input: unknown,
    defaultValue = 0,
    options = {
        min: undefined,
    },
): number {
    const result = typeof input === 'number' && !Number.isNaN(input) ? input : defaultValue;

    if (isNotNullOrUndefined(options.min)) {
        return result < options.min ? options.min : result;
    } else {
        return result;
    }
}
