import React, { useState } from 'react';
import { AlertTriangle, UserRoundX, Eye, UserRoundCheck, ShieldAlert, Fingerprint, Clock, Shield } from 'lucide-react';

const JoelDetectionScreen = ({ onReport, onIgnore, stepLabel }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportOption, setReportOption] = useState(null);
  
  const reportOptions = [
    "For unauthorized access to system resources",
    "For tampering with game configuration files",
    "For suspicious network activity on local ports",
    "For attempting to run unverified scripts"
  ];
  
  const handleReport = () => {
    setShowConfirmation(true);
  };
  
  const confirmReport = () => {
    onReport(reportOption);
  };
  
  const changeOption = () => {
    setShowConfirmation(false);
  };
  
  // Animation for alert pulse
  const pulseAnimation = {
    animation: 'pulse 2s infinite'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 max-w-2xl mx-auto">
      <div className="w-full bg-gray-900 border-t border-b border-red-500 py-3 mb-6 flex items-center justify-center">
        <ShieldAlert size={24} className="text-red-400 animate-pulse mr-3" />
        <h2 className="text-xl md:text-2xl font-bold text-red-400 tracking-wide">SECURITY ALERT: INTRUSION DETECTED</h2>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 w-full">
        <div className="flex justify-between items-center mb-5 border-b border-gray-700 pb-3">
          <div className="flex items-center">
            <Fingerprint size={18} className="text-yellow-500 mr-2" />
            <span className="text-yellow-400 font-mono text-sm">SECURITY PROTOCOL 9-A</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="text-gray-400 mr-2" />
            <span className="text-gray-400 text-xs font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      
        <div className="mb-5 bg-gray-900 rounded-md border-l-4 border-red-500 text-container">
          <div className="flex items-start">
            <UserRoundX size={22} className="text-red-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Unauthorized User Detected</h3>
              <p className="text-gray-300">
                Our systems have detected suspicious activity from <span className="font-bold text-red-400">Joel</span>. 
                This may compromise your system integrity.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-5 bg-gray-900 rounded-md border-l-4 border-yellow-500 text-container">
          <div className="flex items-start">
            <Eye size={22} className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Activity Log</h3>
              <p className="text-gray-300 mb-2">
                Joel has been observed initiating unauthorized processes and attempting to modify system files.
                These actions may have security implications.
              </p>
              <div className="font-mono text-xs text-gray-500 bg-gray-950 rounded code-block activity-log">
                <div>$ ls -la /system/config</div>
                <div>$ chmod 777 /system/config/game.ini</div>
                <div>$ cat /etc/shadow</div>
                <div>$ ./suspicious_script.sh</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Threat detection confidence:</span>
            <span className="text-sm text-red-400 font-bold">85%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse" style={{ width: '85%' }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-1 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span>Risk Level: High</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span>Origin: Internal Network</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>IP: 192.168.1.{Math.floor(Math.random() * 255)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span>Attempts: {Math.floor(Math.random() * 10) + 1}</span>
          </div>
        </div>
      </div>
      
      {!showConfirmation ? (
        <div className="w-full">
          <h3 className="text-lg text-center font-semibold text-white mb-4">Recommended Actions</h3>
          <div className="flex flex-col space-y-3 items-center">
            <button 
              onClick={handleReport}
              className="bg-gray-800 hover:bg-gray-900 border-2 border-red-500 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-200 max-w-md w-auto"
            >
              <AlertTriangle size={20} className="mr-2 text-red-500" />
              <span>Report Suspicious Activity</span>
            </button>
            
            <button 
              onClick={onIgnore}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-200 max-w-md w-auto"
            >
              <UserRoundCheck size={20} className="mr-2" />
              <span>Ignore (Accept Risk)</span>
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Shield size={12} className="mr-1" />
              <span>Secure alert system active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
            <Shield size={20} className="mr-2" />
            <span>Security Report</span>
          </h3>
          
          <p className="text-gray-300 mb-4">Please select a reason for this security report:</p>
          
          <div className="space-y-3 mb-6">
            {reportOptions.map((option, index) => (
              <div 
                key={index}
                className={`rounded cursor-pointer flex items-center transition-all duration-200 text-container ${
                  reportOption === index 
                    ? 'bg-gray-700 border border-yellow-500' 
                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                }`}
                onClick={() => setReportOption(index)}
              >
                <input 
                  type="radio" 
                  checked={reportOption === index}
                  onChange={() => setReportOption(index)}
                  className="mr-3"
                  id={`option-${index}`}
                />
                <label htmlFor={`option-${index}`} className="cursor-pointer text-gray-200">{option}</label>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
            <button
              onClick={changeOption}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium transition-colors duration-200 w-auto"
            >
              Cancel Report
            </button>
            <button
              onClick={confirmReport}
              className="bg-gray-800 hover:bg-gray-900 border-2 border-red-500 text-white font-bold py-3 px-6 rounded transition-colors duration-200 w-auto"
              disabled={reportOption === null}
            >
              Submit Report
            </button>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default JoelDetectionScreen; 