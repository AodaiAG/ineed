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
import "./custom-styles.css";

const StreamChatComponent = ({ apiKey, userToken, channelId, userID }) => {
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(false); // State to track initialization errors
  const client = StreamChat.getInstance(apiKey);

  const customMessageRenderer = (message) => {
    if (!message.user || !message.user.name) {
      console.warn("Message user is missing or malformed:", message);
      return (
        <div className="custom-message">
          <p className="message-text">
            {message.text || "Message content unavailable"}
          </p>
        </div>
      );
    }

    const senderName = message.user.name || "Unknown User";
    const senderID = message.user.id;
    let displayName = senderName.replace(/#(prof|client)$/, ""); // Remove suffix
    let displayImage = message.user.image || "/default-profile.png";

    // Adjust display based on suffix
    if (senderName.endsWith("#prof") && senderID !== userID) {
      displayName = `Prof ${senderID.slice(-4)}`; // Mask other professionals
      displayImage = "/default-prof-image.png"; // Generic prof image
    } else if (senderName.endsWith("#client")) {
      displayName = "Client"; // Display generic client name
      displayImage = "/default-client-image.png"; // Generic client image
    }

    return (
      <div className="custom-message">
        <img src={displayImage} alt="User" className="message-avatar" />
        <div className="message-content">
          <p className="message-sender">{displayName}</p>
          <p className="message-text">{message.text}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log(`Connecting user: ${userID}`);
        await client.connectUser(
          { id: userID, name: `${userID}` }, // Ensure suffix is included in user name
          userToken
        );
        console.log(`User connected: ${userID}`);

        console.log(`Joining channel: ${channelId}`);
        const joinedChannel = client.channel("messaging", channelId);

        await joinedChannel.watch();
        console.log(`Channel state:`, joinedChannel.state);

        const members = joinedChannel.state.members;
        console.log(`Channel members:`, members);

        setChannel(joinedChannel);
        console.log(`Joined channel:`, joinedChannel);
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
        <MessageList
          noMessagesRenderer={() => <p>No messages to display</p>}
          Message={customMessageRenderer} // Use the custom message renderer
        />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;
