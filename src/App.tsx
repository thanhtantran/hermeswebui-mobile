import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { UrlCard } from './components/UrlCard';
import { UrlModal } from './components/UrlModal';
import { WebViewScreen } from './components/WebViewScreen';
import { BackupModal } from './components/BackupModal';
import { HermesURL, PingResult, Language } from './types';
import {
  loadStoredUrls,
  saveStoredUrls,
  DEFAULT_PRESET,
} from './utils/storage';
import { pingServerUrl } from './utils/ping';
import {
  getStoredLanguage,
  saveStoredLanguage,
  translations,
} from './utils/i18n';
import {
  Server,
  Plus,
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu,
} from 'lucide-react';

export default function App() {
  const [urls, setUrls] = useState<HermesURL[]>([]);
  const [activeUrl, setActiveUrl] = useState<HermesURL | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HermesURL | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>(getStoredLanguage);

  // Ping status tracking
  const [pingResults, setPingResults] = useState<Record<string, PingResult>>({});
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<number | null>(null);

  const t = translations[currentLang];

  // Load URLs from storage on startup
  useEffect(() => {
    const loaded = loadStoredUrls();
    setUrls(loaded);
  }, []);

  const handleToggleLanguage = (newLang: Language) => {
    setCurrentLang(newLang);
    saveStoredLanguage(newLang);
  };

  const handleSaveUrls = (newUrls: HermesURL[]) => {
    setUrls(newUrls);
    saveStoredUrls(newUrls);
  };

  // Ping a single server
  const handlePingSingle = useCallback(async (item: HermesURL) => {
    setPingResults((prev) => ({
      ...prev,
      [item.id]: { status: 'checking' },
    }));

    const result = await pingServerUrl(item.url);

    setPingResults((prev) => ({
      ...prev,
      [item.id]: {
        status: result.isOnline ? 'online' : 'offline',
        latencyMs: result.latencyMs,
        lastCheckedAt: Date.now(),
        error: result.error,
      },
    }));
  }, []);

  // Ping all servers concurrently
  const handlePingAll = useCallback(async (targets?: HermesURL[]) => {
    const listToPing = targets || urls;
    if (listToPing.length === 0) return;

    setIsPingingAll(true);

    // Set all to checking
    setPingResults((prev) => {
      const next = { ...prev };
      listToPing.forEach((u) => {
        next[u.id] = { ...next[u.id], status: 'checking' };
      });
      return next;
    });

    const pingPromises = listToPing.map(async (u) => {
      const res = await pingServerUrl(u.url);
      return {
        id: u.id,
        pingResult: {
          status: (res.isOnline ? 'online' : 'offline') as 'online' | 'offline',
          latencyMs: res.latencyMs,
          lastCheckedAt: Date.now(),
          error: res.error,
        },
      };
    });

    const results = await Promise.all(pingPromises);

    setPingResults((prev) => {
      const next = { ...prev };
      results.forEach((r) => {
        next[r.id] = r.pingResult;
      });
      return next;
    });

    setLastCheckedTime(Date.now());
    setIsPingingAll(false);
  }, [urls]);

  // Ref to hold latest handlePingAll for interval
  const pingAllRef = useRef(handlePingAll);
  useEffect(() => {
    pingAllRef.current = handlePingAll;
  }, [handlePingAll]);

  // Auto-ping on initial load once URLs are populated
  const hasInitialPingRun = useRef(false);
  useEffect(() => {
    if (urls.length > 0 && !hasInitialPingRun.current) {
      hasInitialPingRun.current = true;
      handlePingAll(urls);
    }
  }, [urls, handlePingAll]);

  // Periodic polling every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pingAllRef.current();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: HermesURL) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<HermesURL, 'id'>, id?: string) => {
    if (id) {
      // Update existing
      const updated = urls.map((u) => (u.id === id ? { ...u, ...data } : u));
      handleSaveUrls(updated);
      const target = updated.find((u) => u.id === id);
      if (target) handlePingSingle(target);
    } else {
      // Add new
      const newItem: HermesURL = {
        id: `hermes-${Date.now()}`,
        ...data,
        createdAt: Date.now(),
      };
      const updated = [...urls, newItem];
      handleSaveUrls(updated);
      handlePingSingle(newItem);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const remaining = urls.filter((u) => u.id !== id);
    handleSaveUrls(remaining);
    setPingResults((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleConnect = (item: HermesURL) => {
    const updated = urls.map((u) =>
      u.id === item.id ? { ...u, lastConnectedAt: Date.now() } : u
    );
    handleSaveUrls(updated);
    setActiveUrl(item);
  };

  const handleAddDefaultPreset = () => {
    const exists = urls.some((u) => u.url === DEFAULT_PRESET.url);
    if (!exists) {
      const demoItem = { ...DEFAULT_PRESET, id: `demo-${Date.now()}` };
      const updated = [...urls, demoItem];
      handleSaveUrls(updated);
      handlePingSingle(demoItem);
    }
  };

  const handleImportSuccess = (imported: HermesURL[]) => {
    const existingUrlsMap = new Map(urls.map((u) => [u.url, u]));
    imported.forEach((item) => {
      existingUrlsMap.set(item.url, item);
    });
    const merged = Array.from(existingUrlsMap.values());
    handleSaveUrls(merged);
    handlePingAll(merged);
  };

  // If connected to a server instance, render WebView Session Screen
  if (activeUrl) {
    return (
      <WebViewScreen
        urlData={activeUrl}
        onBack={() => setActiveUrl(null)}
        currentLang={currentLang}
      />
    );
  }

  const filteredUrls = urls.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Terminal Top Navigation Bar */}
      <Header
        serverCount={urls.length}
        currentLang={currentLang}
        onToggleLanguage={handleToggleLanguage}
        onOpenAddModal={handleOpenAdd}
        onOpenBackupModal={() => setIsBackupOpen(true)}
      />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* Telemetry & Search Toolbar */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPingAll={() => handlePingAll()}
          isPingingAll={isPingingAll}
          lastCheckedTime={lastCheckedTime}
          urls={urls}
          pingResults={pingResults}
          currentLang={currentLang}
        />

        {/* Server Endpoint Grid / List */}
        {filteredUrls.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center shadow-inner">
            <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Server className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1 tracking-wider uppercase">
              {searchQuery ? t.noSearchMatch : t.noServersTitle}
            </h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto mb-5 leading-relaxed">
              {searchQuery
                ? `${t.noSearchMatch}: "${searchQuery}"`
                : t.noServersDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t.addFirstServer}</span>
              </button>
              <button
                onClick={handleAddDefaultPreset}
                className="px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.restoreDemo}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredUrls.map((item) => (
              <UrlCard
                key={item.id}
                item={item}
                pingResult={pingResults[item.id]}
                onConnect={handleConnect}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onPingSingle={handlePingSingle}
                currentLang={currentLang}
              />
            ))}
          </div>
        )}

        {/* System Architecture & Security Notice Guide */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-slate-200 tracking-wide text-xs">
                {t.guideTitle}
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t.guideDesc}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span>
                  {t.demoHost} <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">hermes.orangepi.vn</code>
                </span>
                <span>
                  {t.demoPass} <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">orangepi</code>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-[11px] text-slate-500">
        <p className="font-mono">
          HERMES.UI CONSOLE · AUTONOMOUS AGENT SUITE
        </p>
      </footer>

      {/* Add / Edit Modal */}
      <UrlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        editingItem={editingItem}
        currentLang={currentLang}
      />

      {/* Backup / Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        urls={urls}
        onImport={handleImportSuccess}
        currentLang={currentLang}
      />
    </div>
  );
}
