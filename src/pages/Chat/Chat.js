import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Message from "../../components/Message/Message";
import styles from "./Chat.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import { useMutation, useSubscription, gql } from "@apollo/client";
import { IconButton } from "@mui/material";
import UserContext from "../../components/context/user-context";

const Chat = () => {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const bottomRef = useRef(null);

  const updateInputValue = (e) => {
    setTextInput(e.target.value);
  };

  const MESSAGE_CREATED = gql`
    subscription Subscription {
      messageCreated {
        message
        author {
          avatar
          id
          username
        }
        id
      }
    }
  `;

  const POST_MESSAGE = gql`
    mutation PostMessage($input: postMessageInput) {
      postMessage(input: $input) {
        author {
          avatar
          id
          username
        }
        message
        success
        id
      }
    }
  `;

  const { data, loading } = useSubscription(MESSAGE_CREATED, {
    onSubscriptionData: (data) => {
      const message = data.subscriptionData.data.messageCreated;
      setMessages((prev) => {
        return [...prev, message];
      });
    },
  });

  const [mutateFunction, { loading: loading123, error }] =
    useMutation(POST_MESSAGE);

  const submitForm = async (e) => {
    e.preventDefault();

    await mutateFunction({
      variables: {
        input: {
          id: user.id,
          author: user.username,
          message: textInput,
        },
      },
    });

    setTextInput("");
  };

  const enterKeySubmit = e => {
    if (e.key === "Enter") {
      submitForm(e)
    }
  }

  //Scroll to bottom of chat every time a new message pops
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <Box component="form" onSubmit={submitForm}>
        <Paper elevation={1} style={{ maxHeight: "800px", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="flex-end"
            style={{ minHeight: "100vh" }}
          >
            {messages.map((message) => {
              return <Message message={message} key={message.id}/>;
            })}
            <div ref={bottomRef} />
          </Grid>
        </Paper>
        <Grid
          sx={{ marginTop: "5px" }}
          container
          direction="row"
          alignItems="center"
          alignContent="center"
        >
          <Grid item lg={10}>
            <TextField
              multiline
              placeholder="Type a message..."
              name="text"
              onChange={updateInputValue}
              onKeyDown={enterKeySubmit}
              value={textInput}
              sx={{
                backgroundColor: "#f2f3f5",
              }}
              fullWidth
            />
          </Grid>
          <Grid item lg={2}>
            {textInput.trim().length ? (
              <IconButton type="submit" className={styles.Chat_send_button}>
                <SendIcon color="primary" alignself="center" />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Chat;
