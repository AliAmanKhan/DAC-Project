import React, { useState } from "react";
import { Send, Search, Pin, Archive, MoreVertical, ChevronLeft } from "lucide-react";

export default function Messages() {
  const [conversations] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "Great! I'll have the design mockups ready by Friday",
      timestamp: "2 hours ago",
      unread: 0,
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Project Team",
      lastMessage: "Bob: The API is now live on staging",
      timestamp: "5 hours ago",
      unread: 3,
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Carol White",
      lastMessage: "Can we discuss the design review?",
      timestamp: "1 day ago",
      unread: 0,
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Brown",
      lastMessage: "Thanks for the feedback on the proposal",
      timestamp: "2 days ago",
      unread: 0,
      avatar: "/placeholder.svg",
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Johnson",
      content: "Hey! How's the project going?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "It's going great! We're almost done with the MVP",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Alice Johnson",
      content: "Great! I'll have the design mockups ready by Friday",
      timestamp: "10:35 AM",
      isOwn: false,
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [showConversations, setShowConversations] = useState(true);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground text-lg">
            Chat with your team and collaborators
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-0 sm:px-0 py-0">
        <div className="flex gap-0 h-[calc(100vh-180px)] md:h-[calc(100vh-220px)] relative bg-slate-950">
          {/* Mobile Overlay */}
          {showConversations && (
            <div
              className="md:hidden fixed inset-0 bg-black/70 z-30"
              onClick={() => setShowConversations(false)}
            />
          )}

          {/* Conversations List */}
          <div
            className={`${
              showConversations ? "flex z-40" : "hidden"
            } md:flex md:z-auto w-full md:w-80 bg-slate-900 border-r border-border overflow-hidden flex-col fixed md:relative inset-0 md:inset-auto`}
          >
            {/* Search */}
            <div className="p-4 border-b border-border bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto bg-card">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setShowConversations(false);
                  }}
                  className={`w-full px-4 py-4 border-b border-border hover:bg-primary/5 transition text-left ${
                    selectedConversation.id === conversation.id
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full bg-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {conversation.name}
                        </h3>
                        {conversation.unread > 0 && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-slate-950 border-l border-border flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-border flex items-center justify-between gap-4 bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setShowConversations(true)}
                  className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="font-bold truncate">{selectedConversation.name}</h2>
                  <p className="text-sm text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition hidden sm:block">
                  <Pin className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition hidden sm:block">
                  <Archive className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-slate-950">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"} gap-1`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-sm break-words border ${
                        message.isOwn
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-slate-800 text-white border-slate-700"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p
                      className={`text-xs px-2 ${
                        message.isOwn
                          ? "text-slate-400"
                          : "text-slate-400"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 md:p-6 border-t border-border bg-slate-900">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition text-sm"
                />
                <button
                  type="submit"
                  className="px-4 md:px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition flex items-center gap-2 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
