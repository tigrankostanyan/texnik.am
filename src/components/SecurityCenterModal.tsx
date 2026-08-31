import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Smartphone, AlertTriangle, CheckCircle, Lock, Key, LogOut, X, RefreshCw } from 'lucide-react';
import { generateTotpSecret, getTotpCode, verifyTotpCode } from '../utils/totp';

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, deviceSessions, enableTwoFactor, addAuditLog, language } = useApp() as any;
  const [activeTab, setActiveTab] = useState<'devices' | '2fa' | 'strikes'>('devices');
  const [totpSecret, setTotpSecret] = useState(() => currentUser?.twoFactorSecret || generateTotpSecret());
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const secTxt = {
    hy: {
      title: 'Անվտանգության և Սարքերի Կենտրոն',
      tabDevices: 'Ակտիվ Սարքեր (Device Fingerprints)',
      tab2fa: '2FA (Google Authenticator)',
      tabStrikes: 'Anti-Fraud & Strikes',
      twoFaDisabled: '2FA-ն անջատվեց',
      invalidTotp: 'Սխալ TOTP կոդ Google Authenticator-ից',
      twoFaEnabled: '2FA-ն հաջողությամբ միացվեց Google Authenticator-ի միջոցով',
      deviceControlTitle: 'Սարքերի վերահսկողություն (Anti-Session Hijack)',
      deviceControlDesc: 'Եթե նոր անսովոր սարքից մուտք լինի, նախորդ սեսիան կանջատվի և կուղարկվի ահազանգ',
      testAlert: 'Թեստավորել սարքի ալերտը',
      testAlertMsg: 'Սիմուլյացիա. Երկրորդ սարքից մուտք գործելու դեպքում համակարգը ավտոմատ կերպով փակում է ակտիվ սեսիան և ուղարկում ծանուցում:',
      currDevice: 'Ընթացիկ սարք',
      terminate: 'Անջատել',
      twoFaTitle: 'Երկփուլային վավերացում (TOTP)',
      status: 'Կարգավիճակ՝',
      activeAuth: 'Ակտիվացված է (Google Authenticator)',
      disabled: 'Անջատված է',
      enabled: 'Միացված',
      enableGoogleAuth: 'Միացնել Google Authenticator',
      orActiveCode: 'Կամ ակտիվ կոդ՝',
      enterCode: 'Մուտքագրեք 6-նիշ կոդը հաստատման համար',
      verifyAndEnable: 'Հաստատել & Միացնել',
      disable2fa: 'Անջատել 2FA',
      strikeTitle: 'Հակա-շրջանցման և Մոդերացիայի ցուցիչ',
      strikeDesc: 'Արգելված է հարթակից դուրս կոնտակտներ (հեռախոս, սոց․ ցանցեր, հղումներ) տեղադրել մասնագետի բիոյում կամ չաթում: 3 խախտման դեպքում հաշիվն ավտոմատ բլոկավորվում է:',
      strikesCount: 'խախտում',
      profileStatus: 'Պրոֆիլի կարգավիճակ՝',
      phoneVerif: 'Հեռախոսի վերիֆիկացիա՝',
      yes: 'Այո',
      no: 'Ոչ',
      close: 'Փակել',
    },
    ru: {
      title: 'Центр безопасности и устройств',
      tabDevices: 'Активные устройства (Fingerprints)',
      tab2fa: '2FA (Google Authenticator)',
      tabStrikes: 'Антифрод и Страйки',
      twoFaDisabled: '2FA отключена',
      invalidTotp: 'Неверный код TOTP из Google Authenticator',
      twoFaEnabled: '2FA успешно включена через Google Authenticator',
      deviceControlTitle: 'Контроль устройств (Anti-Session Hijack)',
      deviceControlDesc: 'При входе с нового подозрительного устройства сессия завершается и отправляется оповещение',
      testAlert: 'Тестировать алерт устройства',
      testAlertMsg: 'Симуляция: При входе со 2-го устройства система автоматически завершает сессию и отправляет уведомление.',
      currDevice: 'Текущее устройство',
      terminate: 'Отключить',
      twoFaTitle: 'Двухфакторная аутентификация (TOTP)',
      status: 'Статус:',
      activeAuth: 'Включено (Google Authenticator)',
      disabled: 'Отключено',
      enabled: 'Включено',
      enableGoogleAuth: 'Включить Google Authenticator',
      orActiveCode: 'Или активный код:',
      enterCode: 'Введите 6-значный код для подтверждения',
      verifyAndEnable: 'Подтвердить и включить',
      disable2fa: 'Отключить 2FA',
      strikeTitle: 'Индикатор анти-обхода и модерации',
      strikeDesc: 'Запрещено передавать прямые контакты вне платформы (телефон, соцсети, ссылки) в описании или чате. При 3 нарушениях аккаунт блокируется.',
      strikesCount: 'нарушений',
      profileStatus: 'Статус профиля:',
      phoneVerif: 'Верификация телефона:',
      yes: 'Да',
      no: 'Нет',
      close: 'Закрыть',
    },
    en: {
      title: 'Security & Device Center',
      tabDevices: 'Active Devices (Fingerprints)',
      tab2fa: '2FA (Google Authenticator)',
      tabStrikes: 'Anti-Fraud & Strikes',
      twoFaDisabled: '2FA disabled',
      invalidTotp: 'Invalid TOTP code from Google Authenticator',
      twoFaEnabled: '2FA enabled successfully via Google Authenticator',
      deviceControlTitle: 'Device Control (Anti-Session Hijack)',
      deviceControlDesc: 'If a login occurs from an unrecognized device, previous sessions terminate with an immediate alert',
      testAlert: 'Test device alert',
      testAlertMsg: 'Simulation: Logging in from a 2nd device automatically terminates active sessions and dispatches a security warning.',
      currDevice: 'Current device',
      terminate: 'Terminate',
      twoFaTitle: 'Two-Factor Authentication (TOTP)',
      status: 'Status:',
      activeAuth: 'Enabled (Google Authenticator)',
      disabled: 'Disabled',
      enabled: 'Enabled',
      enableGoogleAuth: 'Enable Google Authenticator',
      orActiveCode: 'Or live code:',
      enterCode: 'Enter the 6-digit TOTP code to confirm',
      verifyAndEnable: 'Verify & Enable',
      disable2fa: 'Disable 2FA',
      strikeTitle: 'Anti-Bypass & Moderation Index',
      strikeDesc: 'Sharing direct offline contacts (phone numbers, social media, external URLs) in bios or chats is prohibited. 3 strikes trigger automated ban.',
      strikesCount: 'strikes',
      profileStatus: 'Profile status:',
      phoneVerif: 'Phone verified:',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
    },
  };

  const str = secTxt[language] || secTxt.hy;

  if (!isOpen || !currentUser) return null;

  const handleToggle2FA = () => {
    if (currentUser.twoFactorEnabled) {
      enableTwoFactor(currentUser.id, '', 'sms');
      setSuccessMsg(str.twoFaDisabled);
    } else {
      if (!verifyTotpCode(totpSecret, totpCodeInput)) {
        setErrorMsg(str.invalidTotp);
        return;
      }
      enableTwoFactor(currentUser.id, totpSecret, 'totp');
      setSuccessMsg(str.twoFaEnabled);
      setErrorMsg('');
    }
  };

  const handleSimulateNewDeviceAlert = () => {
    alert(str.testAlertMsg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">{str.title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('devices')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'devices'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            {str.tabDevices}
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === '2fa'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            {str.tab2fa}
          </button>
          <button
            onClick={() => setActiveTab('strikes')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'strikes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {str.tabStrikes} ({currentUser.moderationStrikes}/3)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab 1: Device Fingerprints */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{str.deviceControlTitle}</h4>
                  <p className="text-[11px] text-slate-500">
                    {str.deviceControlDesc}
                  </p>
                </div>
                <button
                  onClick={handleSimulateNewDeviceAlert}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {str.testAlert}
                </button>
              </div>

              <div className="space-y-2.5">
                {deviceSessions.map((sess: any) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${sess.isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                          {sess.deviceName}
                          {sess.isCurrent && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
                              {str.currDevice}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          IP: {sess.ipAddress} • {sess.locationName} • ID: <span className="font-mono">{sess.deviceId.substring(0, 12)}...</span>
                        </div>
                      </div>
                    </div>
                    {!sess.isCurrent && (
                      <button
                        onClick={() => alert('Սեսիան հեռացվեց:')}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors text-xs flex items-center gap-1"
                        title={str.terminate}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{str.terminate}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: 2FA */}
          {activeTab === '2fa' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-900">{str.twoFaTitle}</div>
                  <div className="text-[11px] text-slate-500">
                    {str.status} {currentUser.twoFactorEnabled ? str.activeAuth : str.disabled}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${currentUser.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {currentUser.twoFactorEnabled ? str.enabled : str.disabled}
                </span>
              </div>

              {!currentUser.twoFactorEnabled ? (
                <div className="space-y-3 p-4 border border-blue-100 bg-blue-50/40 rounded-xl">
                  <div className="text-xs font-semibold text-blue-900">{str.enableGoogleAuth}</div>
                  <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200">
                    Secret Key: <b>{totpSecret}</b> ({str.orActiveCode} {getTotpCode(totpSecret)})
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {str.enterCode}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={totpCodeInput}
                        onChange={(e) => setTotpCodeInput(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold tracking-wider w-36 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                      <button
                        onClick={handleToggle2FA}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        {str.verifyAndEnable}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleToggle2FA}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  {str.disable2fa}
                </button>
              )}
            </div>
          )}

          {/* Tab 3: Moderation Strikes */}
          {activeTab === 'strikes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs font-bold text-slate-900 mb-1">{str.strikeTitle}</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  {str.strikeDesc}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        currentUser.moderationStrikes === 0
                          ? 'bg-emerald-500'
                          : currentUser.moderationStrikes < 3
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${(currentUser.moderationStrikes / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {currentUser.moderationStrikes} / 3 {str.strikesCount}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {str.profileStatus} <b className="text-slate-900">{currentUser.status}</b> • {str.phoneVerif}{' '}
                <b className="text-emerald-600">{currentUser.isPhoneVerified ? str.yes : str.no}</b>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {str.close}
          </button>
        </div>
      </div>
    </div>
  );
};
