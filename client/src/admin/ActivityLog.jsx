import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { ShieldCheck, RefreshCw, AlertTriangle, Key, Edit, Trash2, CheckCircle2, UserCheck, Download } from 'lucide-react';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAuditLogs();
      setLogs(res || []);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getEventBadge = (action) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return {
          icon: UserCheck,
          label: 'Admin Login',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
        };
      case 'LOGIN_FAILED':
      case 'ACCOUNT_LOCKED':
        return {
          icon: AlertTriangle,
          label: action === 'ACCOUNT_LOCKED' ? 'Account Locked' : 'Failed Login',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        };
      case 'PRICE_UPDATED':
        return {
          icon: Edit,
          label: 'Price Changed',
          color: 'bg-amber-950/80 text-amber-300 border-amber-500/40'
        };
      case 'PASSWORD_CHANGED':
        return {
          icon: Key,
          label: 'Password Changed',
          color: 'bg-blue-950/80 text-blue-300 border-blue-500/40'
        };
      case 'BACKUP_EXPORTED':
        return {
          icon: Download,
          label: 'Backup Exported',
          color: 'bg-purple-950/80 text-purple-300 border-purple-500/40'
        };
      case 'UPLOAD_BLOCKED':
        return {
          icon: AlertTriangle,
          label: 'Upload Blocked',
          color: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        };
      default:
        return {
          icon: CheckCircle2,
          label: action.replace(/_/g, ' '),
          color: 'bg-zinc-800 text-zinc-300 border-zinc-700'
        };
    }
  };

  const formatTimestamp = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-serif text-lg font-bold">
              Security & Activity Audit Trail
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time record of administrative logins, menu changes, price updates, and access security events.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Log Feed */}
      <div className="rounded-2xl glass-panel border border-zinc-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 text-xs animate-pulse">
            Loading activity log...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No activity logged yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80 max-h-[600px] overflow-y-auto">
            {logs.map((log) => {
              const badge = getEventBadge(log.action);
              const Icon = badge.icon;
              return (
                <div key={log.id} className="p-3.5 sm:p-4 hover:bg-zinc-800/30 transition-colors flex items-start gap-3">
                  <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-1 text-xs text-zinc-300 font-light">
                      {log.details ? (
                        <span>
                          {log.details.name && <span className="font-semibold text-amber-200">"{log.details.name}" </span>}
                          {log.details.oldPrice && log.details.newPrice && (
                            <span>price updated from ₹{log.details.oldPrice} → ₹{log.details.newPrice} </span>
                          )}
                          {log.details.isAvailable !== undefined && (
                            <span>availability set to {log.details.isAvailable ? 'In Stock' : 'Sold Out'} </span>
                          )}
                          {log.details.reason && <span className="text-rose-300">{log.details.reason} </span>}
                          {log.details.attemptsRemaining !== undefined && (
                            <span className="text-rose-300">({log.details.attemptsRemaining} attempt(s) remaining) </span>
                          )}
                          {log.details.message && <span>{log.details.message} </span>}
                        </span>
                      ) : (
                        <span>Event processed</span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
