import React, { useEffect, useState } from "react";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom-styles.css"; // Your custom styles

const StreamChatComponent = ({ apiKey, userToken, channelId }) => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(false); // State to track initialization errors
  const client = StreamChat.getInstance(apiKey);

  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log("Connecting user...");
        await client.connectUser(
          { id: "14", name: "Test Client" },
          userToken
        );

        console.log("Initializing channel...");
        const initializedChannel = client.channel("messaging", channelId, 
            {
          name: `Request ${channelId}`,
          members: ["14"],
        });

        await initializedChannel.watch();
        console.log("Channel initialized:", initializedChannel);

        setChannel(initializedChannel); // Set the channel on success
      } catch (error) {
        console.error("Error setting up chat:", error);
        setError(true); // Set error state if initialization fails
      }
    };

    setupChat();

    return () => {
        if (client && client.userID) {
          console.log("Disconnecting user...");
          client.disconnectUser();
        } else {
          console.log("No user to disconnect.");
        }
      };
      
  }, [client, userToken, channelId]);

  if (error) {
    // Render fallback UI if chat initialization fails
    return <div>Failed to initialize chat. Please try again later.</div>;
  }

  if (!channel) {
    // Render loading state while channel is being set up
    return <p>Loading channel...</p>;
  }

  // Render the chat interface
  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />
        <MessageList noMessagesRenderer={() => <p>No messages to display</p>} />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;
