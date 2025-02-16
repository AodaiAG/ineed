import { StreamChat } from "stream-chat";

const apiKey = "nr6puhgsrawn"; // Replace with your actual StreamChat API key
const client = StreamChat.getInstance(apiKey);

const fetchUnreadMessages = async (userId, userToken, requestIds) => {
    try {
        // Connect the user to StreamChat
        await client.connectUser({ id: userId }, userToken);

        // Generate channel IDs for each request
        const channelIds = requestIds.map((id) => `request_${id}`);

        // Query channels with unread message count
        const channels = await client.queryChannels(
            { id: { $in: channelIds } }, // Filter by request channels
            { last_message_at: -1 }, // Sort by last message
            { watch: true }
        );

        // Map request IDs to unread messages count
        const unreadCounts = {};
        channels.forEach((channel) => {
            unreadCounts[channel.cid.split(":")[1].replace("request_", "")] = channel.state.unreadCount;
        });

        

        return unreadCounts;
    } catch (error) {
        console.error("Error fetching unread messages:", error);
        return {};
    }
};

export default fetchUnreadMessages;
