export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void => {
    let timeout: ReturnType<typeof setTimeout>;

    const debounced =  (...args: Parameters<T>): void => {
        if(timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => fn(...args), delay);
    };

    return debounced
}