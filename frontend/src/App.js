// frontend/src/App.js
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
    fetch("http://localhost:5000/api/alpha-seed")
      .then(res => res.json())
      .then(data => {
        setUserId(data.userId);
        return Promise.all([
          fetch(`${API_BASE}/api/profile/${data.userId}`).then(r => r.json()),
          fetch(`${API_BASE}/api/history/${data.userId}`).then(r => r.json())
        ]);
      })
      .then(([profData, histData]) => {
        setProfile(profData);
        setHistory(histData);
        setLoading(false);
      })
      .catch(err => {
        console.error("If running locally, please verify Node server.js is running on Port 5000.", err);
        setLoading(false);
      });
  }, []);

  const handleRating = async (id, rating) => {
    setHistory(history.map(item => item._id === id ? { ...item, userRating: rating } : item));
    await fetch(`${API_BASE}/api/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historyId: id, rating })
    });
  };

  const togglePremiumSimulation = async () => {
    const res = await fetch(`${API_BASE}/api/profile/${userId}/toggle-premium`, { method: 'POST' });
    const data = await res.json();
    setProfile(data.user);
  };

  // VIRAL SOCIAL HOOK: Formats current history statistics into copyable text
  const copyShareLink = () => {
    const highlyRated = history.filter(h => h.userRating >= 4).map(h => h.title).join(', ');
    const shareText = `🍿 SeenIt App Wrapped: I just tracked my streaming data! My top rated shows this week: [${highlyRated}]. Track your history free at seenit.app`;
    navigator.clipboard.writeText(shareText);
    alert("Social media summary generated and copied to your clipboard! Try pasting it into Twitter or a text message.");
  };

  if (loading) return <div style={{ color: '#fff', backgroundColor: '#121212', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Deploying & Seeding Local Alpha Engine...</div>;
  if (!profile) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '20%' }}>Backend offline. Run node server.js inside your backend directory.</div>;

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '2rem' }}>
      
      {/* HEADER SECTION */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d2d2d', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Seen<span style={{ color: '#E50914' }}>It</span> <span style={{fontSize: '12px', background:'#333', padding:'3px 8px', borderRadius:'10px', marginLeft:'5px'}}>ALPHA</span></h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={togglePremiumSimulation} style={{ display:'flex', alignItems:'center', gap:'0.3rem', background: profile.isPremium ? '#4BB543' : '#E50914', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold' }}>
            <Zap size={16} fill="white" /> {profile.isPremium ? "Premium Active" : "Go Premium ($2.99/mo)"}
          </button>
          <div style={{ color: '#4BB543', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={18} /> Secure Engine</div>
        </div>
      </header>

      {/* CORE FRAMEWORK GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        
        {/* LEFT COMPONENT: ANALYTICS & GROW HOOKS */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Welcome, @{profile.username}</h3>
            <p style={{ color: '#aaa', fontSize: '14px' }}>{profile.bio}</p>
            <div style={{ borderTop: '1px solid #2d2d2d', marginTop: '1rem', paddingTop: '1rem' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '11px', color: '#888', fontWeight: 'bold' }}>Data Pipeline Sync</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '14px' }}>
                <span>Netflix / Prime</span>
                <span style={{ color: '#4BB543' }}>● Live Feed Active</span>
              </div>
            </div>
          </section>

          {/* SOCIAL SHARING ENGINE */}
          <section style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #2b1114 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #4a151b' }}>
            <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={18} color="#E50914" /> Organic Growth Loop</h4>
            <p style={{ fontSize: '13px', color: '#ccc' }}>Get users to market the app for you. Generate an auto-crafted summary of their viewing habits with your domain hardcoded.</p>
            <button onClick={copyShareLink} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#333', color: '#fff', border: '1px solid #555', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
              <Share2 size={16} /> Generate Share Summary
            </button>
          </section>

          {/* PRIVACY-FIRST AD SENSE DISPLAY INJECTION */}
          {/* Ad blocks automatically collapse if the simulated user upgrades to premium */}
          {!profile.isPremium ? (
            <div style={{ background: '#1a1a1a', border: '1px dashed #444', height: '250px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Sponsored Advertisement</span>
              <div style={{ margin: 'auto', color: '#555', fontSize: '14px' }}>
                [Google AdSense / CarbonAds Target Container]<br />
                <code style={{fontSize:'11px', color:'#777'}}>Injected script: adsbygoogle.js</code>
              </div>
              <small style={{ color: '#444', fontSize: '11px' }}>Premium users don't see ads.</small>
            </div>
          ) : (
            <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #4BB543', color: '#4BB543', fontSize: '13px' }}>
              🎉 Thanks for supporting SeenIt! Banner advertisements have been programmatically unmounted.
            </div>
          )}
        </aside>

        {/* RIGHT COMPONENT: HISTORY STREAM AND AFFILIATE EARNING ENGINE */}
        <section style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Unified Watch Feed</h2>
            <span style={{ fontSize: '13px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><RefreshCw size={14} /> Auto Updates Enabled</span>
          </div>

          {history.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#262626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{item.title}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', alignItems: 'center' }}>
                  <span style={{ textTransform: 'uppercase', fontSize: '10px', background: '#383838', padding: '2px 6px', borderRadius: '4px', color: '#ccc' }}>{item.service}</span>
                  
                  {/* AFFILIATE MONETIZATION LINK */}
                  {item.affiliateUrl && (
                    <a href={item.affiliateUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#E50914', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                      Watch Stream <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* RATING COMPONENT */}
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={20} 
                    onClick={() => handleRating(item._id, star)}
                    fill={star <= item.userRating ? "#ffcc00" : "none"} 
                    color={star <= item.userRating ? "#ffcc00" : "#666"}
                    style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
