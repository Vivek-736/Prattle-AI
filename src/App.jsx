/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ReactLoading from "react-loading";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBotResponse = async (userInput) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA09Heo4lvW8gxAib3i8QaYihnkW9ZzgTI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const botResponse =
      data.candidates[0]?.content?.parts[0]?.text || "No response";
    return botResponse;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    const botResponse = await fetchBotResponse(input);
    const botMessage = { sender: "bot", text: botResponse };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white p-4"
      style={{ backgroundImage: "url('/img.jpg')" }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-700 shadow-black">
        Ask Me Anything
      </h1>
      <div className="w-full max-w-3xl bg-white text-black rounded-lg shadow-lg p-6 flex flex-col gap-4 h-screen md:h-auto md:rounded-2xl">
        <div className="h-full overflow-y-auto flex-grow p-4 bg-gray-100 rounded-lg shadow-inner">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-sm p-3 my-2 rounded-xl shadow-md ${
                message.sender === "user"
                  ? "bg-blue-500 text-white ml-auto text-right"
                  : "bg-gray-300 text-black mr-auto text-left"
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center justify-center mt-4">
              <ReactLoading
                type="bubbles"
                color="#4F46E5"
                height={50}
                width={50}
              />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-indigo-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-r-lg transition duration-300"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
