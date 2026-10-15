import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlCard } from './components/UrlCard';
import { UrlModal } from './components/UrlModal';
import { WebViewScreen } from './components/WebViewScreen';
import { BackupModal } from './components/BackupModal';
import { HermesURL } from './types';
import {
  loadStoredUrls,
  saveStoredUrls,
  DEFAULT_PRESET,
} from './utils/storage';
import {
  Server,
  Plus,
  Search,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function App() {
  const [urls, setUrls] = useState<HermesURL[]>([]);
  const [activeUrl, setActiveUrl] = useState<HermesURL | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HermesURL | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from local storage
  useEffect(() => {
    const loaded = loadStoredUrls();
    setUrls(loaded);
  }, []);

  const handleSaveUrls = (newUrls: HermesURL[]) => {
    setUrls(newUrls);
    saveStoredUrls(newUrls);
  };

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
    } else {
      // Add new
      const newItem: HermesURL = {
        id: `hermes-${Date.now()}`,
        ...data,
        createdAt: Date.now(),
      };
      handleSaveUrls([...urls, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const remaining = urls.filter((u) => u.id !== id);
    handleSaveUrls(remaining);
  };

  const handleConnect = (item: HermesURL) => {
    // Update last connected timestamp
    const updated = urls.map((u) =>
      u.id === item.id ? { ...u, lastConnectedAt: Date.now() } : u
    );
    handleSaveUrls(updated);
    setActiveUrl(item);
  };

  const handleAddDefaultPreset = () => {
    const exists = urls.some((u) => u.url === DEFAULT_PRESET.url);
    if (!exists) {
      handleSaveUrls([...urls, { ...DEFAULT_PRESET, id: `demo-${Date.now()}` }]);
    }
  };

  const handleImportSuccess = (imported: HermesURL[]) => {
    // Merge without duplicates by URL
    const existingUrlsMap = new Map(urls.map((u) => [u.url, u]));
    imported.forEach((item) => {
      existingUrlsMap.set(item.url, item);
    });
    const merged = Array.from(existingUrlsMap.values());
    handleSaveUrls(merged);
  };

  // If user is currently connected to a server, render the WebView Screen
  if (activeUrl) {
    return (
      <WebViewScreen
        urlData={activeUrl}
        onBack={() => setActiveUrl(null)}
      />
    );
  }

  const filteredUrls = urls.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-200">
      {/* Top Banner Header */}
      <Header
        serverCount={urls.length}
        onOpenAddModal={handleOpenAdd}
        onOpenBackupModal={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6">
        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by server name or URL..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {!urls.some((u) => u.url === DEFAULT_PRESET.url) && (
              <button
                onClick={handleAddDefaultPreset}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Restore OrangePi Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Server List */}
        {filteredUrls.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Server className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {searchQuery ? 'No matching servers found' : 'No Hermes Servers Configured'}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {searchQuery
                ? `No servers matched "${searchQuery}". Try a different keyword.`
                : 'Add your Hermes WebUI instances to easily connect with saved password credentials and auto-login.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Your First Server</span>
              </button>
              <button
                onClick={handleAddDefaultPreset}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Add OrangePi Demo Server</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {filteredUrls.map((item) => (
              <UrlCard
                key={item.id}
                item={item}
                onConnect={handleConnect}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Info Card / Hermes Guide */}
        <div className="mt-10 bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-xs text-blue-900">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100/80 text-blue-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-sm text-blue-950">About Hermes Mobile & Credentials</h4>
              <p className="text-blue-800 leading-relaxed">
                Hermes WebUI instances use password-only authentication. When you save a password for a server, this app preserves it in local browser storage and readies auto-login and 1-click password copy whenever you connect.
              </p>
              <div className="pt-1 flex items-center gap-4 text-[11px] text-blue-700 font-medium">
                <span>• Official Test: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-mono">hermes.orangepi.vn</code></span>
                <span>• Default Password: <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-900 font-mono">orangepi</code></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-xs py-4 px-4 text-center text-xs text-slate-500">
        <p>Hermes Mobile WebUI • Seamless Multi-Server Management</p>
      </footer>

      {/* Add / Edit Modal */}
      <UrlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        editingItem={editingItem}
      />

      {/* Backup / Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        urls={urls}
        onImport={handleImportSuccess}
      />
    </div>
  );
}
