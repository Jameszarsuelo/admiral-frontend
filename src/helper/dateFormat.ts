export function dateFormat(value: string): string {
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return formattedDate;
}
