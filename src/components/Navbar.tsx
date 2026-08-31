import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Bell,
  Smartphone,
  ChevronDown,
  UserCheck,
  Download,
  AlertTriangle,
  LogOut,
  Sliders,
  Check,
  Globe,
} from 'lucide-react';
import { Language } from '../types';
import { getRoleText } from '../i18n/translations';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSecurity: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenSecurity,
  activeView,
  setActiveView,
}) => {
  const {
    currentUser,
    activeRole,
    users,
    switchUser,
    notifications,
    markNotificationAsRead,
    securityAlert,
    dismissSecurityAlert,
    pwaInstallPrompt,
    language,
    setLanguage,
    t,
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleInstallPWA = () => {
    if (pwaInstallPrompt) {
      pwaInstallPrompt.prompt();
    } else {
      const msg =
        language === 'ru'
          ? 'Чтобы установить приложение PWA, нажмите кнопку «Добавить на главный экран» в браузере.'
          : language === 'en'
          ? 'To install the PWA, please tap "Add to Home Screen" in your browser menu.'
          : 'PWA Հավելվածը տեղադրելու համար սեղմեք Ձեր բրաուզերի "Add to Home Screen" կոճակը:';
      alert(msg);
    }
  };

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Security Alert Banner if triggered */}
      {securityAlert && (
        <div className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{securityAlert}</span>
          </div>
          <button
            onClick={dismissSecurityAlert}
            className="text-slate-900 hover:text-black font-bold text-sm px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveView('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-extrabold flex items-center justify-center text-lg shadow-xs transition-colors">
              V
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                Varpet <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">PWA</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium">
                {t.nav.subtitle}
              </span>
            </div>
          </div>

          {/* Navigation Links based on role */}
          <nav className="hidden md:flex items-center gap-1 ml-6 text-xs font-semibold">
            {activeRole === 'customer' && (
              <>
                <button
                  onClick={() => setActiveView('catalog')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'catalog' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.servicesCatalog}
                </button>
                <button
                  onClick={() => setActiveView('my_orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'my_orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.myOrders}
                </button>
              </>
            )}

            {activeRole === 'specialist' && (
              <>
                <button
                  onClick={() => setActiveView('spec_orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'spec_orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.activeOrders}
                </button>
                <button
                  onClick={() => setActiveView('spec_earnings')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'spec_earnings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.earningsAndCommission}
                </button>
                <button
                  onClick={() => setActiveView('spec_schedule')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'spec_schedule' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.scheduleAndBio}
                </button>
              </>
            )}

            {activeRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveView('admin_overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'admin_overview' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.adminOverview}
                </button>
                <button
                  onClick={() => setActiveView('admin_services')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'admin_services' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.adminServices}
                </button>
                <button
                  onClick={() => setActiveView('admin_orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'admin_orders' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.adminOrders}
                </button>
                <button
                  onClick={() => setActiveView('admin_fraud')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'admin_fraud' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.adminFraud}
                </button>
                <button
                  onClick={() => setActiveView('admin_branding')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'admin_branding' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.nav.adminBranding}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsProfileDropdownOpen(false);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              title="Change Language / Լեզու / Язык"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-bold uppercase tracking-wider">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'ru' ? 'Выберите язык' : language === 'en' ? 'Select Language' : 'Ընտրեք լեզուն'}
                </div>
                <div className="space-y-0.5">
                  {languagesList.map((item) => {
                    const isSelected = item.code === language;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-800 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.flag}</span>
                          <span>{item.label}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PWA Install Button */}
          <button
            onClick={handleInstallPWA}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
            title="Install Progressive Web App"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.nav.installPwa}</span>
          </button>

          {/* Security Center Icon */}
          <button
            onClick={onOpenSecurity}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
            title={t.nav.securityCenter}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileDropdownOpen(false);
                setIsLangDropdownOpen(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between text-xs font-semibold">
                  <span>{t.notifications.title}</span>
                  <span className="text-[10px] text-slate-400">
                    {notifications.length} {t.notifications.total}
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">{t.notifications.noNotifications}</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                          !n.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="font-semibold text-slate-900 flex items-center justify-between">
                          <span>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsLangDropdownOpen(false);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.fullName || 'User'}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-left hidden lg:block pr-1">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.fullName.split(' ')[0] || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {getRoleText(activeRole, language)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Switch Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.nav.quickSwitch}
                </div>

                <div className="space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser?.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsProfileDropdownOpen(false);
                          if (u.role === 'admin') setActiveView('admin_overview');
                          else if (u.role === 'specialist') setActiveView('spec_orders');
                          else setActiveView('catalog');
                        }}
                        className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <div className="text-xs">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400">
                              {getRoleText(u.role, language)}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    {t.nav.authWizard}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
