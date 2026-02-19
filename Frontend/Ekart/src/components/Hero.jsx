import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import img1 from "../assets/pic1.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Hero = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messes, setMesses] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const rew = async () => {
    if (!messes.trim()) return;

    const userMessage = {
      sender: "user",
      text: messes,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMesses("");
    setLoading(true);

    try {
      const resp = await axios.post(
        "https://shopping-ekart-backend.onrender.com/api/v1/user/ai",
        { messes: userMessage.text }
      );

      const botMessage = {
        sender: "bot",
        text: resp.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 relative">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SECTION */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Latest Electronics at Best Prices
          </h1>

          <p className="text-lg md:text-xl mb-6 text-blue-100">
            Discover cutting-edge technology with unbeatable deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/products")}
              className="bg-white text-blue-600"
            >
              Shop Now
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="border-white text-white bg-transparent"
            >
              View Deals
            </Button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center p-10">
          <img
            src={img1}
            alt="Electronics"
            className="w-[300px] md:w-[500px] h-[450px] md:h-[500px] rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* FLOATING CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Chat Icon */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full cursor-pointer shadow-lg hover:scale-110 transition"
          >
            🤖
          </div>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <h3 className="font-semibold">AI Assistant</h3>
              <button onClick={() => setIsOpen(false)}>✖</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50 flex flex-col">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[75%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-black self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-gray-200 text-black p-2 rounded-lg text-sm self-start">
                  Thinking...
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={messes}
                onChange={(e) => setMesses(e.target.value)}
                placeholder="Ask about any product..."
                className="flex-1 border rounded px-2 py-1 text-sm text-gray-700"
                onKeyDown={(e) => e.key === "Enter" && rew()}
              />

              <button
                onClick={rew}
                className="bg-blue-600 text-white px-3 rounded text-sm"
              >
                Send
              </button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
