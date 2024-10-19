export function generateChatId(uid1: string, uid2: string) {
  const sortedIds = [uid1, uid2].sort(); // Sort user IDs to ensure consistency
  const chatId = sortedIds.join('+'); // Concatenate sorted user IDs
  // should I hash the chatId?
  // const hashedChatId = hashFunction(chatId);
  return chatId;
}
