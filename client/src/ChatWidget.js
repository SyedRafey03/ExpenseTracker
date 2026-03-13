import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

const ChatWidget = ({ transactions, budgetLimit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm your AI Financial Assistant. Ask me anything about your budget, expenses, or income!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/chat', {
                message: userMsg,
                transactions,
                budgetLimit
            });

            setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'ai', content: "Oops, something went wrong connecting to the AI. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="chat-toggle-btn"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window card">
                    <div className="chat-header">
                        <h3>Finance AI</h3>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role}`}>
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message ai">
                                <div className="message-bubble typing">
                                    <Loader2 className="spinner" size={16} /> Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about your finances..."
                            rows="1"
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatWidget;
