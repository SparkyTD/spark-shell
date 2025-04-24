export function truncateText(text: string | null, maxLength: number) {
    if (!text || text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength - 3) + "...";
}

export function truncateTextMiddle(text: string | null, maxLength: number) {
    if (!text || text.length <= maxLength) {
        return text;
    }

    const ellipsis = "...";
    const charsToShow = maxLength - ellipsis.length;

    if (charsToShow < 2) {
        return ellipsis;
    }

    const charsOnLeft = Math.ceil(charsToShow / 2);
    const charsOnRight = Math.floor(charsToShow / 2);

    const beginning = text.substring(0, charsOnLeft);
    const ending = text.substring(text.length - charsOnRight);

    return beginning + ellipsis + ending;
}