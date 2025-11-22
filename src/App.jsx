import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Trophy, Activity, Users, Settings, Share2, Search, Zap, 
  Target, Swords, Brain, Globe, Flame, Monitor, Smartphone, Cpu, Menu, X, 
  Sparkles, Bot, Loader2, MessageSquare, Maximize2, Filter, Clock, 
  UserPlus, Signal, Bell, Shield, Award, Crown, Medal, Star, User, Eye, 
  Camera, LogOut, BellRing, Lock, Check, Palette, Layout, Link2, 
  Edit3, Share, ChevronRight, LogIn, Coffee, Music, Mic, UserCheck,
  ClipboardList
} from 'lucide-react';

// --- Configuration API Gemini ---
// NOTE : Pour que l'IA fonctionne, crée un fichier .env avec VITE_GEMINI_API_KEY=ta_cle
// ou colle ta clé directement ci-dessous entre les guillemets.
const apiKey = ""; 

async function callGemini(prompt, systemInstruction = "") {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "L'Oracle est silencieux...";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "La connexion avec l'Ether a été interrompue.";
  }
}

// --- Composant de Rendu Markdown Personnalisé ---
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const parseBold = (text) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-violet-300 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-2 text-gray-300 font-light">
      {content.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2 flex items-center gap-2"><span className="w-1 h-4 bg-violet-500 rounded-full"></span>{parseBold(trimmed.replace('### ', ''))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3 border-b border-white/10 pb-1">{parseBold(trimmed.replace('## ', ''))}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-300 mt-4 mb-4">{parseBold(trimmed.replace('# ', ''))}</h1>;
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-3 ml-2 mb-1">
              <span className="text-violet-500 mt-1.5 min-w-[6px] h-[6px] rounded-full bg-violet-500 block"></span>
              <p className="leading-relaxed">{parseBold(trimmed.replace(/^[\*\-] /, ''))}</p>
            </div>
          );
        }
        if (trimmed === '---' || trimmed === '***') return <hr key={i} className="border-white/10 my-4" />;
        if (trimmed === '') return <div key={i} className="h-2"></div>;
        return <p key={i} className="leading-relaxed">{parseBold(line)}</p>;
      })}
    </div>
  );
};

// --- Composants UI de base ---
const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#131625]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:border-violet-500/30 transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "blue", className = "" }) => {
  const colors = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    gold: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    pink: "bg-pink-500/20 text-pink-300 border-pink-500/30"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// --- Modales ---
const OracleModal = ({ isOpen, onClose, content, loading, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0f121e] border border-violet-500/30 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-gradient-to-r from-violet-900/50 to-cyan-900/50 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg animate-pulse">
              <Sparkles size={20} className="text-violet-300" />
            </div>
            <h3 className="text-xl font-bold text-white">{title || "L'Oracle d'Aether"}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="text-violet-400 animate-spin" />
              <p className="text-violet-200 animate-pulse text-sm tracking-widest uppercase">Consultation des archives cosmiques...</p>
            </div>
          ) : (
            <MarkdownRenderer content={content} />
          )}
        </div>
        <div className="p-4 bg-[#0B0E14] border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 italic">Propulsé par Gemini AI • Analyse en temps réel</p>
        </div>
      </div>
    </div>
  );
};

