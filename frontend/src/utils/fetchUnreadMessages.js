import { StreamChat } from "stream-chat";

const apiKey = "nr6puhgsrawn";
const client = StreamChat.getInstance(apiKey);

const fetchUnreadMessages = async (userId, userToken, requestIds) => {
  try {
    if (!client.userID) {
      await client.connectUser({ id: userId }, userToken);
    }

    const channelIds = requestIds.map((id) => `request_${id}`);
    if (!channelIds.length) return {};

    const channels = await client.queryChannels(
      { id: { $in: channelIds } },
      { last_message_at: -1 },
      { watch: true }
    );

    const unreadCounts = {};
    channels.forEach((channel) => {
      unreadCounts[channel.cid.split(":")[1].replace("request_", "")] = channel.countUnread();
    });

    return unreadCounts;
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    return {};
  }
};

export default fetchUnreadMessages;
