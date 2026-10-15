import React, { useState } from 'react';
import { Key, Pencil, Trash2, ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { HermesURL } from '../types';

interface UrlCardProps {
  item: HermesURL;
  onConnect: (item: HermesURL) => void;
  onEdit: (item: HermesURL) => void;
  onDelete: (id: string) => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({
  item,
  onConnect,
  onEdit,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 truncate">
              {item.name}
            </h3>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-slate-500 text-sm">
            <span className="truncate max-w-md font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {item.url}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.saveCredentials ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Key className="w-3 h-3 text-emerald-600" />
                <span>Credentials saved</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-slate-500 bg-slate-100 border border-slate-200">
                <span>No credentials saved</span>
              </span>
            )}
            {item.notes && (
              <span className="text-xs text-slate-400 italic">
                {item.notes}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {confirmDelete ? (
            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
              <span className="text-xs text-red-600 font-medium px-2">Delete?</span>
              <button
                onClick={() => onDelete(item.id)}
                className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-xs font-medium text-slate-600 bg-white rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onEdit(item)}
                title="Edit Server"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete Server"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => onConnect(item)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all cursor-pointer transform active:scale-98"
          >
            <span>Connect</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
