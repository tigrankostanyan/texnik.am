import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Upload,
  Save,
  Power,
  MapPin,
  Star,
} from 'lucide-react';
import { moderateTextContent } from '../../utils/security';
import { getCategoryName } from '../../i18n/translations';

export const SpecialistScheduleBioView: React.FC = () => {
  const { currentUser, specialistProfiles, updateSpecialistProfile, categories, language, t } = useApp();

  const myProfile = currentUser ? specialistProfiles[currentUser.id] : null;

  const [isOnline, setIsOnline] = useState<boolean>(myProfile?.isOnline ?? true);
  const [workingAddress, setWorkingAddress] = useState<string>(myProfile?.workingAddress || 'ք. Երևան, Կոմիտաս 35');
  const [bioText, setBioText] = useState<string>(myProfile?.bio || '');
  const [selectedCats, setSelectedCats] = useState<string[]>(myProfile?.categories || ['cat_computers']);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [bioModerationError, setBioModerationError] = useState<string>('');

  const weekDays = [
    { day: language === 'ru' ? 'Понедельник' : language === 'en' ? 'Monday' : 'Երկուշաբթի', active: true, start: '09:00', end: '19:00' },
    { day: language === 'ru' ? 'Вторник' : language === 'en' ? 'Tuesday' : 'Երեքշաբթի', active: true, start: '09:00', end: '19:00' },
    { day: language === 'ru' ? 'Среда' : language === 'en' ? 'Wednesday' : 'Չորեքշաբթի', active: true, start: '09:00', end: '19:00' },
    { day: language === 'ru' ? 'Четверг' : language === 'en' ? 'Thursday' : 'Հինգշաբթի', active: true, start: '09:00', end: '19:00' },
    { day: language === 'ru' ? 'Пятница' : language === 'en' ? 'Friday' : 'Ուրբաթ', active: true, start: '09:00', end: '19:00' },
    { day: language === 'ru' ? 'Суббота' : language === 'en' ? 'Saturday' : 'Շաբաթ', active: true, start: '10:00', end: '17:00' },
    { day: language === 'ru' ? 'Воскресенье' : language === 'en' ? 'Sunday' : 'Կիրակի', active: false, start: '10:00', end: '15:00' },
  ];

  if (!currentUser || !myProfile) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        {language === 'ru' ? 'Профиль мастера не найден' : language === 'en' ? 'Specialist profile not found' : 'Մասնագետի պրոֆիլ չի գտնվել:'}
      </div>
    );
  }

  const handleBioChange = (text: string) => {
    setBioText(text);
    const mod = moderateTextContent(text);
    if (!mod.passed) {
      setBioModerationError(mod.violations[0] || (language === 'ru' ? 'Запрещенные контактные данные' : language === 'en' ? 'Forbidden contact details' : 'Արգելված կոնտակտային տվյալ'));
    } else {
      setBioModerationError('');
    }
  };

  const handleToggleCategory = (catId: string) => {
    if (selectedCats.includes(catId)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter((c) => c !== catId));
      }
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const mod = moderateTextContent(bioText);
    if (!mod.passed) {
      setBioModerationError(mod.violations[0] || (language === 'ru' ? 'Запрещенные контактные данные' : language === 'en' ? 'Forbidden contact details' : 'Արգելված կոնտակտային տվյալ'));
      return;
    }

    updateSpecialistProfile(currentUser.id, {
      isOnline,
      workingAddress,
      bio: bioText,
      categories: selectedCats,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.specialist.scheduleTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.specialist.scheduleSubtitle}
          </p>
        </div>

        {/* Online / Offline Quick Toggle */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {isOnline ? t.specialist.onlineStatus : t.specialist.offlineStatus}
            </span>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isOnline
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isOnline ? t.specialist.turnOff : t.specialist.turnOn}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.specialist.changesSaved}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form & Anti-Bypass Bio */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 space-y-6">
          {/* Bio & Moderation Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                {t.specialist.bioHeading}
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                AI / Regex Moderated
              </span>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              <b className="text-slate-700">{t.specialist.securityRuleTitle}:</b> {t.specialist.securityRuleDesc}
            </div>

            <div>
              <textarea
                rows={4}
                required
                value={bioText}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder={t.specialist.bioPlaceholder}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {bioModerationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span><b>{t.specialist.blockedError}:</b> {bioModerationError}</span>
              </div>
            )}

            {/* Working Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.specialist.workshopAddress}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={workingAddress}
                  onChange={(e) => setWorkingAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Categories Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.specialist.servicedCategories}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const isChecked = selectedCats.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all flex items-center gap-2 ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span>{getCategoryName(cat, language)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!!bioModerationError}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{t.specialist.saveProfileBtn}</span>
            </button>
          </div>
        </form>

        {/* Right 1 Col: Working Hours & Verification Status */}
        <div className="space-y-6">
          {/* Verification Status Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              {t.specialist.verificationAndId}
            </h3>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs text-emerald-900">{t.specialist.profileApproved}</div>
                <div className="text-[10px] text-emerald-700">{t.specialist.passportVerified}</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>{t.catalog.rating}՝ <b className="text-slate-900">★ {myProfile.rating}</b> ({myProfile.completedOrdersCount} {t.specialist.completedOrdersCount})</div>
              <div>{language === 'ru' ? 'Документ' : language === 'en' ? 'Document' : 'Փաստաթուղթ'}՝ <span className="font-mono text-[11px] text-slate-500">{myProfile.idDocumentName}</span></div>
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              {t.specialist.weeklySchedule}
            </h3>

            <div className="space-y-2">
              {weekDays.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className={`font-semibold ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  <span className={`font-mono text-[11px] ${item.active ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                    {item.active ? `${item.start} - ${item.end}` : (language === 'ru' ? 'Выходной' : language === 'en' ? 'Off' : 'Հանգիստ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

