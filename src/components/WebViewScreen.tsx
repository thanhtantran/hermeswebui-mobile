import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCw,
  ExternalLink,
  Key,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Maximize2,
  ShieldAlert,
  Info,
  Loader2,
  Lock,
} from 'lucide-react';
import { HermesURL, ViewportMode } from '../types';

interface WebViewScreenProps {
  urlData: HermesURL;
  onBack: () => void;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({
  urlData,
  onBack,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>('mobile');
  const [showSecurityHelper, setShowSecurityHelper] = useState(false);

  // Reset loading state on reload
  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  const copyPassword = () => {
    if (!urlData.password) return;
    navigator.clipboard.writeText(urlData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check iframe load timeout: if iframe fails to trigger load after 8s or server blocks embedding
  useEffect(() => {
    const timer = setTimeout(() => {
      // If still loading after 7s, keep iframe but suggest helper
      setShowSecurityHelper(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [iframeKey]);

  // Viewport container width styling
  const getViewportContainerClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-full max-w-[400px] h-[780px] rounded-[36px] shadow-2xl border-[10px] border-slate-900 bg-black overflow-hidden ring-1 ring-slate-800 my-4';
      case 'tablet':
        return 'w-full max-w-[768px] h-[820px] rounded-[28px] shadow-2xl border-[12px] border-slate-900 bg-black overflow-hidden ring-1 ring-slate-800 my-4';
      case 'responsive':
      default:
        return 'w-full h-full flex-1 rounded-none border-0';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-blue-600 text-white px-3 py-2.5 shadow-md shrink-0 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-2 -ml-1 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="Back to server list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight text-white">
              {urlData.name}
            </h2>
            <p className="text-[11px] text-blue-100 truncate font-mono opacity-90">
              {urlData.url}
            </p>
          </div>
        </div>

        {/* Viewport switchers & Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Viewport Toggles (Desktop only) */}
          <div className="hidden md:flex items-center bg-blue-700/60 p-0.5 rounded-lg border border-blue-400/30">
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
              title="Mobile Device View (390px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
              title="Tablet Device View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('responsive')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'responsive'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
              title="Full Window View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Copy Password Button (if saved) */}
          {urlData.saveCredentials && urlData.password && (
            <button
              onClick={copyPassword}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Copy saved password"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Pass</span>
                </>
              )}
            </button>
          )}

          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="p-2 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="Reload Hermes"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open in external tab button */}
          <a
            href={urlData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="Open Hermes directly in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Auto-login & Credential info strip */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-1.5 text-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {urlData.saveCredentials ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Lock className="w-3 h-3" />
              Auto-login ready
              {urlData.password && (
                <span className="text-slate-400 font-mono text-[11px] ml-1">
                  (Password: ••••••••)
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">
              No credentials stored for this instance
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={urlData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            <span>Launch Directly</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main WebView Content Area */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative overflow-auto p-2 sm:p-4">
        <div className={`relative flex flex-col ${getViewportContainerClass()} transition-all duration-300`}>
          {/* Mobile phone camera speaker notch simulation */}
          {viewport === 'mobile' && (
            <div className="h-6 bg-slate-900 w-full flex items-center justify-center shrink-0">
              <div className="w-20 h-3.5 bg-black rounded-full" />
            </div>
          )}

          {/* The IFrame */}
          <div className="relative w-full h-full flex-1 bg-white">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white text-slate-800">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-700">Loading Hermes WebUI...</p>
                <p className="text-xs text-slate-400 mt-1 font-mono">{urlData.url}</p>
              </div>
            )}

            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={urlData.url}
              title={urlData.name}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
              allow="microphone; camera; clipboard-read; clipboard-write; fullscreen"
            />
          </div>

          {/* Mobile home indicator simulation */}
          {viewport === 'mobile' && (
            <div className="h-4 bg-slate-900 w-full flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          )}
        </div>

        {/* Helpful overlay banner for iframe X-Frame-Options */}
        {showSecurityHelper && (
          <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-30 bg-slate-800/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Browser Security & Embed Note</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  If the screen displays a connection or refused error, Hermes WebUI uses protective headers (e.g. <code className="text-amber-300">X-Frame-Options</code>). Click below to launch in full tab:
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {urlData.saveCredentials && urlData.password && (
                <button
                  onClick={copyPassword}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy Pass'}</span>
                </button>
              )}
              <a
                href={urlData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
