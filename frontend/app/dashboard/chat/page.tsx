'use client'

import { Navigation } from "@/components/dashboard/navigation";
import Markdown from "@/components/markdown";
import axios from "axios";
import { BotMessageSquare, Loader, Send, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    sender: string;
    text: string;
    isLoading: boolean;
    details: string[];
}

const Page = () => {
    const fields = [
        "HubSpot",
        "Jira",
        "Mailchimp",
        "Pipedrive",
        "Salesforce",
        "Slack",
    ];

    const colors = [
        "#00C000",
        "#00C0C0",
        "#C0C000",
        "#C0C0C0",
        "#808080",
        "#C000C0",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
        "#008080",
        "#C0C0C0",
        "#000080",
        "#0000C0",
    ];

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [expandedMessageIndex, setExpandedMessageIndex] = useState<number | null>(null); // Track which message is expanded

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const apiKey = localStorage.getItem('integry-api');

        if (!apiKey) {
            window.location.href = '/dashboard/credentials';
        }
    }, []);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleMessageDetail = (index: number) => {
        if (expandedMessageIndex === index) {
            setExpandedMessageIndex(null); // Close the message if it is already open
        } else {
            setExpandedMessageIndex(index); // Open the clicked message
        }
    };

    const handleSendMessage = async () => {

        if (inputValue.trim() !== "") {
            const newMessage = {
                sender: "User",
                text: inputValue,
                isLoading: true,
                details: ""
            };
            setInputValue("");
            const updatedMessages = [...messages, {
                sender: "User",
                text: inputValue,
                isLoading: false,
                details: []
            }, {
                sender: "assistant",
                text: '',
                isLoading: true,
                details: []
            }];
            setMessages(updatedMessages);
            const filterUserMessages = updatedMessages.filter(message => message.sender === 'User')
            const storedData = JSON.parse(localStorage.getItem("integry-api") || "{}");
            const updatedPromptCount = storedData.promptscount ? storedData.promptscount + 1 : 1;

            const newLocalStorageData = {
                ...storedData,
                promptscount: updatedPromptCount,
                messages: filterUserMessages.slice(-3),
            };

            localStorage.setItem("integry-api", JSON.stringify(newLocalStorageData));


            await axios.post(`http://localhost:5000/get-details`, {
                userId: storedData.userId,
                appKey: storedData.appKey,
                apiKey: storedData.apiKey,
                message: newMessage.text
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                console.log(res.data)
                const assistantMessage = {
                    sender: "assistant",
                    text: res.data.messages,  // The simple message from the response
                    isLoading: false,
                    details: res.data.detailsResponse.messages  // Detailed response from the assistant
                }
                console.log(assistantMessage)

                const tempMessages = [...updatedMessages.slice(0, -1), assistantMessage]
                setMessages(tempMessages)

            }).catch(err => { //eslint-disable-line
            })
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
            <Navigation />
            <main className="flex-1 p-4">
                {!messages.length ? (
                    <div className="w-full flex flex-col min-h-[500px] justify-center items-center  px-3">
                        <h1 className="text-3xl font-semibold">How can I help with?</h1>
                        <div className="relative max-w-[700px] w-full mt-6">
                            <input
                                type="text"
                                placeholder="Message Langchain Integry Bot"
                                style={{ border: "2px solid #777" }}
                                className="w-full bg-[#F1F1F1] h-[60px] text-black outline-[#ccc] px-4 rounded-xl pr-12"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <div
                                style={{ backgroundColor: "#000", padding: "6px" }}
                                className={`rounded-full absolute right-2 bottom-2 cursor-pointer hover:opacity-70 ${inputValue.trim() !== "" ? "bg-blue-500" : "bg-gray-600"
                                    }`}
                                onClick={handleSendMessage}
                            >
                                <Send className="text-white" size={17} />
                            </div>
                        </div>
                        <p className="h-[60px] text-[#111] leading-6 w-[600px] mt-5 text-center outline-[#ccc] px-4 rounded-xl pr-12">The Integry Langchain Bot supports over 300 tools, streamlining integration and reducing developer effort for AI-driven products and SaaS.</p>
                        <div className="flex flex-wrap justify-center items-center mt-4 max-w-[500px] gap-5">
                            {fields.map((field, index) => (
                                <div
                                    key={field}
                                    style={{
                                        border: `1px solid ${colors[index]
                                            }`,
                                    }}
                                    className="px-4 py-1 rounded-full"
                                >
                                    <span>{field}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col min-h-[94vh] max-h-[94vh] overflow-y-auto max-w-[800px] mx-auto px-4">
                        <div className="flex-1 overflow-x-hidden scrollable max-h-[500px] pt-5">
                            {messages?.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-6 flex items-center ${message.sender === "User" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.sender === "assistant" && (
                                        <div className="mr-2 p-2 rounded-full" style={{ border: "1px solid #ccc", }}>
                                            <BotMessageSquare size={15} />
                                        </div>
                                    )}
                                    <div
                                        className={`inline-block p-3 max-w-[80%] rounded-lg ${message.sender === "User"
                                            ? "bg-blue-400 text-white"
                                            : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {
                                            message.isLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <Loader className="animate-spin" size={16} />
                                                    <span>Generating...</span>
                                                </div>
                                            ) : (
                                                <div>
                                                    {
                                                        message.sender === 'user' ? (
                                                            message.text
                                                        ) : (
                                                            <div>
                                                                {message.details && message.details.length > 0 && (
                                                                    <div>
                                                                        <span
                                                                            className="cursor-pointer text-blue-500 text-sm"
                                                                            onClick={() => toggleMessageDetail(index)}
                                                                        >
                                                                            {expandedMessageIndex === index ? "Hide details" : "Show details"}
                                                                        </span>

                                                                        {expandedMessageIndex === index && (
                                                                            <div
                                                                                className="mt-2 p-4 bg-gray-800 text-white rounded-md mb-2"
                                                                                style={{ backgroundColor: '#333' }}
                                                                            >
                                                                                <ul>
                                                                                    {message.details.map((detail, idx) => (
                                                                                        <li key={idx} className="text-sm">{detail}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {
                                                                    message.sender == 'user' ? (message.text) : <Markdown markdown={message.text} />
                                                                }

                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                    {message.sender === "User" && (
                                        <div className="ml-2 p-2 rounded-full" style={{ border: "1px solid #ccc", }}>
                                            <User size={15} />
                                        </div>
                                    )}

                                </div>
                            ))}
                            <div ref={chatEndRef} />

                        </div>
                        <div className="relative w-full mt-4">
                            <input
                                type="text"
                                placeholder="Message Integry Langchain Bot"
                                style={{ border: "2px solid #777" }}
                                className="w-full bg-[#F1F1F1] h-[60px] text-black outline-[#ccc] px-4 rounded-xl pr-12"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <div
                                style={{ backgroundColor: "#000", padding: "6px" }}
                                className={`rounded-full absolute right-2 bottom-2 cursor-pointer hover:opacity-70 ${inputValue.trim() !== "" ? "bg-blue-500" : "bg-gray-600"
                                    }`}
                                onClick={handleSendMessage}
                            >
                                <Send className="text-white" size={17} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Page;