const DNAModal = ({ isOpen, onClose, stats, dnaTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-[#0B0E14] border border-violet-500/50 w-full max-w-2xl rounded-3xl shadow-[0_0_100px_rgba(139,92,246,0.2)] overflow-hidden flex flex-col items-center p-8 md:p-16">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20">
          <X size={24} />
        </button>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-3">
            Analyse Spectrale Complète
          </h2>
          <p className="text-gray-400 uppercase tracking-widest text-sm">Signature unique du joueur</p>
        </div>
        <div className="scale-110 md:scale-125 mb-12 mt-4">
           <GamerDNA stats={stats} size={300} showLabels={true} expanded={true} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
           <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
             <p className="text-violet-400 text-xs uppercase font-bold mb-2">Point Fort</p>
             <p className="text-white text-lg font-bold">Exploration (90)</p>
           </div>
           <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center ring-1 ring-violet-500/30">
             <p className="text-cyan-400 text-xs uppercase font-bold mb-2">Classe</p>
             <p className="text-white text-lg font-bold">{dnaTitle}</p>
           </div>
           <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
             <p className="text-pink-400 text-xs uppercase font-bold mb-2">Point Faible</p>
             <p className="text-white text-lg font-bold">Agressivité (30)</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Composant GamerDNA ---
const GamerDNA = ({ stats, size = 200, showLabels = true, expanded = false }) => {
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / 6;

  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const labels = [
    { name: "Stratégie", icon: Brain },
    { name: "Social", icon: Users },
    { name: "Réflexes", icon: Zap },
    { name: "Précision", icon: Target },
    { name: "Agressivité", icon: Swords },
    { name: "Exploration", icon: Globe },
  ];

  const pointsString = Object.values(stats).map((val, i) => getPoint(val, i)).join(" ");

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div style={{ width: size, height: size }} className="relative">
        <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full animate-pulse"></div>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] overflow-visible">
          {[25, 50, 75, 100].map((level, idx) => (
            <polygon
              key={idx}
              points={Object.values(stats).map((_, i) => getPoint(level, i)).join(" ")}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          ))}
          {labels.map((_, i) => {
             const endPoint = getPoint(100, i);
             return (
               <line 
                key={i} 
                x1={center} 
                y1={center} 
                x2={endPoint.split(',')[0]} 
                y2={endPoint.split(',')[1]} 
                stroke="rgba(255, 255, 255, 0.1)" 
              />
             );
          })}
          <polygon
            points={pointsString}
            fill="rgba(139, 92, 246, 0.4)"
            stroke="#8b5cf6"
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
          />
          {Object.values(stats).map((val, i) => {
             const [cx, cy] = getPoint(val, i).split(',');
             return <circle key={i} cx={cx} cy={cy} r={size > 200 ? "5" : "3"} fill="white" />;
          })}
        </svg>
        {showLabels && labels.map((item, i) => {
           const angle = i * angleStep - Math.PI / 2;
           const labelRadius = radius * 1.55; 
           const x = 50 + (labelRadius / size * 100) * Math.cos(angle);
           const y = 50 + (labelRadius / size * 100) * Math.sin(angle);
           let style = { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' };
           return (
             <div key={i} className="absolute flex flex-col items-center text-[10px] md:text-xs text-gray-400 font-medium tracking-widest uppercase" style={style}>
               <item.icon size={size > 200 ? 18 : 12} className="mb-2 text-violet-400" />
               {item.name}
             </div>
           );
        })}
      </div>
      <div className={`text-center transition-all ${expanded ? 'mt-16' : 'mt-6'}`}>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Type de Joueur</p>
        <h3 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 ${size > 200 ? 'text-3xl' : 'text-xl'}`}>
          Architecte Tacticien
        </h3>
      </div>
    </div>
  );
};

// --- VUE: Dashboard (Accueil Dynamique) ---
const Dashboard = ({ userData, games, friends, setDnaModalOpen, handleSummonOracle, handleSynergyCheck, handleSquadBriefing, setActiveTab, mood }) => {
  
  // Filtrage des jeux selon l'humeur
  const getFilteredGames = () => {
    if (mood === 'chill') return games.filter(g => g.tags.includes('Chill') || g.tags.includes('Solo'));
    if (mood === 'social') return games.filter(g => g.tags.includes('Multi') || g.tags.includes('Coop'));
    return games.filter(g => g.tags.includes('Ranked') || g.tags.includes('Hardcore'));
  };

  const filteredGames = getFilteredGames();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Left Column: Gamer DNA */}
      <div className="md:col-span-4 lg:col-span-3 space-y-6">
        <Card 
          className={`h-full flex flex-col items-center justify-center relative overflow-hidden group ${mood === 'chill' ? 'border-teal-500/20' : mood === 'social' ? 'border-pink-500/20' : 'border-violet-500/20'}`}
          onClick={() => setDnaModalOpen(true)}
        >
           <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 ${mood === 'chill' ? 'via-teal-500' : mood === 'social' ? 'via-pink-500' : 'via-violet-500'}`}></div>
           <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-sm uppercase tracking-wider text-gray-500 font-bold">
             <span className="flex items-center gap-2"><Activity size={14} className={mood === 'chill' ? 'text-teal-400' : mood === 'social' ? 'text-pink-400' : 'text-violet-400'} /> Gamer DNA</span>
             <Maximize2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
           </div>
           <GamerDNA stats={userData.dnaStats} size={200} />
           <div className="w-full mt-6 px-2">
             <div className="flex justify-between text-sm text-gray-400 mb-1">
               <span>Niveau Global</span>
               <span className="text-white font-bold">42</span>
             </div>
             <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
               <div className={`h-full w-[75%] bg-gradient-to-r ${mood === 'chill' ? 'from-teal-500 to-emerald-500' : mood === 'social' ? 'from-pink-500 to-rose-500' : 'from-cyan-500 to-violet-500'}`}></div>
             </div>
             <p className="text-right text-xs text-gray-500 mt-1">1,240 XP restant</p>
           </div>
        </Card>
      </div>

      {/* Center Column: Dynamic Content */}
      <div className="md:col-span-8 lg:col-span-6 space-y-6">
        
        {/* MOOD HEADER WIDGET */}
        {mood === 'chill' ? (
           <Card className="bg-gradient-to-r from-teal-900/40 to-emerald-900/40 border-teal-500/20 relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                 <div className="p-3 bg-teal-500/20 rounded-full">
                    <Coffee size={24} className="text-teal-300" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Zone de Détente</h3>
                    <p className="text-sm text-teal-200/80">Pas de stress, pas de ranked. Juste de l'exploration.</p>
                 </div>
              </div>
              <div className="mt-4 flex gap-3">
                 <div className="px-3 py-1 bg-black/20 rounded-lg text-xs text-teal-100 flex items-center gap-2"><Music size={12}/> Lo-Fi Beats activé</div>
                 <div className="px-3 py-1 bg-black/20 rounded-lg text-xs text-teal-100">Notifications silencieuses</div>
              </div>
           </Card>
        ) : mood === 'social' ? (
           <Card className="bg-gradient-to-r from-pink-900/40 to-rose-900/40 border-pink-500/20 relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                 <div className="p-3 bg-pink-500/20 rounded-full">
                    <Mic size={24} className="text-pink-300" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Hub Social Actif</h3>
                    <p className="text-sm text-pink-200/80">3 amis sont en ligne et prêts à jouer.</p>
                 </div>
              </div>
              <div className="mt-4 flex gap-2">
                 {friends.filter(f => f.status.includes('En ligne') || f.status.includes('In Game')).map((f, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-pink-500/30 overflow-hidden" title={f.name}>
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.name}`} alt={f.name} />
                    </div>
                 ))}
                 <button className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs hover:bg-pink-500/40 transition-colors">+</button>
              </div>
           </Card>
        ) : (
          /* Default Competitive Stats */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#1a1d2d] to-[#131625]">
              <h3 className="text-3xl font-bold text-white">4,820</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Heures</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#1a1d2d] to-[#131625]">
              <h3 className="text-3xl font-bold text-white">342</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Jeux</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#1a1d2d] to-[#131625]">
              <h3 className="text-3xl font-bold text-white">12</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Platines</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#1a1d2d] to-[#131625]">
              <h3 className="text-3xl font-bold text-cyan-400">Top 5%</h3>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Monde</span>
            </Card>
          </div>
        )}

        {/* Recent Activity / Recommendations */}
        <Card>
          <div className="flex justify-between items-center mb-4">
             <button onClick={() => setActiveTab('games')} className="text-lg font-bold text-white hover:text-white/80 transition-colors flex items-center gap-2 group">
               {mood === 'chill' ? 'Aventures Relaxantes' : mood === 'social' ? 'Lobbies Multijoueurs' : 'Mode Compétitif'} 
               <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
             </button>
             <Badge color={mood === 'chill' ? 'green' : mood === 'social' ? 'pink' : 'purple'}>Basé sur ton humeur</Badge>
          </div>
          <div className="space-y-3">
            {filteredGames.length > 0 ? filteredGames.map((game, i) => (
              <div key={i} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setActiveTab('games')}>
                <div className={`w-12 h-12 rounded-lg mr-4 ${game.img} flex items-center justify-center text-xl font-bold text-white/20 border border-white/5 overflow-hidden relative`}>
                  <img 
                    src={`https://image.pollinations.ai/prompt/icon%20for%20video%20game%20${encodeURIComponent(game.name)}%20minimalist?width=100&height=100&nologo=true`}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt={game.name}
                  />
                  <span className="relative z-10 drop-shadow-md">{game.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-200 group-hover:text-white">{game.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{game.platform}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span>{game.genre}</span>
                  </div>
                </div>
                <div className="text-right">
                   {game.completion ? (
                     <div className="flex flex-col items-end">
                       <span className={`text-sm font-bold ${mood === 'chill' ? 'text-teal-400' : 'text-cyan-400'}`}>{game.completion}%</span>
                       <div className="w-16 h-1 bg-gray-800 rounded-full mt-1">
                         <div className={`h-full rounded-full ${mood === 'chill' ? 'bg-teal-500' : 'bg-cyan-500'}`} style={{width: `${game.completion}%`}}></div>
                       </div>
                     </div>
                   ) : (
                     <span className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400">Multijoueur</span>
                   )}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 text-sm">Aucun jeu trouvé pour cette humeur.</div>
            )}
          </div>
        </Card>

        {/* Univers Connectés */}
        {mood === 'competitif' && (
          <Card className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" /> Univers Connectés
              </h2>
              <button 
                onClick={() => setActiveTab('settings')}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-bold hover:underline"
              >
                + Connecter
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
               {[
                 { name: 'Steam', icon: Monitor, active: true, color: 'group-hover:text-blue-400' },
                 { name: 'PSN', icon: Gamepad2, active: true, color: 'group-hover:text-blue-600' },
                 { name: 'Epic', icon: Zap, active: true, color: 'group-hover:text-gray-200' },
                 { name: 'Xbox', icon: Cpu, active: false, color: 'group-hover:text-green-500' },
                 { name: 'Mobile', icon: Smartphone, active: false, color: 'group-hover:text-yellow-400' },
               ].map((p, idx) => (
                 <div key={idx} className={`group flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${p.active ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-transparent border-dashed border-gray-700 opacity-50 hover:opacity-100'}`}>
                   <p.icon size={24} className={`mb-2 text-gray-400 transition-colors ${p.active ? p.color : ''}`} />
                   <span className="text-xs font-medium text-gray-400">{p.name}</span>
                   {p.active && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>}
                 </div>
               ))}
            </div>
          </Card>
        )}
      </div>

      {/* Right Column: Friends & Social (3 cols) */}
      <div className="md:col-span-12 lg:col-span-3 space-y-6">
         <Card className="h-full bg-gradient-to-b from-[#131625]/90 to-[#0f1119]/95">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <Users size={18} className={mood === 'social' ? 'text-pink-400' : 'text-violet-400'} /> Squad
             </h2>
             <div className="flex gap-2">
                <button
                  onClick={handleSquadBriefing}
                  className="p-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white transition-all"
                  title="Briefing Tactique IA"
                >
                  <ClipboardList size={14} />
                </button>
                <button 
                  onClick={() => setActiveTab('social')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  title="Chercher des joueurs"
                >
                  <Search size={14} className="text-gray-400" />
                </button>
             </div>
           </div>

           <div className="space-y-4">
             {/* Friend Item */}
             {friends.map((friend, idx) => (
               <div 
                 key={idx} 
                 className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors relative cursor-pointer"
                 onClick={() => setActiveTab('profile')}
                 title="Voir le profil"
               >
                 <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold">
                      {friend.name.charAt(0)}
                   </div>
                   <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#131625] ${friend.status.includes('In Game') ? 'bg-green-500' : friend.status === 'Hors ligne' ? 'bg-gray-500' : 'bg-cyan-500'}`}></div>
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-medium text-gray-200 truncate">{friend.name}</h4>
                   <p className="text-xs text-gray-500 truncate">{friend.status}</p>
                 </div>
                 
                 {/* Actions au survol : Ajouter / Synergie */}
                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all absolute right-2">
                    <button 
                      className="p-1.5 rounded-md bg-green-600 text-white hover:bg-green-500 shadow-lg hover:scale-110 transition-transform"
                      title="Ajouter en ami"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mock add functionality
                      }}
                    >
                      <UserPlus size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSynergyCheck(friend);
                      }}
                      className="bg-violet-600 text-white p-1.5 rounded-md shadow-lg hover:bg-violet-500 hover:scale-110 transition-transform"
                      title="Analyser la Synergie"
                    >
                      <Sparkles size={14} />
                    </button>
                 </div>
               </div>
             ))}
           </div>

           <div className="mt-8 pt-6 border-t border-white/5">
             <h3 className="text-sm font-medium text-gray-300 mb-3">Suggestions de Squad</h3>
             {/* Modified Suggestion Card to look like a profile to add */}
             <div 
               className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-3 cursor-pointer hover:bg-violet-500/20 transition-colors group"
             >
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-violet-500/30 overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Viper_X" alt="Viper_X" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-violet-200 font-bold">Viper_X</p>
                  <p className="text-[10px] text-violet-400/80">Compatibilité 92%</p>
                </div>
                <button 
                  className="p-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Ajouter Viper_X"
                >
                  <UserPlus size={16} />
                </button>
             </div>
           </div>
         </Card>
      </div>

    </div>
  );
};

const GameLibrary = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const libraryGames = [
    { name: "Elden Ring", platform: "Steam", hours: 120, completion: 85, color: "bg-amber-900/20", genre: "RPG", lastPlayed: "2h ago" },
    { name: "Valorant", platform: "Riot", hours: 450, completion: null, color: "bg-rose-900/20", genre: "FPS", lastPlayed: "1d ago" },
    { name: "God of War", platform: "PSN", hours: 40, completion: 100, color: "bg-slate-700/50", genre: "Action", lastPlayed: "1w ago" },
    { name: "Cyberpunk 2077", platform: "Steam", hours: 85, completion: 60, color: "bg-yellow-400/10", genre: "RPG", lastPlayed: "2d ago" },
    { name: "Hollow Knight", platform: "Switch", hours: 35, completion: 112, color: "bg-blue-900/20", genre: "Metroidvania", lastPlayed: "3d ago" },
    { name: "Destiny 2", platform: "Steam", hours: 1200, completion: null, color: "bg-cyan-900/20", genre: "MMO FPS", lastPlayed: "5h ago" },
    { name: "The Witcher 3", platform: "Steam", hours: 200, completion: 100, color: "bg-orange-900/20", genre: "RPG", lastPlayed: "1mo ago" },
    { name: "Mario Kart 8", platform: "Switch", hours: 60, completion: null, color: "bg-red-600/20", genre: "Racing", lastPlayed: "2w ago" },
    { name: "Overwatch 2", platform: "Battle.net", hours: 800, completion: null, color: "bg-gray-200/10", genre: "FPS", lastPlayed: "10m ago" },
    { name: "Zelda: TOTK", platform: "Switch", hours: 150, completion: 45, color: "bg-green-900/20", genre: "Adventure", lastPlayed: "4d ago" },
  ];

  const filteredGames = libraryGames.filter(g => {
    const matchesFilter = filter === 'all' || g.platform.toLowerCase().includes(filter);
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col gap-4">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="text-violet-500" /> Bibliothèque Quantique
            </h2>
            <div className="hidden md:block text-xs text-gray-500 uppercase tracking-widest">
              {filteredGames.length} titres connectés
            </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between gap-4 bg-[#131625] p-4 rounded-2xl border border-white/5">
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {['all', 'steam', 'psn', 'switch', 'riot'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {f === 'all' ? 'Tous' : f}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Rechercher un jeu..." 
               className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 w-full transition-colors"
             />
           </div>
         </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-10">
          {filteredGames.map((game, idx) => (
             <Card key={idx} className="group relative p-0 overflow-hidden border-white/5 hover:border-violet-500/50 transition-all duration-300 bg-[#131625] h-64 flex flex-col">
                <div className={`h-36 w-full relative overflow-hidden ${game.color}`}>
                   <img 
                      src={`https://image.pollinations.ai/prompt/cinematic%20shot%20video%20game%20${encodeURIComponent(game.name)}%20cover%20art%20dark%20aesthetic?width=400&height=300&nologo=true`}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                      loading="lazy"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#131625] via-[#131625]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                   
                   <div className="absolute top-3 right-3 z-10">
                      {game.completion === 100 && <Trophy size={14} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />}
                   </div>
                   <div className="absolute bottom-2 left-3 flex gap-2 z-10">
                      <div className="p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10" title={game.platform}>
                         {game.platform === 'Steam' && <Monitor size={12} className="text-blue-400" />}
                         {game.platform === 'PSN' && <Gamepad2 size={12} className="text-blue-600" />}
                         {game.platform === 'Switch' && <Smartphone size={12} className="text-red-500" />}
                         {game.platform === 'Riot' && <Swords size={12} className="text-red-400" />}
                         {game.platform === 'Battle.net' && <Zap size={12} className="text-cyan-400" />}
                      </div>
                   </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between relative bg-[#131625]">
                   <div>
                     <h3 className="font-bold text-white text-sm truncate mb-1 group-hover:text-violet-400 transition-colors">{game.name}</h3>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wider">{game.genre}</p>
                   </div>
                   
                   <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1.5"><Clock size={10} /> {game.hours}h</span>
                          <span className="text-[10px]">{game.lastPlayed}</span>
                      </div>
                      
                      {game.completion !== null && (
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                           <div className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full rounded-full" style={{width: `${game.completion}%`}}></div>
                        </div>
                      )}
                   </div>
                   
                   <div className="absolute inset-0 bg-violet-950/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 translate-y-4 group-hover:translate-y-0 z-20">
                      <button className="px-6 py-2 rounded-full bg-white text-black font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2">
                        <Gamepad2 size={14} /> JOUER
                      </button>
                      <div className="flex gap-2">
                         <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><Activity size={14} /></button>
                         <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"><Share size={14} /></button>
                      </div>
                   </div>
                </div>
             </Card>
          ))}
       </div>
    </div>
  )
}

const SocialHub = ({ friends, handleSynergyCheck, handleSquadBriefing, setActiveTab }) => {
  const [socialTab, setSocialTab] = useState('squad');

  const suggestions = [
    { name: "Viper_X", match: 92, games: ["Valorant", "CS:GO"], style: "Sniper" },
    { name: "Luna_Sea", match: 85, games: ["Elden Ring", "Genshin"], style: "Explorer" },
    { name: "Tank_Daddy", match: 78, games: ["Overwatch 2"], style: "Tank/Support" },
  ];

  const requests = [
    { name: "NoobMaster69", time: "2h ago" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="lg:col-span-2 space-y-6">
        <Card className="flex flex-col md:flex-row justify-between items-center gap-4 !p-4">
            <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-full md:w-auto overflow-x-auto">
                {['squad', 'discover', 'requests'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSocialTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${socialTab === tab ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab === 'squad' && 'Mon Escouade'}
                        {tab === 'discover' && 'Découvrir'}
                        {tab === 'requests' && 'Requêtes'}
                        {tab === 'requests' && requests.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded-full text-[10px] text-white">1</span>}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Chercher un joueur..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
            </div>
        </Card>

        <div className="space-y-4">
            {socialTab === 'squad' && (
                <div className="grid grid-cols-1 gap-3">
                  {friends.map((friend, idx) => (
                      <Card key={idx} className="group flex items-center justify-between p-4 hover:bg-white/5 transition-all !p-4 cursor-pointer" onClick={() => setActiveTab('profile')}>
                          <div className="flex items-center gap-4">
                              <div className="relative">
                                  <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                                     <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} 
                                        alt={friend.name}
                                        className="w-full h-full object-cover"
                                     />
                                  </div>
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#131625] ${friend.status.includes('In Game') ? 'bg-green-500' : friend.status === 'Hors ligne' ? 'bg-gray-500' : 'bg-cyan-500'}`}></div>
                              </div>
                              <div>
                                  <h4 className="font-bold text-white">{friend.name}</h4>
                                  <p className="text-xs text-gray-400 flex items-center gap-1 flex-wrap">
                                      <span className={friend.status.includes('In Game') ? 'text-green-400' : ''}>{friend.status}</span>
                                      {friend.mood && <span className="px-2 py-0.5 rounded-full bg-white/5 text-violet-300 border border-white/5 ml-1 md:ml-2">{friend.mood}</span>}
                                  </p>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity md:translate-x-4 md:group-hover:translate-x-0">
                              <button 
                                  onClick={() => handleSynergyCheck(friend)}
                                  className="p-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 flex items-center gap-2 text-xs font-bold"
                                  title="Vérifier la compatibilité IA"
                              >
                                  <Sparkles size={14} /> <span className="hidden md:inline">Synergie</span>
                              </button>
                              <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                  <MessageSquare size={18} />
                              </button>
                          </div>
                      </Card>
                  ))}
                </div>
            )}
            
            {socialTab === 'discover' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.map((s, i) => (
                         <Card key={i} className="relative overflow-hidden group !p-5 hover:border-violet-500/40">
                             <div className="flex items-start justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-full h-full" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-white">{s.name}</h4>
                                         <p className="text-xs text-gray-500">{s.style}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <span className="text-xl font-bold text-green-400">{s.match}%</span>
                                     <p className="text-[10px] text-gray-500 uppercase font-bold">Compatibilité</p>
                                 </div>
                             </div>
                             <div className="flex flex-wrap gap-2 mb-6 h-8">
                                 {s.games.map(g => <span key={g} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-300 border border-white/5">{g}</span>)}
                             </div>
                             <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-violet-600 hover:text-white text-gray-300 text-sm font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                                 <UserPlus size={16} /> Ajouter à la Squad
                             </button>
                         </Card>
                    ))}
                </div>
            )}

             {socialTab === 'requests' && (
                <div className="space-y-3">
                   {requests.map((req, i) => (
                      <Card key={i} className="flex items-center justify-between !p-4 border-l-4 border-l-violet-500">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.name}`} className="w-full h-full" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-white text-sm">{req.name}</h4>
                                  <p className="text-xs text-gray-500">Il y a {req.time}</p>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"><X size={16} /></button>
                              <button className="p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors"><UserPlus size={16} /></button>
                          </div>
                      </Card>
                   ))}
                </div>
             )}
        </div>
      </div>

      {/* Right Col: Beacon / Party Status */}
      <div className="space-y-6">
          <Card className="bg-gradient-to-b from-violet-900/20 to-[#131625] border-violet-500/30 text-center py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse relative z-10">
                    <Signal size={32} className="text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Signal Aether</h3>
                <p className="text-sm text-gray-400 mb-6 relative z-10 px-4">Émets un signal pour trouver des coéquipiers compatibles avec ton ADN actuel.</p>
                <button className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-105 relative z-10 flex items-center gap-2 mx-auto">
                    <Zap size={16} className="fill-white" /> Activer le Signal
                </button>
          </Card>

          <Card className="!p-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><Shield size={14} /> Squad Actuelle</h3>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">En ligne</span>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-bold">K</div>
                      <span className="text-xs font-bold text-white">Kaelthas (Moi)</span>
                      <div className="ml-auto"><Signal size={12} className="text-green-500" /></div>
                  </div>
                  <div className="flex items-center gap-2 p-2 border border-dashed border-gray-700 rounded-lg text-gray-500 justify-center cursor-pointer hover:border-gray-500 hover:text-gray-300 transition-colors">
                      <span className="text-xs">+ Inviter un joueur</span>
                  </div>
              </div>
          </Card>
      </div>
    </div>
  )
}

// --- VUE: Succès & Trophées (NOUVEAU) ---
const AchievementsView = () => {
  const [filter, setFilter] = useState('all');

  const achievements = [
    { id: 1, title: "Elden Lord", game: "Elden Ring", rarity: "Legendary", date: "2 days ago", icon: Crown, description: "Atteindre la fin 'Age of Stars'.", xp: 500, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { id: 2, title: "Ace", game: "Valorant", rarity: "Epic", date: "1 week ago", icon: Target, description: "Éliminer toute l'équipe ennemie seul.", xp: 250, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { id: 3, title: "God Slayer", game: "God of War", rarity: "Rare", date: "2 weeks ago", icon: Swords, description: "Vaincre la Reine des Valkyries.", xp: 150, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { id: 4, title: "Cartographe", game: "Hollow Knight", rarity: "Common", date: "1 month ago", icon: Medal, description: "Acheter votre première carte.", xp: 50, color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30" },
    { id: 5, title: "Légende Vivante", game: "Cyberpunk 2077", rarity: "Legendary", date: "3 days ago", icon: Star, description: "Atteindre la réputation maximale.", xp: 500, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    { id: 6, title: "Pentakill", game: "League of Legends", rarity: "Epic", date: "2 months ago", icon: Zap, description: "Tuer 5 ennemis rapidement.", xp: 300, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  ];

  const filtered = filter === 'all' ? achievements : achievements.filter(a => a.rarity.toLowerCase() === filter);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
       {/* Header Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="flex items-center gap-4 !p-4 border-l-4 border-l-yellow-500">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
               <Trophy size={24} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">1,240</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total Trophées</p>
            </div>
         </Card>
         <Card className="flex items-center gap-4 !p-4 border-l-4 border-l-cyan-500">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
               <Award size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">98%</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Complétion Moy.</p>
            </div>
         </Card>
         <Card className="flex items-center gap-4 !p-4 border-l-4 border-l-purple-500">
            <div className="p-3 bg-purple-500/20 rounded-xl">
               <Star size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">42</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Trophées Rares</p>
            </div>
         </Card>
       </div>

       {/* Gallery */}
       <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="text-violet-500" /> Salle des Trophées
             </h2>
             
             <div className="flex gap-2">
               {['all', 'legendary', 'epic', 'rare'].map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                   {f === 'all' ? 'Tous' : f}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {filtered.map((ach, idx) => (
                <Card key={idx} className={`!p-0 overflow-hidden border ${ach.border} group relative hover:scale-[1.02] transition-transform`}>
                   <div className={`h-24 ${ach.bg} relative flex items-center justify-center overflow-hidden`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                      <ach.icon size={48} className={`${ach.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500`} />
                      <div className="absolute top-3 right-3">
                         <Badge color={ach.rarity === 'Legendary' ? 'gold' : ach.rarity === 'Epic' ? 'purple' : ach.rarity === 'Rare' ? 'blue' : 'gray'}>
                            {ach.rarity}
                         </Badge>
                      </div>
                   </div>
                   <div className="p-4 bg-[#131625]">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                           <h4 className="font-bold text-white text-lg group-hover:text-violet-300 transition-colors">{ach.title}</h4>
                           <p className="text-xs text-cyan-400 font-medium">{ach.game}</p>
                         </div>
                         <span className="text-xs text-gray-500">{ach.date}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ach.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                         <span className="text-xs font-mono text-gray-500">XP +{ach.xp}</span>
                         <button className="p-1.5 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                           <Share2 size={14} />
                         </button>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- VUE: Settings (Réglages) ---
const SettingsView = () => {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Mock states for toggles
  const [privacy, setPrivacy] = useState('public');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Settings Navigation */}
      <Card className="lg:col-span-1 h-fit !p-2 sticky top-6">
        <nav className="space-y-1">
           {[
             { id: 'profile', icon: User, label: "Profil Public" },
             { id: 'account', icon: Shield, label: "Compte & Sécurité" },
             { id: 'connections', icon: Link2, label: "Comptes Connectés" },
             { id: 'notifications', icon: Bell, label: "Notifications" },
             { id: 'appearance', icon: Palette, label: "Apparence" },
             { id: 'logout', icon: LogOut, label: "Déconnexion", textClass: "text-red-400 hover:text-red-300" }
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveSection(item.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.id ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'} ${item.textClass || ''}`}
             >
               <item.icon size={18} />
               {item.label}
             </button>
           ))}
        </nav>
      </Card>

      {/* Main Settings Content */}
      <div className="lg:col-span-3 space-y-6">
         {activeSection === 'profile' && (
           <div className="space-y-6">
             <Card>
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><User size={20} className="text-violet-500" /> Identité Visuelle</h3>
               <div className="flex flex-col md:flex-row items-start gap-8">
                 <div className="flex flex-col items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-black border-4 border-[#131625] ring-2 ring-violet-500 overflow-hidden shadow-2xl">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelthas" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                          <Camera size={24} className="text-white" />
                        </div>
                    </div>
                    <button className="text-xs text-violet-400 hover:text-violet-300 font-bold">Changer l'Avatar</button>
                 </div>
                 
                 <div className="flex-1 space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Pseudo</label>
                        <input type="text" defaultValue="Kaelthas" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Titre de Joueur</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed opacity-70">
                           <Sparkles size={14} className="text-violet-400" /> <span>Architecte Tacticien</span>
                        </div>
                        <p className="text-[10px] text-gray-600">Le titre est déterminé par votre ADN de jeu.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500 uppercase font-bold">Bio</label>
                       <textarea className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none h-24 resize-none transition-colors" defaultValue="Explorateur des mondes virtuels. Stratège à mes heures perdues. Fan de Souls-like et de FPS tactiques." />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold shadow-lg shadow-violet-500/20 transition-all">Sauvegarder</button>
                    </div>
                 </div>
               </div>
             </Card>

             <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Globe size={20} className="text-cyan-500" /> Confidentialité</h3>
                <div className="space-y-4">
                   {['Public', 'Amis Uniquement', 'Privé'].map((opt) => (
                      <label key={opt} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${privacy === opt ? 'bg-violet-500/10 border-violet-500' : 'bg-white/5 border-transparent hover:border-white/10'}`} onClick={() => setPrivacy(opt)}>
                         <span className={`font-medium ${privacy === opt ? 'text-white' : 'text-gray-400'}`}>{opt}</span>
                         {privacy === opt && <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                      </label>
                   ))}
                </div>
             </Card>
           </div>
         )}
         
         {activeSection === 'connections' && (
            <div className="space-y-6">
               <Card>
                  <h3 className="text-lg font-bold text-white mb-6">Plateformes Connectées</h3>
                  <div className="space-y-4">
                     {[
                        { name: "Steam", icon: Monitor, connected: true, user: "Kael_99" },
                        { name: "PlayStation Network", icon: Gamepad2, connected: true, user: "Kaelthas_PS" },
                        { name: "Xbox Live", icon: Cpu, connected: false, user: null },
                        { name: "Riot Games", icon: Swords, connected: true, user: "Kael#EUW" },
                        { name: "Battle.net", icon: Zap, connected: false, user: null },
                     ].map((platform, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-lg ${platform.connected ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                 <platform.icon size={24} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-white">{platform.name}</h4>
                                 {platform.connected ? (
                                    <p className="text-xs text-green-400 flex items-center gap-1">Connecté en tant que {platform.user}</p>
                                 ) : (
                                    <p className="text-xs text-gray-500">Non connecté</p>
                                 )}
                              </div>
                           </div>
                           <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${platform.connected ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                              {platform.connected ? 'Déconnecter' : 'Connecter'}
                           </button>
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
         )}

         {/* Placeholder for other sections */}
         {['account', 'notifications', 'accessibility', 'appearance'].includes(activeSection) && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-bounce">
                 <Settings size={32} className="text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Configuration Avancée</h3>
               <p className="max-w-md text-center">Cette section du cockpit est en cours de calibrage par nos ingénieurs.</p>
             </div>
         )}
      </div>
    </div>
  )
}

// --- VUE: Profil Public (NOUVEAU) ---
const ProfileView = ({ userData, setActiveTab }) => {
  
  // Mock data specifique pour la vue profil
  const topTrophies = [
    { title: "Elden Lord", game: "Elden Ring", icon: Crown, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    { title: "Ace", game: "Valorant", icon: Target, color: "text-purple-400", bg: "bg-purple-500/20" },
    { title: "God Slayer", game: "God of War", icon: Swords, color: "text-blue-400", bg: "bg-blue-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Banner & Identity Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-[#131625] border border-white/5">
         {/* Abstract Background */}
         <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-[#131625] to-[#0f1119] opacity-80"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         {/* Banner Content */}
         <div className="relative h-48 md:h-64 flex flex-col justify-end p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
               
               {/* Avatar with Level Ring */}
               <div className="relative group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-violet-500 to-purple-600 shadow-2xl shadow-violet-500/30 relative z-10">
                     <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelthas" 
                        alt="Avatar" 
                        className="w-full h-full rounded-full bg-black object-cover border-4 border-[#131625]" 
                     />
                  </div>
                  {/* Level Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-full border border-violet-500/50 text-xs font-bold shadow-lg z-20">
                     Niveau 42
                  </div>
               </div>

               {/* User Info */}
               <div className="flex-1 text-center md:text-left mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
                     {userData.name} 
                     <Badge color="gold" className="text-sm align-middle translate-y-1">Pro</Badge>
                  </h1>
                  <p className="text-violet-300 text-lg font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                     <Sparkles size={16} /> Architecte Tacticien
                  </p>
                  <p className="text-gray-400 text-sm max-w-xl mt-3 leading-relaxed hidden md:block">
                     Explorateur des mondes virtuels. Stratège à mes heures perdues. Fan de Souls-like et de FPS tactiques. Toujours prêt pour un raid ou une game chill.
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-3 mb-4 md:mb-0">
                  <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all">
                     <Share size={20} />
                  </button>
                  <button 
                     onClick={() => setActiveTab('settings')}
                     className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2"
                  >
                     <Edit3 size={18} /> Modifier
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Column: Identity & Stats */}
         <div className="space-y-6">
            <Card className="flex flex-col items-center relative overflow-hidden border-violet-500/20">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={16} /> Signature ADN
               </h3>
               <div className="scale-90">
                  <GamerDNA stats={userData.dnaStats} size={220} />
               </div>
               <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  {['Stratège', 'Explorateur', 'Tryhard', 'Nocturne'].map(tag => (
                     <div key={tag} className="text-center py-2 bg-white/5 rounded-lg border border-white/5 text-xs font-medium text-gray-400">
                        #{tag}
                     </div>
                  ))}
               </div>
            </Card>

            <Card>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Monitor size={16} /> Plateformes
               </h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-white flex items-center gap-2"><Monitor size={16} className="text-blue-400"/> Steam</span>
                     <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">En ligne</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-white flex items-center gap-2"><Gamepad2 size={16} className="text-blue-600"/> PSN</span>
                     <span className="text-xs text-gray-500">Hors ligne</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-white flex items-center gap-2"><Swords size={16} className="text-red-400"/> Riot</span>
                     <span className="text-xs text-gray-500">Hors ligne</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Column: Showcase & Highlights */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Featured Game */}
            <Card className="relative overflow-hidden !p-0 group h-64 flex items-end">
               <img 
                  src="https://image.pollinations.ai/prompt/cinematic%20shot%20elden%20ring%20landscape%20dark%20fantasy?width=800&height=400&nologo=true" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Featured Game"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f1119] via-[#0f1119]/60 to-transparent"></div>
               
               <div className="relative z-10 p-8 w-full flex justify-between items-end">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Badge color="gold">Jeu Favori</Badge>
                        <span className="text-gray-300 text-xs uppercase font-bold tracking-wider">RPG / Souls-like</span>
                     </div>
                     <h2 className="text-3xl font-bold text-white mb-1">Elden Ring</h2>
                     <p className="text-gray-400 text-sm">120 heures • 85% Complété</p>
                  </div>
                  <div className="hidden md:block">
                     <div className="w-16 h-16 rounded-full border-4 border-yellow-500/30 flex items-center justify-center bg-black/50 backdrop-blur-md">
                        <Crown size={32} className="text-yellow-500" />
                     </div>
                  </div>
               </div>
            </Card>

            {/* Trophy Showcase */}
            <Card>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <Trophy size={20} className="text-yellow-500" /> Vitrine de Trophées
                  </h3>
                  <button 
                     onClick={() => setActiveTab('achievements')}
                     className="text-xs text-violet-400 hover:text-white transition-colors font-bold hover:underline"
                  >
                     Voir tout
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topTrophies.map((t, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                        <div className={`p-3 rounded-lg ${t.bg} group-hover:scale-110 transition-transform duration-300`}>
                           <t.icon size={24} className={t.color} />
                        </div>
                        <div>
                           <h4 className="font-bold text-white text-sm">{t.title}</h4>
                           <p className="text-xs text-gray-500">{t.game}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
}

// --- Composant Application Principale ---

export default function AetherApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mood, setMood] = useState('competitif');
  const [oracleOpen, setOracleOpen] = useState(false);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleContent, setOracleContent] = useState("");
  const [oracleTitle, setOracleTitle] = useState("");
  const [dnaModalOpen, setDnaModalOpen] = useState(false);

  const userData = { name: "Kaelthas", level: 42, xp: 75, totalHours: 4820, platforms: { steam: true, psn: true, xbox: false, epic: true, switch: false }, dnaStats: { strategy: 85, social: 40, reflex: 60, precision: 75, aggressive: 30, exploration: 90 } };
  
  // Added tags for mood filtering
  const games = [
    { name: "Elden Ring", platform: "Steam", hours: 120, completion: 85, img: "bg-amber-900/20", genre: "RPG/Souls", tags: ["Hardcore", "Solo", "Exploration"] },
    { name: "Valorant", platform: "Riot", hours: 450, completion: null, img: "bg-rose-900/20", genre: "Tactical FPS", tags: ["Ranked", "Multi", "Team"] },
    { name: "God of War", platform: "PSN", hours: 40, completion: 100, img: "bg-slate-700/50", genre: "Action-Adventure", tags: ["Solo", "Story"] },
    { name: "Stardew Valley", platform: "Steam", hours: 200, completion: 60, img: "bg-green-900/20", genre: "Sim", tags: ["Chill", "Solo"] },
    { name: "It Takes Two", platform: "Steam", hours: 15, completion: 100, img: "bg-blue-900/20", genre: "Coop", tags: ["Coop", "Multi", "Chill"] },
    { name: "Apex Legends", platform: "Steam", hours: 300, completion: null, img: "bg-red-900/20", genre: "Battle Royale", tags: ["Ranked", "Multi", "Fast"] },
  ];

  const friends = [ { name: "N7_Shepard", status: "In Game: Destiny 2", mood: "Raid", platform: "psn", style: "Aggressive FPS" }, { name: "Jinx_Pow", status: "En ligne", mood: "Chill", platform: "pc", style: "MOBA Carry" }, { name: "MasterChief117", status: "Hors ligne", mood: null, platform: "xbox", style: "Vehicle Combat" }, ];

  const handleSummonOracle = async () => { setOracleTitle("La Prophétie du Joueur"); setOracleOpen(true); setOracleLoading(true); const prompt = ` Analyse les données de ce joueur pour créer un "Profil Mythique". Nom: ${userData.name}. Stats ADN (sur 100): ${JSON.stringify(userData.dnaStats)}. Jeux principaux: ${games.map(g => g.name).join(', ')}. Heures totales: ${userData.totalHours}. Ton output doit être court, mystique et inspirant (Max 150 mots). Structure ta réponse ainsi : 1. **L'Archétype** : Donne-lui un titre de classe RPG unique (ex: "Seigneur des Abysses Stratégiques"). 2. **La Légende** : Une phrase décrivant son style de jeu comme une épopée. 3. **Le Conseil de l'Oracle** : Une suggestion d'amélioration basée sur sa stat la plus faible. Ton: Épique, sérieux, futuriste. `; const response = await callGemini(prompt, "Tu es Aether, l'IA centrale qui unifie l'identité des joueurs."); setOracleContent(response); setOracleLoading(false); };
  const handleSynergyCheck = async (friend) => { setOracleTitle(`Synergie avec ${friend.name}`); setOracleOpen(true); setOracleLoading(true); const prompt = ` Analyse la compatibilité coopérative entre deux joueurs. Joueur 1 (Moi): Fan de ${games[0].genre} et ${games[1].genre}. Style: Stratégie et Exploration élevées. Joueur 2 (${friend.name}): Style connu pour ${friend.style}. Humeur actuelle: ${friend.mood || "Inconnue"}. Suggère 1 jeu spécifique auquel nous devrions jouer ensemble maintenant et explique pourquoi en 1 phrase percutante. Donne un pourcentage de "Taux de Synchronisation". `; const response = await callGemini(prompt, "Tu es un expert en matchmaking de jeux vidéo."); setOracleContent(response); setOracleLoading(false); };
  const handleSquadBriefing = async () => { setOracleTitle("Briefing Tactique d'Escouade"); setOracleOpen(true); setOracleLoading(true); const prompt = ` Analyse l'état actuel de l'escouade pour un briefing tactique. Commandant (Moi): ${userData.name} (Style: ${JSON.stringify(userData.dnaStats)}). Membres de l'escouade: ${friends.map(f => `- ${f.name}: ${f.status} (Mood: ${f.mood || 'N/A'}, Style: ${f.style})`).join('\n')} Génère un "Rapport de Situation" court et immersif (style Sci-Fi/Militaire). 1. Résume la disponibilité des forces. 2. Suggère une action immédiate (ex: "Attendre la fin du raid de N7_Shepard" ou "Lancer une session immédiate avec Jinx_Pow"). 3. Donne un nom de code à la mission de ce soir. `; const response = await callGemini(prompt, "Tu es Aether, l'IA centrale qui coordonne les opérations des joueurs."); setOracleContent(response); setOracleLoading(false); };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white font-sans overflow-hidden selection:bg-violet-500/30">
      <OracleModal isOpen={oracleOpen} onClose={() => setOracleOpen(false)} loading={oracleLoading} content={oracleContent} title={oracleTitle} />
      <DNAModal isOpen={dnaModalOpen} onClose={() => setDnaModalOpen(false)} stats={userData.dnaStats} dnaTitle="Architecte Tacticien" />

      <aside className={`fixed inset-y-0 left-0 z-50 w-20 bg-[#0f121e]/90 backdrop-blur-md border-r border-white/5 flex flex-col items-center py-8 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-12 relative group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20"> A </div>
        </div>
        <nav className="flex-1 flex flex-col space-y-8 w-full px-2">
          {[ { id: 'dashboard', icon: Activity, label: "Hub" }, { id: 'games', icon: Gamepad2, label: "Jeux" }, { id: 'social', icon: Users, label: "Amis" }, { id: 'achievements', icon: Trophy, label: "Succès" } ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`} >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="absolute left-14 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap z-50"> {item.label} </span>
              {activeTab === item.id && <div className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full"></div>}
            </button>
          ))}
        </nav>
        <div className="flex flex-col space-y-6 w-full px-2 items-center">
          <button onClick={() => setActiveTab('settings')} className={`flex items-center justify-center w-full aspect-square rounded-xl transition-colors ${activeTab === 'settings' ? 'text-cyan-400 bg-white/10' : 'text-gray-500 hover:text-white'}`} > <Settings size={22} /> </button>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-[2px] cursor-pointer hover:scale-110 transition-transform ${activeTab === 'profile' ? 'ring-2 ring-white' : ''}`} onClick={() => setActiveTab('profile')} >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelthas" alt="Profile" className="rounded-full bg-black" />
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-20 overflow-y-auto relative h-full">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-900/20 to-transparent pointer-events-none fixed-bg"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none fixed-bg"></div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-20">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-1"> Aether <span className="text-violet-500 text-lg align-top font-normal opacity-60">Bêta</span> </h1>
              <p className="text-gray-400 text-sm"> Ton ADN de joueur, élevé à l'essence pure. </p>
            </div>
            <button className="md:hidden absolute top-0 right-0 p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} > {mobileMenuOpen ? <X /> : <Menu />} </button>
            <div className="flex items-center gap-4">
               <button onClick={handleSummonOracle} className="hidden md:flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/50 hover:bg-violet-600/40 text-violet-200 rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] group" >
                 <Sparkles size={16} className="text-violet-400 group-hover:rotate-12 transition-transform" /> <span className="text-sm font-medium">Invoquer l'Oracle</span>
               </button>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                {[ { id: 'competitif', label: 'Compétitif', icon: Swords }, { id: 'chill', label: 'Détente', icon: Coffee }, { id: 'social', label: 'Social', icon: Users }, ].map((m) => (
                  <button key={m.id} onClick={() => setMood(m.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mood === m.id ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} >
                    <m.icon size={14} /> <span className="hidden md:inline">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          {activeTab === 'dashboard' && ( <Dashboard userData={userData} games={games} friends={friends} setDnaModalOpen={setDnaModalOpen} handleSummonOracle={handleSummonOracle} handleSynergyCheck={handleSynergyCheck} handleSquadBriefing={handleSquadBriefing} setActiveTab={setActiveTab} mood={mood} /> )}
          {activeTab === 'games' && ( <GameLibrary /> )}
          {activeTab === 'social' && ( <SocialHub friends={friends} handleSynergyCheck={handleSynergyCheck} handleSquadBriefing={handleSquadBriefing} setActiveTab={setActiveTab} /> )}
          {activeTab === 'achievements' && ( <AchievementsView /> )}
          {activeTab === 'settings' && ( <SettingsView /> )}
          {activeTab === 'profile' && ( <ProfileView userData={userData} setActiveTab={setActiveTab} /> )}

        </div>
      </main>
    </div>
  );
}