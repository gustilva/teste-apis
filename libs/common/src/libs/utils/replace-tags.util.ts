import { generateRandomHexString } from './generate-random-hex-string.util';

export function replaceTags(message: string, args: any): string {
    if (args) {
        const uniqueKey = generateRandomHexString(8);

        Object.keys(args).forEach((tag, index) => {
            message = message.split(`{{ ${tag} }}`).join(`___${uniqueKey}_${index}___`);
        });

        Object.keys(args).forEach((tag, index) => {
            message = message.split(`___${uniqueKey}_${index}___`).join(args[`${tag}`]);
        });
    }

    return message;
}
