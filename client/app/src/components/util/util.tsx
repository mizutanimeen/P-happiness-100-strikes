// Date -> yyyy-mm-dd
export function formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
}

// Date -> hh:mm:ss
export function formatTime(date: Date): string {
    return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
}

// yyyy-mm-ddThh:mm:ssZ -> hh:mm
export function formatStringTime(dateTime: string): string {
    //split
    const time = dateTime.split("T")[1];
    return time.slice(0, 5);
}
