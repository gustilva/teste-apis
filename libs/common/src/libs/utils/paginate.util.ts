export function paginate<T>(input: Array<T>, offset: number, limit: number): Array<T> {
    return limit > 0
        ? input.slice(offset, offset + limit)
        : input;
}
