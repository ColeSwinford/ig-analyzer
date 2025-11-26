import React from 'react';
import { HelpCircle, AlertTriangle, Server, Lock } from 'lucide-react';
import { STYLES } from '../utils/constants';

export const GuideView = ({ onStart }) => (
  <div className={`max-w-5xl w-full ${STYLES.card} text-white flex flex-col md:flex-row`}>
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
        <button onClick={onStart} className={STYLES.buttonPrimary}>I have my files ready</button>
      </div>
    </div>
    
    <div className="bg-black md:w-1/2 p-10 border-l border-[#363636]">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">Why do it this way?</h2>
      <div className="space-y-4">
        <InfoItem icon={AlertTriangle} color="text-[#ED4956]" title="Avoid Account Bans" desc="Apps that ask for your password are flagged as 'automated activity' and will get your account suspended." />
        <InfoItem icon={Server} color="text-white" title="No API Access" desc="Instagram removed the ability for apps to check your followers years ago. Manual data export is the only legal method left." />
        <InfoItem icon={Lock} color="text-[#0095F6]" title="100% Client-Side" desc="Your data is processed in your browser memory. It is never uploaded to any server." />
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, color, title, desc }) => (
  <div className="flex gap-4">
    <Icon size={20} className={`${color} shrink-0 mt-1`} />
    <div>
      <h3 className={`font-semibold text-sm ${color}`}>{title}</h3>
      <p className="text-[#A8A8A8] text-xs mt-1">{desc}</p>
    </div>
  </div>
);