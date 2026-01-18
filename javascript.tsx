Users: {
  (username,
    pinHash,
    ownershipPoints,
    tradingHistory,
    messages);
}

Admin: {
  (profitLossSettings,
    appCustomization,
    socialPosts,
    tradingLinks);
}

Transactions: {
  (userId, points, status, timestamp, adminApproval);
}

Messages: {
  (senderId, receiverId, content, timestamp);
}