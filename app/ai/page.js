"use client";

import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/ai/analyze",
        null,
        {
          params: { query },
        }
      );

      setResponse(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🎤 Voice Input Function
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);

      // 🔥 optional auto search
      // handleSearch();
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        AI Movie Analytics
      </h1>

      {/* Input Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Ask something like: Analyze Interstellar"
          className="border p-3 w-full rounded shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleVoiceInput}
          className="bg-gray-700 text-white px-4 rounded"
        >
          🎤
        </button>

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      {/* Listening Indicator */}
      {listening && (
        <p className="text-red-500 mb-4">🎙 Listening...</p>
      )}

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Analytics Output */}
      {response && response.data && (
        <div className="bg-white p-6 rounded-xl shadow space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                {response.data.title}
              </h2>
              <p className="text-gray-500">
                {response.data.genre} • {response.data.year}
              </p>
            </div>

            <span className="text-sm px-3 py-1 bg-gray-200 rounded">
              {response.source}
            </span>
          </div>

          {/* AI Warning */}
          {response.source === "ai_generated" && (
            <p className="text-red-500 text-sm">
              ⚠ AI Estimated Data
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-semibold">
                ${response.data.budget?.toLocaleString?.() || 0}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="font-semibold">
                ${response.data.revenue?.toLocaleString?.() || 0}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-semibold">
                {response.data.rating}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-semibold">
                {response.data.year}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: response.data.title,
                    budget: response.data.budget,
                    revenue: response.data.revenue,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Bar */}
          <div>
            <p className="font-medium mb-2">Rating</p>
            <div className="w-full bg-gray-200 rounded h-4">
              <div
                className="bg-yellow-400 h-4 rounded"
                style={{
                  width: `${(response.data.rating || 0) * 10}%`,
                }}
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}