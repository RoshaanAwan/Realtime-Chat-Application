import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessagesInput from './MessagesInput';
import { formatMessageTime } from '../lib/utilis';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();

    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Track if user is at the bottom

    // Get messages and subscribe to new messages
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        }

        return () => {
            unsubscribeToMessages();
        };
    }, [selectedUser?._id, getMessages, unsubscribeToMessages, subscribeToMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Check if the user is at the bottom of the messages container
        if (scrollHeight - scrollTop === clientHeight) {
            setIsScrolledToBottom(true);
        } else {
            setIsScrolledToBottom(false);
        }
    };

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessagesInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div
                className='flex-1 overflow-y-auto p-4 space-y-4'
                onScroll={handleScroll}
            >
                {messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
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

                {/* This div ensures we always scroll to the bottom when new messages arrive */}
                <div ref={messageEndRef}></div>
            </div>

            <MessagesInput />
        </div>
    );
};

export default ChatContainer;
