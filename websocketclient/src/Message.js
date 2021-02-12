import React from 'react'

export const Message = ({message: {user, msg}, userName}) => {
    let alignment = "message alignLeft"
    if(userName === user) alignment = "message alignRight" 
    if(user === "ChatBot") alignment="message alignMiddle" 
    return (
        <div className={alignment}>
            <p style={{fontSize:".8rem"}}>{user}</p>
            <div className="message-container">
            <p className="wrap">{msg}</p>
            </div>
        </div>
    )
}
