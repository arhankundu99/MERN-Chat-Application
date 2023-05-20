import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'

const ScrollableChat = ({ messages, loggedInUser }) => {

    return (
        <div style={{ overflowX: "hidden", overflowY: "auto" }}>
            {messages && messages.map((message, index) => {
                return (
                    <div style={{ display: 'flex' }} key={message._id}>
                        <span

                            style={{
                                backgroundColor: message.sender._id !== loggedInUser._id ? "#BEE3F8" : "#B9F5D0",
                                marginLeft: message.sender._id != loggedInUser._id ?33: 'auto',
                                marginTop: message.sender._id === loggedInUser._id  ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {message.content}
                        </span>


                    </div>
                )
            })}
        </div>
    )
}

export default ScrollableChat
