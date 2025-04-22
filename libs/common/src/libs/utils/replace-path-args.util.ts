export function replacePathArgs(path: string, args: Record<string, unknown>): string {
    let interpolated = path;

    for (const key of Object.keys(args)) {
        while (interpolated.includes(`/:${key}/`)) {
            interpolated = interpolated.replace(`/:${key}/`, `/${args[`${key}`]}/`);
        }

        while (interpolated.endsWith(`/:${key}`)) {
            interpolated = `${interpolated.slice(0, interpolated.length - key.length - 2)}/${args[`${key}`]}`;
        }
    }

    return interpolated;
}
