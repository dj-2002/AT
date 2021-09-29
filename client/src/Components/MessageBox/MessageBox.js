import react, { Component, useEffect, useRef, useState } from "react";
import "./MessageBox.css"




const MessageBox = ({socket}) => {

    const messages = useRef()
    const [inputText,setInputText] = useState("")

    useEffect(()=>{
        socket.on("message",(data)=>{
            // console.log("message : ",data.messageText)
            addMessageToMessageBox(data.messageText)
            // remaining class name
            
        })

        // inputBox.current.
    },[])

    function addMessageToMessageBox(messageText){
        var div = document.createElement('div')
        div.innerHTML = (messageText)
        div.classList.add("message")
        
        messages.current.append(div)
    }

    function handleKeyInput(event){
        // console.log("handle input ",inputText)
        if(event.keyCode === 13){//enter
            // console.log("enter after",inputText)
            socket.emit('newMessage',{
                messageText : inputText
            })
            addMessageToMessageBox(inputText)
            setInputText("")
        }
    }
    function handleInputChange(event){
        setInputText(event.target.value)
    }



  return (
    
    <div className="main__right">
            <div className="main__header">
                <h6>Chat</h6>
            </div>
            <div className="main__chat_window">
                <ul className="messages" ref={messages}>
                    {/* <div className="message">hi hello!</div> */}
                </ul>

            </div>
            <div className="main__message_container">
                <input id="chat_message" value={inputText} type="text" placeholder="Type message here..." onChange={handleInputChange} onKeyUp={handleKeyInput}/>
            </div>
        </div>
        
   
  );
};
export default MessageBox;
