import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Avatar,
  MessageText,
  useMessageContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import "./custom-styles.css";
import { useNavigate } from "react-router-dom";


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

  // Custom Message Component with Updated Logic
  const CustomMessage = (props) => {
    const { isMyMessage, message } = useMessageContext();
    const navigate = useNavigate();
  
    const messageUiClassNames = ["custom-message-ui"];
  
    if (isMyMessage()) {
      messageUiClassNames.push("custom-message-ui--mine");
    } else {
      messageUiClassNames.push("custom-message-ui--other");
    }
  
    const isOwnMessage = message.user?.id === userID;
    const senderRole = message.user?.role;
  
    let displayName = message.user?.name || "Unknown User";
  
    if (userRole === "prof" && senderRole === "prof" && !isOwnMessage) {
      displayName = "Anonymous Professional";
    }
  
    const handleAvatarClick = () => {
      if (message.user?.id) {
        navigate(`/profile/${message.user.id}`);
      }
    };
  
    return (
      <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
        <div className="custom-message-ui__body">
          <Avatar
            image={message.user?.image}
            name={displayName}
            onClick={handleAvatarClick}  // Added onClick handler
            style={{ cursor: "pointer" }} // Make it clear the avatar is clickable
          />
          <MessageText />
        </div>
      </div>
    );
  };
  

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
        <MessageList Message={CustomMessage} />
        <MessageInput publishTypingEvent={false} />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;