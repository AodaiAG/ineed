import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  MessageSimple, // Import the default Message component
  useMessageContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom-styles.css";

const StreamChatComponent = ({ apiKey, userToken, channelId, userID, userRole }) => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(false);
  const client = StreamChat.getInstance(apiKey);

  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log(`Connecting user: ${userID}`);
        await client.connectUser({ id: userID }, userToken);

        console.log(`Joining channel: ${channelId}`);
        const joinedChannel = client.channel("messaging", channelId);

        await joinedChannel.watch();
        console.log("Channel joined successfully:", joinedChannel);

        setChannel(joinedChannel);
      } catch (error) {
        console.error("Error setting up chat:", error);
        setError(true);
      }
    };

    setupChat();

    return () => {
      if (client && client.userID) {
        console.log("Disconnecting user...");
        client.disconnectUser();
      }
    };
  }, [client, userToken, channelId, userID]);

  if (error) {
    return <div>Failed to initialize chat. Please try again later.</div>;
  }

  if (!channel) {
    return <p>Loading chat...</p>;
  }

  // Custom Message Component with Updated Logic
  const CustomMessage = (props) => {
    const { message } = useMessageContext();

    const isOwnMessage = message.user?.id === userID;
    const senderRole = message.user?.role;

    let displayName = message.user?.name || "Unknown User";

    // Logic to anonymize other professionals for professionals only
    if (userRole === "prof" && senderRole === "prof" && !isOwnMessage) {
      displayName = "Anonymous Professional";
    }

    // Use the default MessageSimple component provided by Stream
    return <MessageSimple {...props} message={{ ...message, user: { ...message.user, name: displayName } }} />;
  };

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList Message={CustomMessage} noMessagesRenderer={() => <p>No messages to display</p>} />
        <MessageInput publishTypingEvent={false} />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;
