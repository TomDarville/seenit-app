import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Share2, Award, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback Backend Routing context for Alpha
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Automatically Seed Database and Authenticate a test account during Alpha phase
    fetch(`${API_BASE}/api/alpha-seed`)
      .then(res => {
        if (!res.ok) throw new Error("API Network error");
        return res.json();
      })
      .then(data => {
        if (!data || !data.userId) throw new Error("Invalid seed data response");
        setUserId(data.userId);
        return Promise.all([
          fetch(`${API_BASE}/api/profile/${data.userId}`).then(r => r.json()),
          fetch(`${API_BASE}/api/history/${data.userId}`).then(r => r.json())
        ]);
      })
      .then(([profData, histData]) => {
        setProfile(profData);
        // Safety Guard: Force history to be an array if backend returns something else
        setHistory(Array.isArray(histData) ? histData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend error: Verify your Render backend settings.", err);
        setLoading(false);
      });
  }, [API_BASE]);

  const handleRating = async (id, rating) => {
    // Safe array check before mapping items
    const safeHistory = Array.isArray(history) ? history : [];
    setHistory(safeHistory.map(item => item._id === id ? { ...item, userRating: rating } : item));
    
    await fetch(`${API_BASE}/api/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historyId: id, rating })
    });
  };

  const togglePremiumSimulation = async () => {
    if (!userId) return;
    const res = await fetch(`${API_BASE}/api/profile/${userId}/toggle-premium`, { method: 'POST' });
    const data = await res.json();
    if (data && data.user) {
      setProfile(data.user);
    }
  };

  // VIRAL SOCIAL HOOK: Formats current history statistics into copyable text
  const copyShareLink = () => {
    const safeHistory = Array.isArray(history) ? history : [];
    const highlyRated = safeHistory.filter(h => h.userRating >= 4).map(h => h.title).join(', ');
    const shareText = `🍿 SeenIt App Wrapped: I just tracked my streaming data! My top rated items: ${highlyRated || 'None yet!'}`;
    navigator.clipboard.writeText(shareText);
    alert("Social media summary generated and copied to your clipboard! Try pasting it into Twitter/X!");
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', backgroundColor: '#121212', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
        <RefreshCw className="animate-spin" size={24} />
        <span>Deploying & Seeding Local Alpha Engine...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '20%', backgroundColor: '#121212', height: '100vh' }}>
        <h3>Backend Sync Pending...</h3>
        <p style={{ color: '#666' }}>Make sure your Render backend service isn't sleeping!</p>
      </div>
    );
  }

  // Fallback map definition to handle rendering safe items safely
  const renderHistory = Array.isArray(history) ? history : [];

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' }}>

      {/* HEADER SECTION */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d2d2d', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Seen<span style={{ color: '#4BB543' }}>It</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={togglePremiumSimulation} style={{ display:'flex', alignItems:'center', gap: '0.5rem', background: profile.isPremium ? '#4BB543' : '#e50914', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Zap size={16} fill="white" /> {profile.isPremium ? "Premium Active" : "Go Premium"}
          </button>
          <div style={{ color: '#4BB543', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={18} /> <span>Secure Sync</span>
          </div>
        </div>
      </header>

      {/* CORE FRAMEWORK GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>

        {/* LEFT COMPONENT: ANALYTICS & GROW HOOKS */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Welcome, @{profile.username || 'user'}</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>{profile.bio || 'No bio available'}</p>
            <div style={{ borderTop: '1px solid #2d2d2d', marginTop: '1rem', paddingTop: '1rem' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '11px', color: '#888', fontWeight: 'bold' }}>Integration Sync</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span>Netflix / Prime</span>
                <span style={{ color: '#4BB543' }}>● Live Feed Active</span>
              </div>
            </div>
          </section>

          {/* SOCIAL SHARING ENGINE */}
          <section style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #2b1114 100%)', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Share Your Wrapped</h4>
            <p style={{ fontSize: '13px', color: '#ccc' }}>Get users to market the app for you by sharing tracking stats.</p>
            <button onClick={copyShareLink} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#333', border: '1px solid #444', color: '#fff', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
              <Share2 size={16} /> Generate Share Summary
            </button>
          </section>

          {/* PRIVACY-FIRST AD SENSE DISPLAY INJECTION */}
          {!profile.isPremium ? (
            <div style={{ background: '#1a1a1a', border: '1px dashed #444', height: '250px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Advertisement</span>
              <div style={{ margin: 'auto', color: '#555', fontSize: '14px' }}>
                [Google AdSense / CarbonAds Target Container]<br />
                <code style={{fontSize:'11px', color:'#777'}}>Injected script: adsbygoogle.js</code>
              </div>
              <small style={{ color: '#444', fontSize: '11px' }}>Premium users don't see ads.</small>
            </div>
          ) : (
            <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
              🎉 Thanks for supporting SeenIt! Banner advertisements have been programmatically collapsed.
            </div>
          )}
        </aside>

        {/* RIGHT COMPONENT: STREAMING FEED ACTIVITY LIST */}
        <main style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '12px' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', borderBottom: '1px solid #2d2d2d', paddingBottom: '0.5rem' }}>Your Monitored Viewing Stream</h2>
          
          {renderHistory.length === 0 ? (
            <p style={{ color: '#aaa' }}>No streaming history found. Try seeding data or refreshing.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {renderHistory.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#252525', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{item.title}</h4>
                    <small style={{ color: '#888' }}>Platform: {item.platform || 'Unknown'} | Watched: {item.watchedAt ? new Date(item.watchedAt).toLocaleDateString() : 'Recently'}</small>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        onClick={() => handleRating(item._id, star)}
                        fill={star <= (item.userRating || 0) ? '#4BB543' : 'none'}
                        stroke={star <= (item.userRating || 0) ? '#4BB543' : '#666'}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
