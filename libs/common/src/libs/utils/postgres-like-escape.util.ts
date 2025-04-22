export function postgresLikeEscape(input: string): string {
    return input
        .split('%')
        .join('\\%')
        .split('_')
        .join('\\_');
}
