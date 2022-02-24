import React, { useEffect } from "react";
import { Widget, addResponseMessage } from "react-chat-widget";

import "react-chat-widget/lib/styles.css";

function App() {
  useEffect(() => {
    addResponseMessage("Welcome to this awesome chat!");
  }, []);

  const handleNewMessage = (user, newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    addResponseMessage(user + " : " + newMessage);
  };

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewMessage}
        // handleTextInputChange={(e) => console.log(e.target.value)}
        handleSubmit={(text) => handleNewMessage("Me", text)}
      />
    </div>
  );
}

export default App;
