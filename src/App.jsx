import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useInstagramData } from './hooks/useInstagramData';
import { GuideView } from './components/GuideView';
import { UploadView } from './components/UploadView';
import { ResultsView } from './components/ResultsView';
import { Footer } from './components/Footer';

const InstagramAnalyzer = () => {
  const [view, setView] = useState('guide'); // 'guide', 'upload', 'results'
  const [results, setResults] = useState(null);
  
  const { 
    followersData, 
    followingData, 
    fileNameFollowers, 
    fileNameFollowing, 
    error, 
    handleFileUpload, 
    processData 
  } = useInstagramData();

  const handleAnalyze = () => {
    const calculatedResults = processData();
    if (calculatedResults) {
      setResults(calculatedResults);
      setView('results');
    }
  };

  const handleReset = () => {
    setView('upload');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2 tracking-tight flex items-center justify-center gap-2">
            <Camera size={28} /> <span>IG Analyzer</span>
        </h1>
        <p className="text-[#A8A8A8] text-sm">Local followers analysis</p>
      </div>
      
      {/* Main Content Area */}
      <div className="w-full flex justify-center">
        {view === 'guide' && <GuideView onStart={() => setView('upload')} />}
        
        {view === 'upload' && (
          <UploadView 
            followersData={followersData} 
            followingData={followingData}
            fileNameFollowers={fileNameFollowers}
            fileNameFollowing={fileNameFollowing}
            handleFileUpload={handleFileUpload}
            onAnalyze={handleAnalyze}
            onBack={() => setView('guide')}
            error={error}
          />
        )}
        
        {view === 'results' && results && (
          <ResultsView results={results} onReset={handleReset} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default InstagramAnalyzer;