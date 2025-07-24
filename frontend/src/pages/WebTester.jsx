import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../components/Button";

const WebTester = () => {
  const [instruction, setInstruction] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/run-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, url: website }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-960 mx-auto border-l border-r border-s2 bg-s1/50 pb-20 pt-28 max-xl:max-w-4xl max-lg:border-none max-md:pb-32 max-md:pt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-p3">
          🧪 AI-Powered Web Test Dashboard
        </h1>
        <p className="text-center text-indigo-200 mb-6">
          Describe what to test and provide the website URL.
        </p>

        <div className="bg-s3 rounded-xl shadow-lg mb-6 p-6 border border-indigo-700">
          <input
            type="text"
            placeholder="e.g., Test login with invalid password"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full mb-4 p-3 border border-indigo-600 bg-gray-800 text-white rounded-md"
          />
          <input
            type="text"
            placeholder="Enter website URL to test"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full mb-6 p-3 border border-indigo-600 bg-gray-800 text-white rounded-md"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            icon="/images/zap.svg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Test...
              </span>
            ) : (
              "Run Test"
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-700 border border-red-500 text-white p-4 rounded-md mb-4">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-green-500">
            <h2 className="text-2xl font-semibold mb-3 text-green-300">✅ Test Results</h2>
            <p className="mb-2"><strong>Status:</strong> {result.status}</p>
            <p className="mb-4"><strong>Details:</strong> {result.message}</p>
            {result.screenshot && (
              <div className="mt-4">
                <img
                  src={`data:image/png;base64,${result.screenshot}`}
                  alt="Screenshot"
                  className="rounded-md border shadow-md max-w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebTester;
