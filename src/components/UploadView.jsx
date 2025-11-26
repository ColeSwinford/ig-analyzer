import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { STYLES } from '../utils/constants';

export const UploadView = ({ 
  followersData, 
  followingData, 
  fileNameFollowers, 
  fileNameFollowing, 
  handleFileUpload, 
  onAnalyze,
  onBack,
  error 
}) => (
  <div className={`max-w-2xl w-full mx-auto p-10 ${STYLES.card} text-white`}>
    <h2 className="text-xl font-semibold mb-8 text-center">Upload Files</h2>
    <div className="space-y-4 mb-8">
      <FileUploader 
        label="Followers File" 
        fileName={fileNameFollowers} 
        hasData={!!followersData} 
        onChange={(e) => handleFileUpload(e, 'followers')} 
        id="followers"
      />
      <FileUploader 
        label="Following File" 
        fileName={fileNameFollowing} 
        hasData={!!followingData} 
        onChange={(e) => handleFileUpload(e, 'following')} 
        id="following"
      />
    </div>
    
    {error && <div className="text-[#ED4956] text-sm text-center mb-6">{error}</div>}
    
    <button 
      onClick={onAnalyze} 
      disabled={!followersData || !followingData} 
      className={`${STYLES.buttonPrimary} ${(!followersData || !followingData) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Analyze
    </button>
    
    <div className="text-center mt-4">
      <button onClick={onBack} className="text-[#A8A8A8] text-xs hover:text-white transition">Back</button>
    </div>
  </div>
);

const FileUploader = ({ label, fileName, hasData, onChange, id }) => (
  <div className={`border rounded-lg p-4 flex items-center justify-between transition-colors ${hasData ? 'border-[#363636] bg-[#262626]' : 'border-[#363636] hover:bg-[#262626]'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasData ? 'bg-green-900' : 'bg-[#363636]'}`}>
          {hasData ? <CheckCircle size={20} className="text-green-500"/> : <Upload size={20} className="text-white"/>}
      </div>
      <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-[#A8A8A8]">{fileName || (id === 'followers' ? "followers_1.json" : "following.json")}</div>
      </div>
    </div>
    <input type="file" accept=".json" onChange={onChange} className="hidden" id={id}/>
    <label htmlFor={id} className="cursor-pointer text-[#0095F6] text-sm font-semibold hover:text-white transition-colors">Select</label>
  </div>
);