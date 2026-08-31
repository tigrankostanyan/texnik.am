import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  UserX,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Flag,
  RotateCcw,
  Search,
  Lock,
  Unlock,
} from 'lucide-react';

export const AdminFraudModerationView: React.FC = () => {
  const { users, fraudAlerts, dismissFraudAlert, freezeUserAccount, unblockUserAccount, auditLogs, language, t } = useApp();

  const [activeTab, setActiveTab] = useState<'alerts' | 'users'>('alerts');
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = users.filter((u) => {
    if (searchUser.trim()) {
      const q = searchUser.toLowerCase();
      return (
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.admin.fraudModerationTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.fraudModerationSubtitle}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'alerts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.admin.alertsQueue} ({fraudAlerts.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.admin.usersList} ({users.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Anti-Fraud Alerts Feed */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {fraudAlerts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">{t.admin.noSecurityAlerts}</h3>
              <p className="text-xs text-slate-500">{t.admin.allClear}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-3xl border p-5 shadow-xs transition-all space-y-3 ${
                    alert.severity === 'high'
                      ? 'border-rose-300 bg-rose-50/30'
                      : alert.severity === 'medium'
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-xl ${
                          alert.severity === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                          {alert.reason}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              alert.severity === 'high'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alert.severity} risk
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {language === 'ru' ? 'Пользователь:' : language === 'en' ? 'User:' : 'Օգտատեր՝'} <b>{alert.targetUserName}</b> (ID: {alert.targetUserId})
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.createdAt).toLocaleString(language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-2xl border border-slate-200/80 leading-relaxed">
                    {alert.details}
                  </p>

                  {/* Actions for this alert */}
                  <div className="flex flex-wrap gap-2 justify-end pt-1">
                    <button
                      onClick={() => dismissFraudAlert(alert.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      {t.admin.dismissAlert}
                    </button>
                    <button
                      onClick={() => freezeUserAccount(alert.targetUserId, alert.reason)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      {t.admin.blockAccount}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Accounts Directory & Statuses */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.admin.searchPlaceholder}
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {filteredUsers.length} {t.admin.usersList}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">{language === 'ru' ? 'Пользователь' : language === 'en' ? 'User' : 'Օգտատեր'}</th>
                  <th className="pb-3">{language === 'ru' ? 'Роль' : language === 'en' ? 'Role' : 'Դեր'}</th>
                  <th className="pb-3">{language === 'ru' ? 'Контакты' : language === 'en' ? 'Contacts' : 'Կոնտակտներ'}</th>
                  <th className="pb-3">{language === 'ru' ? 'Верификация' : language === 'en' ? 'Verification' : 'Վերիֆիկացիա'}</th>
                  <th className="pb-3">Strikes</th>
                  <th className="pb-3">{t.orders.status}</th>
                  <th className="pb-3 text-right">{t.admin.actionCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'specialist'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{u.phone}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-[11px]">
                        {u.isPhoneVerified ? (
                          <span className="text-emerald-600 font-bold">✓ Phone OTP</span>
                        ) : (
                          <span className="text-slate-400">✕ No Phone</span>
                        )}
                        {u.twoFactorEnabled && (
                          <span className="text-purple-600 font-bold ml-1">● 2FA</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold ${
                          u.moderationStrikes > 0 ? 'text-rose-600' : 'text-slate-600'
                        }`}
                      >
                        {u.moderationStrikes} / 3
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {u.status === 'banned' || u.status === 'frozen' ? (
                        <button
                          onClick={() => unblockUserAccount(u.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold flex items-center gap-1 ml-auto"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          {t.admin.activateUser}
                        </button>
                      ) : (
                        <button
                          onClick={() => freezeUserAccount(u.id, 'Ադմինի որոշում')}
                          className="px-2.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors ml-auto"
                          title={t.admin.blockAccount}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

