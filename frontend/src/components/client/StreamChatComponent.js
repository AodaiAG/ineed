import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
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

        setChannel(joinedChannel);
      } catch (error) {
        console.error("Error setting up chat:", error);
        setError(true);
      }
    };

    setupChat();

    return () => {
      if (client && client.userID) {
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
          customMessageRenderer={(props) => {
            const { message } = props;

            console.log("Message User:", message.user);
            console.log("User Role Passed In:", userRole);
            console.log("Current User ID:", userID);

            const isOwnMessage = message.user.id === userID;
            const isProfessional = message.user.role === "prof";

            console.log("Is Own Message:", isOwnMessage);
            console.log("Is Professional:", isProfessional);

            // Logic to anonymize other professionals' details
            const displayName =
              isProfessional && !isOwnMessage ? "Anonymous Professional" : message.user.name;

            console.log("Display Name:", displayName);

            const avatarSrc =
              isProfessional && !isOwnMessage ? "/default-anonymous.png" : message.user.image;

            console.log("Avatar Source:", avatarSrc);

            return (
              <Box className="custom-message" display="flex" alignItems="center">
                <Avatar src={avatarSrc} />
                <Typography marginLeft={1} fontWeight="bold">
                  {displayName}
                </Typography>
                <Typography marginLeft={2}>{message.text}</Typography>
              </Box>
            );
          }}
          noMessagesRenderer={() => <p>No messages to display</p>}
        />

        <MessageInput />
      </Channel>
    </Chat>
  );
};

export default StreamChatComponent;
