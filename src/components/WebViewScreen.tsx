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
  Loader2,
  Lock,
} from 'lucide-react';
import { HermesURL, ViewportMode, Language } from '../types';
import { translations } from '../utils/i18n';

interface WebViewScreenProps {
  urlData: HermesURL;
  onBack: () => void;
  currentLang: Language;
}

export const WebViewScreen: React.FC<WebViewScreenProps> = ({
  urlData,
  onBack,
  currentLang,
}) => {
  const t = translations[currentLang];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>('mobile');
  const [showSecurityHelper, setShowSecurityHelper] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecurityHelper(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [iframeKey]);

  const getViewportContainerClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-full max-w-[390px] h-[780px] rounded-[36px] shadow-2xl border-[10px] border-slate-900 bg-black overflow-hidden ring-1 ring-slate-800/80 my-3';
      case 'tablet':
        return 'w-full max-w-[768px] h-[820px] rounded-[28px] shadow-2xl border-[12px] border-slate-900 bg-black overflow-hidden ring-1 ring-slate-800/80 my-3';
      case 'responsive':
      default:
        return 'w-full h-full flex-1 rounded-none border-0';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-mono">
      {/* Top Console Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800/80 px-3 py-2.5 shadow-md shrink-0 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
            title="Return to console overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.backToConsole}</span>
          </button>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-slate-100 truncate tracking-tight">
              {urlData.name}
            </h2>
            <p className="text-[10px] text-slate-400 truncate opacity-90">
              {urlData.url}
            </p>
          </div>
        </div>

        {/* Viewport Modes & Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Viewport Toggles (Desktop only) */}
          <div className="hidden md:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile Device View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tablet Device View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('responsive')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewport === 'responsive'
                  ? 'bg-slate-800 text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Full Window View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Password Button (if saved) */}
          {urlData.saveCredentials && urlData.password && (
            <button
              onClick={copyPassword}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy saved password to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.copiedShort}</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.copyPass}</span>
                </>
              )}
            </button>
          )}

          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Reload frame session"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in external tab button */}
          <a
            href={urlData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors cursor-pointer"
            title="Open Hermes directly in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Auto-login & Credential info strip */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 text-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {urlData.saveCredentials ? (
            <span className="inline-flex items-center gap-1 text-cyan-400 text-[11px]">
              <Lock className="w-3 h-3" />
              {t.autoLoginReady}
              {urlData.password && (
                <span className="text-slate-500 text-[10px] ml-1">
                  (••••••••)
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-500 text-[11px]">
              {t.noCredsSession}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={urlData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 font-medium"
          >
            <span>{t.launchDirect}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main WebView Content Area */}
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative overflow-auto p-2 sm:p-4">
        <div className={`relative flex flex-col ${getViewportContainerClass()} transition-all duration-300`}>
          {/* Mobile phone camera notch simulation */}
          {viewport === 'mobile' && (
            <div className="h-6 bg-slate-900 w-full flex items-center justify-center shrink-0">
              <div className="w-20 h-3 bg-black rounded-full" />
            </div>
          )}

          {/* IFrame */}
          <div className="relative w-full h-full flex-1 bg-slate-950">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <p className="text-xs font-mono font-semibold text-slate-200">{t.loadingFrame}</p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">{urlData.url}</p>
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
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>
          )}
        </div>

        {/* Security fallback notification banner */}
        {showSecurityHelper && (
          <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-2xl text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 font-mono">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-100 text-xs">{t.securityNoticeTitle}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {t.securityNoticeDesc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {urlData.saveCredentials && urlData.password && (
                <button
                  onClick={copyPassword}
                  className="flex-1 sm:flex-none px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? t.copiedShort : t.copyPass}</span>
                </button>
              )}
              <a
                href={urlData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>{t.openTabBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
