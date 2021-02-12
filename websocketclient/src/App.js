import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Fragment, useState, useEffect, useRef } from "react";
import {Message} from './Message'
import {Button, TextField} from '@material-ui/core'

// Set up to listen on 8000
const client = new W3CWebSocket("ws://127.0.0.1:8000");

function App() {
  const [user, setUser] = useState({
    userName: "",
    loggedIn: false,
    messages: [{user:"ChatBot", msg:'Welcome to the chat!', type:'message'}],
  });
  const { userName, loggedIn, messages } = user;
  const [loginButton, setLoginButton] = useState("Login")
  const [userMessageInput, setUserMessageInput] = useState("");
  const [userNameInput, setUserName] = useState("");

  client.onopen = () => {
    console.log("Websocket Client Connected");
  };
  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    // console.log("Got Reply", dataFromServer);
    if (dataFromServer.type === "message") {
      setUser({
        ...user,
        messages: [...messages,dataFromServer],
      });
    }
  };
  //Send message
  const handleClick = (e) => {
    e.preventDefault();
    if(userMessageInput !== ""){
      client.send(
        JSON.stringify({
          type: "message",
          msg: userMessageInput,
          user: userName,
        })
      );
      setUserMessageInput("")
      // scrollToBottom()
    }

  };

  const handleLogin = (e) => {
    e.preventDefault();
    if(userNameInput === ""){
      setLoginButton("Username required")
      setTimeout(() => {
        setLoginButton("Login")
      },2000)
    } else{
      setUser({
        userName: userNameInput,
        loggedIn: true,
        messages: [...messages]
      });
      client.send(
        JSON.stringify({
          type: "message",
          msg: `${userNameInput} has entered the chat!`,
          user: "ChatBot",
        })
      );
    }
  };
  const handleLoginInput = (e) => {
    setUserName(e.target.value);
  };
  const handleUserMessageChange = (e) => {
    setUserMessageInput(e.target.value);
  };

  //Scroll to bottom on new message
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <div className="main-container">
      {loggedIn ? (
        <Fragment>
        <div className="chat-container">
          {messages.map( message => <Message userName={userName} message={message} />)}
          <div ref={messagesEndRef} />
        </div>
          <form onSubmit={(e) => handleClick(e)} className="chat-form" >
            <TextField
            className="chat-input"
            variant="outlined"
              value={userMessageInput}
              onChange={(e) => handleUserMessageChange(e)}
            ></TextField>
            <Button className="chat-button" onClick={(e) => handleClick(e)}>Send</Button>
          </form>
          </Fragment>
      ) : (
        <div className="login-form">
          <form onSubmit={(e) => handleLogin(e)}>
            <TextField
             label="Username"
             variant="outlined"
              value={userNameInput}
              onChange={(e) => handleLoginInput(e)}
            ></TextField>
            <br/>
            <Button color="primary" onClick={(e) => handleLogin(e)} className="button">{loginButton}</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
