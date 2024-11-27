import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom-styles.css"; // Your custom styles

const StreamChatComponent = ({ apiKey, userToken, channelId, userID }) => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(false); // State to track initialization errors
  const client = StreamChat.getInstance(apiKey);

  useEffect(() => {
    const setupChat = async () => {
      try {


        // Connect user to the Stream chat client
        await client.connectUser(
          { id: userID, name: `User ${userID}` },
          userToken
        );



        // Join the specified channel
        const joinedChannel = client.channel("messaging", channelId);

        // Watch the channel and retrieve its state
        await joinedChannel.watch();


 

        // Set the joined channel in state
        setChannel(joinedChannel);
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
  }, [client, userToken, channelId, userID]);

  if (error) {
    return <div>Failed to initialize chat. Please try again later.</div>;
  }

  if (!channel) {
    return <p>Loading chat...</p>;
  }

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
