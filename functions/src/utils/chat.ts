export const getChatId = (userA: string, userB: string) => {
    return [userA, userB].sort().join("_");
}