import React, { useState } from 'react';
import { Upload, CheckCircle, HelpCircle, Server, AlertTriangle, Camera, Lock, Download, Search, ShieldCheck, Filter, Briefcase } from 'lucide-react';

const InstagramAnalyzer = () => {
  const [view, setView] = useState('guide'); // 'guide', 'upload', 'results'
  
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [fileNameFollowers, setFileNameFollowers] = useState(null);
  const [fileNameFollowing, setFileNameFollowing] = useState(null);
  const [error, setError] = useState('');

  // --- ANALYSIS STATE ---
  const [activeTab, setActiveTab] = useState('not_following_back'); // 'not_following_back', 'fans', 'mutual'
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [fans, setFans] = useState([]);
  const [mutuals, setMutuals] = useState([]);

  // --- FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [hideSafeAccounts, setHideSafeAccounts] = useState(false);
  const [hideBusinessAccounts, setHideBusinessAccounts] = useState(false);
  
  // --- LOGIC: Parsing ---
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        
        const extractUsernames = (data) => {
            let list = [];
            const items = Array.isArray(data) ? data : 
                          data.relationships_following || 
                          data.relationships_followers || 
                          Object.values(data)[0] || [];

            items.forEach(item => {
                let foundUsername = item.string_list_data?.[0]?.value;
                let foundTimestamp = item.string_list_data?.[0]?.timestamp;
                
                if (!foundUsername && item.title) foundUsername = item.title;
                if (!foundUsername && item.media_list_data?.[0]?.value) foundUsername = item.media_list_data[0].value;

                if (foundUsername) {
                    list.push({
                        username: foundUsername,
                        timestamp: foundTimestamp ? (foundTimestamp < 10000000000 ? foundTimestamp * 1000 : foundTimestamp) : Date.now()
                    });
                }
            });
            return list;
        };

        const userList = extractUsernames(json);
        if (userList.length === 0) {
           setError(`Parsed 0 users from ${type}. Check if you uploaded the correct JSON file.`);
           return; 
        }

        if (type === 'followers') {
          setFollowersData(userList);
          setFileNameFollowers(file.name);
        } else {
          setFollowingData(userList);
          setFileNameFollowing(file.name);
        }
        setError('');
      } catch (err) {
        setError(`Error parsing ${type} file.`);
      }
    };
    reader.readAsText(file);
  };

  const analyzeData = () => {
    if (!followersData || !followingData) {
      setError("Please upload both files first.");
      return;
    }

    const followerSet = new Set(followersData.map(u => u.username));
    const followingSet = new Set(followingData.map(u => u.username));

    const diff = followingData.filter(user => !followerSet.has(user.username));
    const fansList = followersData.filter(user => !followingSet.has(user.username));
    const mutualsList = followingData.filter(user => followerSet.has(user.username));

    setNotFollowingBack(diff);
    setFans(fansList);
    setMutuals(mutualsList);
    setView('results');
  };

  // --- LOGIC: Heuristic Business Detection ---
  const isLikelyBusiness = (username) => {
    const businessKeywords = [
        'official', 'shop', 'store', 'boutique', 'clothing', 'apparel', 'brand',
        'agency', 'media', 'marketing', 'studio', 'design', 'art', 'photo', 'film',
        'music', 'band', 'records', 'entertainment',
        'realtor', 'realestate', 'estate', 'home', 'interiors',
        'fitness', 'gym', 'coach', 'training', 'health', 'beauty', 'hair', 'nails', 'makeup',
        'cafe', 'coffee', 'food', 'kitchen', 'eats', 'bakery', 'restaurant',
        'tech', 'app', 'software', 'solutions', 'systems',
        'inc', 'llc', 'ltd', 'co', 'club', 'society', 'community', 'blog', 'news',
        'podcast', 'radio', 'tv'
    ];
    const lower = username.toLowerCase();
    return businessKeywords.some(keyword => lower.includes(keyword));
  };

  // --- LOGIC: Export to CSV ---
  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,Username,Profile URL,Date Followed\n";
    data.forEach(user => {
        const date = new Date(user.timestamp).toLocaleDateString();
        csvContent += `${user.username},https://instagram.com/${user.username},${date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STYLES ---
  const igBlue = "bg-[#0095F6] hover:bg-[#1877F2]";
  const igButtonClass = `w-full py-2 px-4 rounded-lg font-semibold text-white text-sm transition-colors ${igBlue} flex items-center justify-center gap-2 h-10`;
  const igSecondaryButton = "bg-[#363636] hover:bg-[#262626] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors border border-[#363636]";
  const cardClass = "bg-[#121212] border border-[#363636] rounded-xl overflow-hidden";
  const inputClass = "bg-[#262626] border border-[#363636] text-white text-sm rounded-lg block w-full p-2.5 focus:ring-1 focus:ring-[#A8A8A8] focus:border-[#A8A8A8] outline-none";

  // --- COMPONENTS ---
  const renderGuide = () => (
    <div className={`max-w-5xl w-full ${cardClass} text-white flex flex-col md:flex-row`}>
      <div className="p-10 md:w-1/2 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle size={28} className="text-white" />
          <h1 className="text-xl font-semibold">How to get your data</h1>
        </div>
        <ol className="space-y-4 text-[#A8A8A8] text-sm list-decimal list-inside leading-relaxed">
          <li className="pl-2">Open <strong>Instagram Settings</strong>.</li>
          <li className="pl-2">Go to <strong>Accounts Center</strong> ➝ <strong>Your information and permissions</strong>.</li>
          <li className="pl-2">Select <strong>Download your information</strong> ➝ <strong>Download or transfer</strong>.</li>
          <li className="pl-2">Select <strong>Some of your information</strong> ➝ <strong>Followers and following</strong>.</li>
          <li className="pl-2">Select <strong>Download to device</strong>.</li>
          <li className="pl-2"><span className="text-white font-medium">Format: JSON</span> (Required).</li>
        </ol>
        <div className="mt-8">
          <button onClick={() => setView('upload')} className={igButtonClass}>I have my files ready</button>
        </div>
      </div>
      <div className="bg-black md:w-1/2 p-10 border-l border-[#363636]">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">Why do it this way?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <AlertTriangle size={20} className="text-[#ED4956] shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-[#ED4956]">Avoid Account Bans</h3>
              <p className="text-[#A8A8A8] text-xs mt-1">Apps that ask for your password are flagged as "automated activity" and will get your account suspended.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Lock size={20} className="text-[#0095F6] shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-[#0095F6]">100% Client-Side</h3>
              <p className="text-[#A8A8A8] text-xs mt-1">Your data is processed in your browser memory. It is never uploaded to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className={`max-w-2xl w-full mx-auto p-10 ${cardClass} text-white`}>
      <h2 className="text-xl font-semibold mb-8 text-center">Upload Files</h2>
      <div className="space-y-4 mb-8">
        <div className={`border rounded-lg p-4 flex items-center justify-between transition-colors ${followersData ? 'border-[#363636] bg-[#262626]' : 'border-[#363636] hover:bg-[#262626]'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${followersData ? 'bg-green-900' : 'bg-[#363636]'}`}>
                {followersData ? <CheckCircle size={20} className="text-green-500"/> : <Upload size={20} className="text-white"/>}
            </div>
            <div>
                <div className="text-sm font-semibold">Followers File</div>
                <div className="text-xs text-[#A8A8A8]">{fileNameFollowers || "followers_1.json"}</div>
            </div>
          </div>
          <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, 'followers')} className="hidden" id="followers-input"/>
          <label htmlFor="followers-input" className="cursor-pointer text-[#0095F6] text-sm font-semibold hover:text-white transition-colors">Select</label>
        </div>
        <div className={`border rounded-lg p-4 flex items-center justify-between transition-colors ${followingData ? 'border-[#363636] bg-[#262626]' : 'border-[#363636] hover:bg-[#262626]'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${followingData ? 'bg-green-900' : 'bg-[#363636]'}`}>
                {followingData ? <CheckCircle size={20} className="text-green-500"/> : <Upload size={20} className="text-white"/>}
            </div>
            <div>
                <div className="text-sm font-semibold">Following File</div>
                <div className="text-xs text-[#A8A8A8]">{fileNameFollowing || "following.json"}</div>
            </div>
          </div>
          <input type="file" accept=".json" onChange={(e) => handleFileUpload(e, 'following')} className="hidden" id="following-input"/>
          <label htmlFor="following-input" className="cursor-pointer text-[#0095F6] text-sm font-semibold hover:text-white transition-colors">Select</label>
        </div>
      </div>
      {error && <div className="text-[#ED4956] text-sm text-center mb-6">{error}</div>}
      <button onClick={analyzeData} disabled={!followersData || !followingData} className={`${igButtonClass} ${(!followersData || !followingData) ? 'opacity-50 cursor-not-allowed' : ''}`}>Analyze</button>
      <div className="text-center mt-4">
        <button onClick={() => setView('guide')} className="text-[#A8A8A8] text-xs hover:text-white transition">Back</button>
      </div>
    </div>
  );

  const renderResults = () => {
    let baseList = [];
    if (activeTab === 'not_following_back') baseList = notFollowingBack;
    else if (activeTab === 'fans') baseList = fans;
    else baseList = mutuals;

    // Apply Filters
    let filteredList = baseList.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'not_following_back') {
        if (hideSafeAccounts) {
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            filteredList = filteredList.filter(u => (now - u.timestamp) > thirtyDaysInMs);
        }
        if (hideBusinessAccounts) {
            filteredList = filteredList.filter(u => !isLikelyBusiness(u.username));
        }
    }

    const emptyMessage = activeTab === 'not_following_back' ? "Clean record! Everyone follows you back." 
                       : activeTab === 'fans' ? "You follow back all your fans!" 
                       : "No mutual connections found.";

    return (
      <div className={`max-w-4xl w-full mx-auto ${cardClass} text-white`}>
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-[#363636]">
          <h2 className="text-lg font-semibold">Analysis Results</h2>
          <div className="flex gap-2">
             <button onClick={() => downloadCSV(filteredList, activeTab)} className="bg-[#262626] hover:bg-[#363636] text-white px-3 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Download size={16} /> <span className="hidden sm:inline">Export</span>
             </button>
             <button onClick={() => setView('upload')} className={igSecondaryButton}>Start Over</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-[#363636]">
            <button onClick={() => setActiveTab('not_following_back')} className={`p-4 text-center hover:bg-[#262626] transition ${activeTab === 'not_following_back' ? 'bg-[#262626]' : ''}`}>
                <div className="text-[#ED4956] font-bold text-xl">{notFollowingBack.length}</div>
                <div className={`text-xs mt-1 ${activeTab === 'not_following_back' ? 'text-white font-semibold' : 'text-[#A8A8A8]'}`}>Not Back</div>
            </button>
            <button onClick={() => setActiveTab('fans')} className={`p-4 text-center hover:bg-[#262626] transition ${activeTab === 'fans' ? 'bg-[#262626]' : ''}`}>
                <div className="text-green-500 font-bold text-xl">{fans.length}</div>
                <div className={`text-xs mt-1 ${activeTab === 'fans' ? 'text-white font-semibold' : 'text-[#A8A8A8]'}`}>Fans</div>
            </button>
            <button onClick={() => setActiveTab('mutual')} className={`p-4 text-center hover:bg-[#262626] transition ${activeTab === 'mutual' ? 'bg-[#262626]' : ''}`}>
                <div className="text-white font-bold text-xl">{mutuals.length}</div>
                <div className={`text-xs mt-1 ${activeTab === 'mutual' ? 'text-white font-semibold' : 'text-[#A8A8A8]'}`}>Mutuals</div>
            </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-[#363636] bg-[#1a1a1a] flex flex-col gap-4">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} className="text-[#A8A8A8]" />
                </div>
                <input type="text" className={`${inputClass} pl-10`} placeholder="Search username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {activeTab === 'not_following_back' && (
                <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                        onClick={() => setHideSafeAccounts(!hideSafeAccounts)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition font-medium border
                            ${hideSafeAccounts ? 'bg-green-900/30 text-green-400 border-green-900' : 'bg-[#262626] text-[#A8A8A8] border-[#363636] hover:bg-[#363636]'}
                        `}
                    >
                        {hideSafeAccounts ? <ShieldCheck size={16} /> : <Filter size={16} />}
                        {hideSafeAccounts ? "New friends hidden" : "Hide new friends (30d)"}
                    </button>

                    <button 
                        onClick={() => setHideBusinessAccounts(!hideBusinessAccounts)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition font-medium border
                            ${hideBusinessAccounts ? 'bg-blue-900/30 text-blue-400 border-blue-900' : 'bg-[#262626] text-[#A8A8A8] border-[#363636] hover:bg-[#363636]'}
                        `}
                    >
                        {hideBusinessAccounts ? <Briefcase size={16} /> : <Briefcase size={16} />}
                        {hideBusinessAccounts ? "Businesses hidden" : "Hide likely businesses"}
                    </button>
                </div>
            )}
        </div>

        {/* List Content */}
        <div className="bg-[#000000]">  
          <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent">
              {filteredList.length === 0 ? (
                  <div className="p-12 text-center text-[#A8A8A8]">
                      <CheckCircle size={48} className="mx-auto mb-4 text-[#262626]" />
                      <p>{searchTerm ? "No users matching search." : emptyMessage}</p>
                  </div>
              ) : (
                  <ul className="divide-y divide-[#262626]">
                      {filteredList.map((user, idx) => (
                          <li key={idx} className="p-4 flex justify-between items-center hover:bg-[#121212] transition group">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[#A8A8A8] font-bold text-sm border border-[#262626] group-hover:border-[#363636]">
                                      {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-white block">{user.username}</span>
                                        {isLikelyBusiness(user.username) && !hideBusinessAccounts && (
                                            <span className="text-[10px] bg-[#262626] text-[#A8A8A8] px-1.5 py-0.5 rounded border border-[#363636]">Biz?</span>
                                        )}
                                      </div>
                                      <span className="text-xs text-[#555]">Followed: {new Date(user.timestamp).toLocaleDateString()}</span>
                                  </div>
                              </div>
                              <a href={`https://instagram.com/${user.username}`} target="_blank" rel="noreferrer"
                                  className="text-[#0095F6] text-xs font-semibold hover:text-white transition px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#363636]">
                                  View
                              </a>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
          <div className="p-2 bg-[#121212] border-t border-[#363636] text-center text-[10px] text-[#555]">
              Showing {filteredList.length} users
          </div>
        </div>
      </div>
    );
  };

return (
    <div className="min-h-screen w-full bg-black text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight flex items-center justify-center gap-2">
            <Camera size={28} /> <span>IG Analyzer</span>
        </h1>
        <p className="text-[#A8A8A8] text-sm">Local followers analysis</p>
      </div>
      
      <div className="w-full flex justify-center">
        {view === 'guide' && renderGuide()}
        {view === 'upload' && renderUpload()}
        {view === 'results' && renderResults()}
      </div>
      
      {/* Footer Attribution */}
      <div className="mt-12 mb-6 text-center space-y-2">
        <p className="text-[#363636] text-xs">Not affiliated with Meta or Instagram</p>
        <p className="text-[#A8A8A8] text-xs">
            Designed and built by <a href="https://github.com/ColeSwinford/ig-analyzer" target="_blank" rel="noreferrer" className="text-white hover:text-[#0095F6] transition font-medium">Cole Swinford</a>
        </p>
      </div>
    </div>
  );
}

export default InstagramAnalyzer;