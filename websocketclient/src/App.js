import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Fragment, useState } from "react";

// Set up to listen on 8000
const client = new W3CWebSocket("ws://127.0.0.1:8000");

function App() {
  const [user, setUser] = useState({
    userName: "",
    loggedIn: false,
    messages: [{user:"ChatBot", msg:'Welcome to the chat!', type:'message'}],
  });
  const { userName, loggedIn, messages } = user;

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

  const handleClick = (e) => {
    e.preventDefault();
    client.send(
      JSON.stringify({
        type: "message",
        msg: userMessageInput,
        user: userName,
      })
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      userName: userNameInput,
      loggedIn: true,
      messages: [...messages]
    });
  };
  const handleLoginInput = (e) => {
    setUserName(e.target.value);
  };
  const handleUserMessageChange = (e) => {
    setUserMessageInput(e.target.value);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          {messages.map( message => <p>{message.msg}</p>)}
          <form onSubmit={(e) => handleClick(e)}>
            <input
              value={userMessageInput}
              onChange={(e) => handleUserMessageChange(e)}
            ></input>
            <button>Send</button>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={(e) => handleLogin(e)}>
            <input
              value={userNameInput}
              onChange={(e) => handleLoginInput(e)}
            ></input>
            <button>Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
