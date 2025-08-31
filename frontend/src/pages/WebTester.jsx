<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import { Loader2, FlaskConical, Trash2, FileText } from "lucide-react";
import Button from "../components/Button" 
export default function WebTester() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [takeScreenshots, setTakeScreenshots] = useState(true);
  const [parsed, setParsed] = useState(null);
  const [rawModel, setRawModel] = useState(null);
  const [toast, setToast] = useState(null);

  const api = useMemo(
    () => ({
      testCommand: async (text) => {
        const res = await fetch("/api/test-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      execute: async (text, options = {}) => {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text,
            take_screenshots: options.takeScreenshots ?? true,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      executeDirect: async (payload) => {
        const res = await fetch("/api/execute-direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      getHistory: async () => {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
      health: async () => {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      },
    }),
    []
  );

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistory(data?.history ?? []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
    api.health().catch(() => { });
  }, []);

  const quickActions = [
    { label: "🔍 Search for BMW", cmd: "search for BMW car" },
    { label: "📋 Fill Van Booking Form", cmd: "fill booking form for van" },
    { label: "💰 Check SUV Pricing", cmd: "check SUV pricing" },
    { label: "🚙 View Luxury Car Details", cmd: "check luxury car details" },
    { label: "📞 Test Contact Links", cmd: "test contact links" },
    { label: "✅ Submit Booking", cmd: "submit booking" },
    { label: "🔄 Reset Form", cmd: "reset form" },
  ];

  const onTest = async () => {
    if (!prompt.trim()) {
      setToast({ type: "error", msg: "Please enter a command!" });
      return;
    }
    setTesting(true);
    setParsed(null);
    setRawModel(null);
    try {
      const { raw_output, parsed_instruction } = await api.testCommand(prompt);
      setParsed(parsed_instruction);
      setRawModel(raw_output);
      setToast({ type: "success", msg: "Command parsed successfully!" });
    } catch (e) {
      setToast({ type: "error", msg: `Test failed: ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  const onExecute = async () => {
    if (!prompt.trim()) {
      setToast({ type: "error", msg: "Please enter a command!" });
      return;
    }
    setLoading(true);
    setCurrentAction(prompt);
    try {
      const data = await api.execute(prompt, { takeScreenshots });
      if (data?.screenshot_b64) {
        setScreenshots((prev) =>
          [
            ...prev,
            {
              image: data.screenshot_b64,
              action: data?.parsed_action?.action ?? "unknown",
              timestamp: new Date().toLocaleTimeString(),
            },
          ].slice(-10)
        );
      }
      await loadHistory();
      setToast({
        type: "success",
        msg: data?.result || "Automation completed",
      });
    } catch (e) {
      setToast({ type: "error", msg: `Automation error: ${e.message}` });
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };

  const onClear = async () => {
    try {
      await fetch("/api/clear-history", { method: "POST" });
    } catch { }
    setHistory([]);
    setScreenshots([]);
    setToast({ type: "success", msg: "History cleared!" });
  };

  const onFillCustom = async (form) => {
    setLoading(true);
    setCurrentAction("Direct custom action");
    try {
      const payload = {
        action: "fill_booking_form",
        form_data: form,
      };
      const data = await api.executeDirect(payload);
      if (data?.screenshot_b64) {
        setScreenshots((prev) =>
          [
            ...prev,
            {
              image: data.screenshot_b64,
              action: payload.action,
              timestamp: new Date().toLocaleTimeString(),
            },
          ].slice(-10)
        );
      }
      await loadHistory();
      setToast({ type: "success", msg: data?.result || "Action completed" });
    } catch (e) {
      setToast({ type: "error", msg: `Action error: ${e.message}` });
    } finally {
      setLoading(false);
      setCurrentAction(null);
=======
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
>>>>>>> 924bd47bb92d50694c2e5d84c1eb9b279d77295f
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <header className="text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center mt-12">
          <h1 className="text-4xl font-extrabold">
            🚗 Car Rental{" "}
            <span className="text-p3">Automation Tool</span>
          </h1>
          <p className="opacity-90 mt-2">
            Automate your car rental website testing with natural language commands
          </p>
          <span className="inline-block mt-4 px-4 py-1 text-sm rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300">
            🔧 Testing:{" "}
            <a
              href="https://automationdemo.vercel.app/"
              className="underline hover:text-indigo-200"
            >
              automationdemo.vercel.app
            </a>
          </span>
        </div>
      </header>


      <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <section className="md:col-span-2 space-y-6">
          <div className="bg-s3 border border-indigo-700 shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">🎤 Natural Language Input</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'fill booking form for van', 'search for BMW', 'check SUV pricing'"
              rows={5}
              className="w-full rounded-xl border border-indigo-600 bg-gray-800 text-white p-3 focus:outline-none focus:ring focus:ring-indigo-400"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <Button onClick={onExecute} disabled={loading} icon="/images/zap.svg">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...
                  </span>
                ) : (
                  "Execute Automation"
                )}
              </Button>

              <Button onClick={onTest} disabled={testing} icon={<FlaskConical />}>
                {testing ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...
                  </span>
                ) : (

                  "Test Command"

                )}
              </Button>

              <Button onClick={onClear} icon={<Trash2 />}>
                Clear History
              </Button>
            </div>

            {currentAction && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-900/40 border border-indigo-500 text-white">
                <strong>🔄 Current Action:</strong> {currentAction}
              </div>
            )}

            {(parsed || rawModel) && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-800 rounded-xl p-3 border border-indigo-700">
                  <p className="font-semibold mb-2">Raw Model Output</p>
                  <pre className="text-xs overflow-auto text-indigo-200">
                    {rawModel}
                  </pre>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 border border-indigo-700">
                  <p className="font-semibold mb-2">Parsed Instruction</p>
                  <pre className="text-xs overflow-auto text-indigo-200">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <AdvancedForm onSubmit={onFillCustom} />

          <div className="bg-s3 border border-indigo-700 shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3">📋 Automation History</h2>
            {history?.length ? (
              <ul className="space-y-3">
                {[...history].reverse().slice(0, 10).map((h, idx) => (
                  <li key={idx} className="border border-indigo-700 rounded-xl p-3 bg-gray-800">
                    <details>
                      <summary className="cursor-pointer select-none text-indigo-200">
                        <span className="text-sm opacity-70 mr-2">
                          {h.timestamp}
                        </span>
                        <span className="font-medium">{h.command}</span>
                      </summary>
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm font-medium">Command</p>
                          <pre className="bg-black p-2 rounded border text-xs overflow-auto">
                            {h.command}
                          </pre>
                          <p className="text-sm font-medium mt-2">Status</p>
                          {h.status === "success" ? (
                            <div className="text-sm text-green-300 bg-green-900/40 border border-green-500 rounded p-2">
                              ✅ {h.result}
                            </div>
                          ) : (
                            <div className="text-sm text-red-300 bg-red-900/40 border border-red-500 rounded p-2">
                              ❌ {h.result}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Parsed Action</p>
                          <pre className="bg-black p-2 rounded border text-xs overflow-auto">
                            {h.parsed_action
                              ? JSON.stringify(h.parsed_action, null, 2)
                              : "No parsed action"}
                          </pre>
                          {h.screenshot_b64 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">
                                Screenshot
                              </p>
                              <img
                                src={`data:image/png;base64,${h.screenshot_b64}`}
                                alt="screenshot"
                                className="rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 rounded-xl bg-gray-800 border border-indigo-700">
                📝 No automation history yet. Try running some commands!
              </div>
            )}
          </div>
        </section>

        {/* Right Column */}
        <aside className="space-y-6">
          <div className="bg-s3 border border-indigo-700 shadow-lg rounded-2xl p-6">
            <h2 className="text-lg font-semibold">🎯 Quick Actions</h2>
            <div className="grid gap-2 mt-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => setPrompt(qa.cmd)}
                  className="text-left px-3 py-2 rounded-xl border border-indigo-600 bg-gray-800 hover:bg-gray-700 text-indigo-200"
                >
                  {qa.label}
                </button>
              ))}
            </div>
            <div className="border-t border-indigo-700 mt-4 pt-4">
              <h3 className="font-medium">⚙️ Settings</h3>
              <p className="text-sm text-indigo-200 mt-1">
                🔧 Browser runs in visible mode for demo purposes
              </p>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={takeScreenshots}
                  onChange={(e) => setTakeScreenshots(e.target.checked)}
                />
                <span>Take Screenshots</span>
              </label>
            </div>

            <div className="border-t border-indigo-700 mt-4 pt-4">
              <details>
                <summary className="font-medium cursor-pointer">
                  📖 Available Actions
                </summary>
                <div className="text-sm text-indigo-200 mt-2 space-y-1">
                  <div>
                    <p className="font-semibold">Search Actions:</p>
                    <ul className="list-disc ml-5">
                      <li>"search for BMW"</li>
                      <li>"find luxury cars"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Navigation:</p>
                    <ul className="list-disc ml-5">
                      <li>"go to cars section"</li>
                      <li>"navigate to pricing"</li>
                      <li>"open booking form"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Form Actions:</p>
                    <ul className="list-disc ml-5">
                      <li>"fill booking form for van"</li>
                      <li>"submit booking"</li>
                      <li>"reset form"</li>
                      <li>"validate empty form"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Information:</p>
                    <ul className="list-disc ml-5">
                      <li>"check SUV pricing"</li>
                      <li>"check luxury car details"</li>
                      <li>"test contact links"</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="bg-s3 border border-indigo-700 shadow-lg rounded-2xl p-6">
            <h2 className="text-lg font-semibold">📊 Status & Screenshots</h2>
            {screenshots?.length ? (
              <div className="space-y-2 mt-2">
                {[...screenshots].reverse().slice(0, 3).map((s, i) => (
                  <figure key={i}>
                    <img
                      src={`data:image/png;base64,${s.image}`}
                      alt="screenshot"
                      className="rounded-xl border border-indigo-700"
                    />
                    <figcaption className="text-xs text-indigo-200 mt-1">
                      {s.timestamp} - {s.action}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-gray-800 border border-indigo-700">
                📸 Screenshots will appear here after running automation
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-center text-indigo-300">
        <hr className="mb-4 border-indigo-700" />
        🚗 Car Rental Automation Tool | Powered by Playwright & Ollama tinyllama
      </footer>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl shadow border text-sm ${toast.type === "error"
              ? "bg-red-900 border-red-500 text-red-300"
              : "bg-green-900 border-green-500 text-green-300"
            }`}
          onAnimationEnd={() => setTimeout(() => setToast(null), 2500)}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function AdvancedForm({ onSubmit }) {
  const [name, setName] = useState("Keerthana");
  const [email, setEmail] = useState("keer@example.com");
  const [carType, setCarType] = useState("VAN");
  const [start, setStart] = useState("2025-08-01");
  const [end, setEnd] = useState("2025-08-07");
  const [cdw, setCdw] = useState(true);
  const [terms, setTerms] = useState(true);

  return (
    <div className="bg-s3 border border-indigo-700 text-indigo-200 shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-3">🔧 Advanced Booking Form</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="w-full border border-indigo-600 rounded-xl p-2 bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border border-indigo-600 rounded-xl p-2 bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Car Type</label>
          <select
            className="w-full border border-indigo-600 rounded-xl p-2 bg-gray-800 text-white"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          >
            <option>VAN</option>
            <option>SUV</option>
            <option>Luxury</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border border-indigo-600 rounded-xl p-2 bg-gray-800 text-white"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              className="w-full border border-indigo-600 rounded-xl p-2 bg-gray-800 text-white"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={cdw}
            onChange={(e) => setCdw(e.target.checked)}
          />
          <span>CDW Insurance</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
          <span>Accept Terms</span>
        </div>
      </div>
      <Button
        onClick={() =>
          onSubmit({
            name,
            email,
            car_type: carType,
            start_date: start,
            end_date: end,
            cdw,
            terms,
          })
        }
        icon={<FileText />}
      >
        Fill Custom Booking Form
      </Button>
    </div>
  );
}
=======
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
>>>>>>> 924bd47bb92d50694c2e5d84c1eb9b279d77295f
