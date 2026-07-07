import { useState, useEffect } from "react";

export default function EmptyState() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://catfact.ninja/fact");
      const data = await res.json();
      setFact(data.fact);
    } catch (err) {
      setFact("Could not load cat fact. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div className="empty-state">
      <div className="empty-icon">🐱</div>
      <p className="empty-text">Select a note or create a new one</p>
      {fact && (
        <div className="cat-fact-card">
          <p className="cat-fact-text">{loading ? "Fetching fact…" : fact}</p>
          <button className="cat-fact-btn" onClick={fetchFact} disabled={loading}>
            {loading ? "Loading…" : "New Fact"}
          </button>
        </div>
      )}
    </div>
  );
}