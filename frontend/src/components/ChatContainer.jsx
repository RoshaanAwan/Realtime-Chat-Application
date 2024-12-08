import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessagesInput from './MessagesInput';
import { formatMessageTime } from '../lib/utilis';

const ChatContainer = () => {
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null)
    const { messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();

    useEffect(() => {
        getMessages(selectedUser._id)

        subscribeToMessages()


        return () => unsubscribeToMessages()

    }, [selectedUser?._id, getMessages, unsubscribeToMessages, subscribeToMessages]);


    useEffect(() => {
        if (messageEndRef.current && messages) {

            messageEndRef.current.scrollIntoView({ behaviour: "smooth" })
        }
    }, [messages])

    if (isMessageLoading) return <div>Loading...</div>;

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic || "/avatar.jpg"
                                            : selectedUser.profilePic || "/avatar.jpg"
                                    }
                                    alt="Profile Pic"
                                    onError={(e) => { e.target.src = "/avatar.jpg"; }}
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className='text-xs opacity-50 ml-1'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img src={message.image} alt="Attachment" className='sm:max-w-[200px] rounded-md mb-2' />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessagesInput />
        </div>
    );
};

export default ChatContainer;
