import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  defaultRenderMessages,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { Avatar, Box, Typography } from "@mui/material";
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
        await client.connectUser(
          { id: userID },
          userToken
        );

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

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <ChannelHeader />

        <MessageList
          renderMessages={(messageListProps) => {
            const elements = defaultRenderMessages(messageListProps);

            // Custom logic to modify each message element
            return elements.map((element) => {
              const message = element.props.message;
              const isOwnMessage = message.user.id === userID;
              const isProfessional = message.user.role === "prof";

              const displayName =
                isProfessional && !isOwnMessage ? "Anonymous Professional" : message.user.name;

              const avatarSrc =
                isProfessional && !isOwnMessage ? "/default-anonymous.png" : message.user.image;

              return (
                <li key={message.id} className="custom-message" style={{ listStyle: "none" }}>
                  <Box display="flex" alignItems="center">
                    <Avatar src={avatarSrc} />
                    <Typography marginLeft={1} fontWeight="bold">
                      {displayName}
                    </Typography>
                    <Typography marginLeft={2}>{message.text}</Typography>
                  </Box>
                </li>
              );
            });
          }}
          noMessagesRenderer={() => <p>No messages to display</p>}
        />

        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;
