import React, { useState, useEffect } from 'react';
import { CheckCircle, ThumbsUp, UserRoundX, Shield, Clock } from 'lucide-react';

const JoelResponseScreen = ({ reportReason, onContinue, stepLabel }) => {
  const [stage, setStage] = useState(0);
  
  // Responses based on the reason for reporting
  const responses = [
    { // Unauthorized access
      title: "Security Response Team Deployed",
      text: "Our automated security system has been activated to monitor the unauthorized access. All suspicious processes have been terminated.",
      action: "User 'Joel' has been temporarily restricted from accessing system resources pending investigation."
    },
    { // Tampering with files
      title: "File Integrity Protocol Activated",
      text: "We've initiated a full system scan to identify any modified files. Corrupted game files will be restored from backup.",
      action: "All system changes made by the identified user have been reverted to stable state."
    },
    { // Network activity
      title: "Network Security Protocol Engaged",
      text: "Our firewall has blocked the suspicious network activity. All vulnerable ports have been secured and traffic is being monitored.",
      action: "A detailed log of unauthorized connection attempts has been sent to the system administrator."
    },
    { // Unverified scripts
      title: "Script Execution Prevention Activated",
      text: "The unverified scripts have been quarantined and examined by our security system. No malicious code was allowed to execute.",
      action: "Enhanced script verification protocols have been implemented to prevent future incidents."
    }
  ];
  
  const response = responses[reportReason] || responses[0];
  
  useEffect(() => {
    // Animation sequence for response stages
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 4000)
    ];
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-white mb-8">
        <CheckCircle size={64} />
      </div>
      
      <h2 className="text-2xl font-bold mb-8 text-white">Report Processed</h2>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-10 w-full max-w-md">
        {stage >= 1 && (
          <div className="animate-slide-in mb-8">
            <h3 className="text-xl font-bold text-white mb-4">{response.title}</h3>
            <div className="flex items-start">
              <Shield size={24} className="text-blue-400 mr-3 flex-shrink-0 mt-1" />
              <p className="text-gray-300">
                {response.text}
              </p>
            </div>
          </div>
        )}
        
        {stage >= 2 && (
          <div className="animate-slide-in border-t border-gray-700 pt-6 mb-8">
            <div className="flex items-start">
              <UserRoundX size={24} className="text-red-500 mr-3 flex-shrink-0 mt-1" />
              <p className="text-gray-300">
                {response.action}
              </p>
            </div>
          </div>
        )}
        
        {stage >= 3 && (
          <div className="animate-fade-in flex items-center justify-between border-t border-gray-700 pt-6">
            <div className="flex items-center">
              <Clock size={20} className="text-gray-400 mr-2" />
              <span className="text-gray-400 text-sm">Incident #SEC-{Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp size={20} className="text-green-500 mr-2" />
              <span className="text-gray-400 text-sm">Threat mitigated</span>
            </div>
          </div>
        )}
      </div>
      
      {stage >= 3 && (
        <button 
          onClick={onContinue}
          className="bg-gray-100 hover:bg-white text-gray-900 font-medium py-4 px-10 rounded-md flex items-center justify-center animate-fade-in transition-colors duration-200"
        >
          Continue to Game Setup
        </button>
      )}
      
      <div className="text-xs text-gray-500 mt-8">
        {stepLabel}
      </div>
    </div>
  );
};

export default JoelResponseScreen; 