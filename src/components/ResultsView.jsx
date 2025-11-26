import React, { useState } from 'react';
import { Download, Search, CheckCircle, ShieldCheck, Filter, Briefcase, Copy, Check } from 'lucide-react';
import { STYLES } from '../utils/constants';
import { downloadCSV } from '../utils/export';
import { isLikelyBusiness } from '../utils/analysis';

export const ResultsView = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('notFollowingBack');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [hideSafeAccounts, setHideSafeAccounts] = useState(false);
  const [hideBusinessAccounts, setHideBusinessAccounts] = useState(false);
  
  // Copy Button State
  const [copied, setCopied] = useState(false);

  // --- FILTERING LOGIC ---
  const filterList = (list, applyAdvancedFilters) => {
    if (!list) return [];
    
    // 1. Search Filter
    let filtered = list.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Advanced Filters (Only apply on 'Not Back' tab)
    if (applyAdvancedFilters) {
        // Safety Filter (30 days)
        if (hideSafeAccounts) {
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            filtered = filtered.filter(u => (now - u.timestamp) > thirtyDaysInMs);
        }
        // Business Filter (Heuristic)
        if (hideBusinessAccounts) {
            filtered = filtered.filter(u => !isLikelyBusiness(u.username));
        }
    }
    return filtered;
  };

  const filteredNotBack = filterList(results.notFollowingBack, true);
  const filteredFans = filterList(results.fans, false);
  const filteredMutuals = filterList(results.mutuals, false);

  let currentDisplayList = [];
  if (activeTab === 'notFollowingBack') currentDisplayList = filteredNotBack;
  else if (activeTab === 'fans') currentDisplayList = filteredFans;
  else if (activeTab === 'mutuals') currentDisplayList = filteredMutuals;

  // --- COPY LOGIC (Simple List) ---
  const handleCopyList = () => {
    // Just the usernames, separated by commas
    const names = currentDisplayList.map(u => u.username).join(', ');
    
    navigator.clipboard.writeText(names);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const emptyMessage = {
    notFollowingBack: "Clean record! Everyone follows you back.",
    fans: "You follow back all your fans!",
    mutuals: "No mutual connections found."
  }[activeTab];

  return (
    <div className={`max-w-4xl w-full mx-auto ${STYLES.card} text-white`}>
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-[#363636] gap-4">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        <div className="flex gap-2">
            {/* COPY BUTTON */}
            <button 
              onClick={handleCopyList} 
              className="bg-[#262626] hover:bg-[#363636] text-white px-3 py-2 rounded-lg text-sm transition flex items-center gap-2"
              title="Copy username list to clipboard"
            >
              {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />} 
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy List"}</span>
            </button>

            {/* EXPORT BUTTON */}
            <button onClick={() => downloadCSV(currentDisplayList, activeTab)} className="bg-[#262626] hover:bg-[#363636] text-white px-3 py-2 rounded-lg text-sm transition flex items-center gap-2">
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={onReset} className={STYLES.buttonSecondary}>Start Over</button>
        </div>
      </div>

      {/* Tabs */}
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} counts={{
        notFollowingBack: filteredNotBack.length,
        fans: filteredFans.length,
        mutuals: filteredMutuals.length
      }} />

      {/* Toolbar */}
      <Toolbar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
        activeTab={activeTab}
        hideSafeAccounts={hideSafeAccounts} setHideSafeAccounts={setHideSafeAccounts}
        hideBusinessAccounts={hideBusinessAccounts} setHideBusinessAccounts={setHideBusinessAccounts}
      />

      {/* List */}
      <UserList users={currentDisplayList} emptyMessage={emptyMessage} isSearch={!!searchTerm} showBizTag={!hideBusinessAccounts} />
    </div>
  );
};

// --- SUBCOMPONENTS ---

const TabNav = ({ activeTab, setActiveTab, counts }) => (
  <div className="grid grid-cols-3 border-b border-[#363636]">
    <TabButton isActive={activeTab === 'notFollowingBack'} onClick={() => setActiveTab('notFollowingBack')} count={counts.notFollowingBack} label="Not Back" color="text-[#ED4956]" />
    <TabButton isActive={activeTab === 'fans'} onClick={() => setActiveTab('fans')} count={counts.fans} label="Fans" color="text-green-500" />
    <TabButton isActive={activeTab === 'mutuals'} onClick={() => setActiveTab('mutuals')} count={counts.mutuals} label="Mutuals" color="text-white" />
  </div>
);

const TabButton = ({ isActive, onClick, count, label, color }) => (
  <button onClick={onClick} className={`p-4 text-center hover:bg-[#262626] transition ${isActive ? 'bg-[#262626]' : ''}`}>
    <div className={`${color} font-bold text-xl transition-all duration-300`}>{count}</div>
    <div className={`text-xs mt-1 ${isActive ? 'text-white font-semibold' : 'text-[#A8A8A8]'}`}>{label}</div>
  </button>
);

const Toolbar = ({ searchTerm, setSearchTerm, activeTab, hideSafeAccounts, setHideSafeAccounts, hideBusinessAccounts, setHideBusinessAccounts }) => (
  <div className="p-4 border-b border-[#363636] bg-[#1a1a1a] flex flex-col gap-4">
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={16} className="text-[#A8A8A8]" />
      </div>
      <input type="text" className={`${STYLES.input} pl-10`} placeholder="Search username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
    </div>

    {activeTab === 'notFollowingBack' && (
      <div className="flex flex-col sm:flex-row gap-2">
        <FilterButton 
          isActive={hideSafeAccounts} 
          onClick={() => setHideSafeAccounts(!hideSafeAccounts)} 
          activeColor="text-green-400 border-green-900 bg-green-900/30" 
          labelOn="New friends hidden" 
          labelOff="Hide new friends (30d)" 
          icon={ShieldCheck} 
        />
        <FilterButton 
          isActive={hideBusinessAccounts} 
          onClick={() => setHideBusinessAccounts(!hideBusinessAccounts)} 
          activeColor="text-blue-400 border-blue-900 bg-blue-900/30" 
          labelOn="Non-personal hidden" 
          labelOff="Hide likely non-personal" 
          icon={Briefcase} 
        />
      </div>
    )}
  </div>
);

const FilterButton = ({ isActive, onClick, activeColor, labelOn, labelOff, icon: Icon }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition font-medium border
      ${isActive ? activeColor : 'bg-[#262626] text-[#A8A8A8] border-[#363636] hover:bg-[#363636]'}
    `}
  >
    <Icon size={16} /> {isActive ? labelOn : labelOff}
  </button>
);

const UserList = ({ users, emptyMessage, isSearch, showBizTag }) => (
  <div className="bg-[#000000]">  
    <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-[#262626] scrollbar-track-transparent">
      {users.length === 0 ? (
        <div className="p-12 text-center text-[#A8A8A8]">
          <CheckCircle size={48} className="mx-auto mb-4 text-[#262626]" />
          <p>{isSearch ? "No users matching search." : emptyMessage}</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#262626]">
          {users.map((user, idx) => (
            <li key={idx} className="p-4 flex justify-between items-center hover:bg-[#121212] transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-[#A8A8A8] font-bold text-sm border border-[#262626] group-hover:border-[#363636]">
                  {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white block">{user.username}</span>
                    {showBizTag && isLikelyBusiness(user.username) && (
                      <span className="text-[10px] bg-[#262626] text-[#A8A8A8] px-1.5 py-0.5 rounded border border-[#363636]">Page?</span>
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
      Showing {users.length} users
    </div>
  </div>
);