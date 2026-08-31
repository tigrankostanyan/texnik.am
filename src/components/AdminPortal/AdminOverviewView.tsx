import React from 'react';
import { useApp } from '../../context/AppContext';
import { getOrderStatusText } from '../../i18n/translations';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldAlert,
  Package,
  Activity,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminOverviewViewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigateTab }) => {
  const { orders, users, specialistProfiles, auditLogs, fraudAlerts, categories, language, t } = useApp();

  const totalGMV = orders
    .filter((o) => o.status === 'completed' || o.status === 'paid' || o.status === 'closed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalCommissionRevenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'paid' || o.status === 'closed')
    .reduce((sum, o) => sum + o.commissionAmount, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'closed' && o.status !== 'cancelled'
  ).length;

  const specialistsCount = users.filter((u) => u.role === 'specialist').length;
  const pendingAlertsCount = fraudAlerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.admin.overviewHeading}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.overviewSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            SuperAdmin Reborn v2.4
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total GMV */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.admin.turnoverGMV}
            </span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalGMV.toLocaleString()} ֏</div>
          <div className="text-[11px] text-slate-500">{orders.length} {t.admin.totalOrders}</div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.admin.platformCommission} (15%)
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {totalCommissionRevenue.toLocaleString()} ֏
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t.admin.netRevenue}
          </div>
        </div>

        {/* Active Orders */}
        <div
          onClick={() => onNavigateTab('admin_orders')}
          className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.admin.activeOrders}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{activeOrdersCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
            <span>Live Monitoring</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Anti-Fraud Alerts */}
        <div
          onClick={() => onNavigateTab('admin_fraud')}
          className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2 cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.admin.antiFraudAlerts}
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{pendingAlertsCount}</div>
          <div className="text-[11px] text-rose-600 font-semibold">
            {pendingAlertsCount > 0 ? t.admin.requiresAttention : t.admin.systemClean}
          </div>
        </div>
      </div>

      {/* Main Grid: Live Orders Feed & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              {t.admin.recentOrdersStream}
            </h3>
            <button
              onClick={() => onNavigateTab('admin_orders')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              {t.admin.viewAll} →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    #{ord.orderNumber}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{ord.serviceName}</div>
                    <div className="text-[11px] text-slate-500">
                      {ord.customerName} → {ord.specialistName || (language === 'ru' ? 'Мастер' : language === 'en' ? 'Specialist' : 'Վարպետ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{ord.totalAmount.toLocaleString()} ֏</div>
                    <div className="text-[10px] text-slate-400">{t.specialist.commission}՝ {ord.commissionAmount.toLocaleString()} ֏</div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'closed'
                        ? 'bg-slate-100 text-slate-700'
                        : ord.status === 'on_the_way'
                        ? 'bg-amber-100 text-amber-800'
                        : ord.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {getOrderStatusText(ord.status, language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Audit Trail & Security Logs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t.admin.auditTrail}
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {auditLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{log.details}</div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>{language === 'ru' ? 'Исполнитель' : language === 'en' ? 'Actor' : 'Կատարող'}՝ {log.actorName}</span>
                  <span className="font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

