import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Sun, Moon, Sparkles, Check, RefreshCw, Layout, Sliders } from 'lucide-react';

export const AdminBrandingThemeView: React.FC = () => {
  const { themeSettings, updateThemeSettings, language, t } = useApp();

  const [primaryColor, setPrimaryColor] = useState(themeSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(themeSettings.secondaryColor);
  const [borderRadius, setBorderRadius] = useState(themeSettings.borderRadius);
  const [fontFamily, setFontFamily] = useState(themeSettings.fontFamily);
  const [isDark, setIsDark] = useState(themeSettings.darkMode);

  const colorPalettes = [
    { name: 'Royal Blue (Default)', primary: '#2563eb', secondary: '#1e40af' },
    { name: 'Armenian Ruby / Burgundy', primary: '#b91c1c', secondary: '#991b1b' },
    { name: 'Emerald Artisan', primary: '#059669', secondary: '#047857' },
    { name: 'Deep Purple & Indigo', primary: '#7c3aed', secondary: '#6d28d9' },
    { name: 'Warm Amber Gold', primary: '#d97706', secondary: '#b45309' },
    { name: 'Slate Onyx Stealth', primary: '#334155', secondary: '#1e293b' },
  ];

  const handleApplyPalette = (p: { primary: string; secondary: string }) => {
    setPrimaryColor(p.primary);
    setSecondaryColor(p.secondary);
    updateThemeSettings({
      primaryColor: p.primary,
      secondaryColor: p.secondary,
    });
  };

  const handleRadiusChange = (radius: string) => {
    setBorderRadius(radius);
    updateThemeSettings({ borderRadius: radius });
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    updateThemeSettings({ fontFamily: font });
  };

  const handleToggleDark = () => {
    const nextVal = !isDark;
    setIsDark(nextVal);
    updateThemeSettings({ darkMode: nextVal });
  };

  const handleResetDefaults = () => {
    const def = {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      borderRadius: '0.75rem',
      fontFamily: 'Inter, sans-serif',
      darkMode: false,
    };
    setPrimaryColor(def.primaryColor);
    setSecondaryColor(def.secondaryColor);
    setBorderRadius(def.borderRadius);
    setFontFamily(def.fontFamily);
    setIsDark(false);
    updateThemeSettings(def);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.admin.brandingTokensTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.brandingTokensSubtitle}
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.admin.resetDefaults}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Palettes */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              {t.admin.colorPalettes}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colorPalettes.map((pal) => (
                <div
                  key={pal.name}
                  onClick={() => handleApplyPalette(pal)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    primaryColor === pal.primary
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: pal.secondary }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{pal.name}</span>
                  </div>
                  {primaryColor === pal.primary && <Check className="w-4 h-4 text-purple-600" />}
                </div>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{t.admin.primaryColorLabel}:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    updateThemeSettings({ primaryColor: e.target.value });
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                />
                <span className="font-mono text-slate-500 font-bold">{primaryColor}</span>
              </div>
            </div>
          </div>

          {/* Border Radius & Font Family */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              {t.admin.radiusAndTypography}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.admin.borderRadiusLabel}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: language === 'ru' ? 'Острый (0px)' : language === 'en' ? 'Sharp (0px)' : 'Սուր (0px)', val: '0px' },
                  { label: language === 'ru' ? 'Мягкий (8px)' : language === 'en' ? 'Soft (8px)' : 'Մեղմ (8px)', val: '0.5rem' },
                  { label: language === 'ru' ? 'Стандарт (12px)' : language === 'en' ? 'Standard (12px)' : 'Ստանդարտ (12px)', val: '0.75rem' },
                  { label: language === 'ru' ? 'Скругленный (20px)' : language === 'en' ? 'Rounded (20px)' : 'Կլորացված (20px)', val: '1.25rem' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleRadiusChange(item.val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      borderRadius === item.val
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.admin.fontFamilyLabel}
              </label>
              <select
                value={fontFamily}
                onChange={(e) => handleFontChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="Inter, sans-serif">Inter (Modern & Clean)</option>
                <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (SaaS Look)</option>
                <option value="system-ui, sans-serif">System UI (Native OS)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Interactive Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              {t.admin.livePreview}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              Real-time Active
            </span>
          </div>

          <div
            className="p-5 rounded-2xl border border-slate-200 space-y-4 transition-all"
            style={{
              borderRadius: borderRadius,
              fontFamily: fontFamily,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Varpet Preview Card</span>
              <span
                className="px-2.5 py-0.5 text-[10px] font-bold text-white rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                {t.specialist.onlineStatus}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ru' ? 'Эта карточка отображает выбранные изменения CSS Variables в режиме реального времени.' : language === 'en' ? 'This card previews your selected CSS variable theme changes across the platform in real time.' : 'Այս քարտը ցուցադրում է ընտրված CSS Variables փոփոխությունները անմիջապես ամբողջ հավելվածում:'}
            </p>

            <button
              type="button"
              className="w-full py-2 text-white font-bold text-xs shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: primaryColor,
                borderRadius: borderRadius,
              }}
            >
              <span>{language === 'ru' ? 'Кнопка действия (Primary CTA)' : language === 'en' ? 'Action Button (Primary CTA)' : 'Գործողության Կոճակ (Primary CTA)'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-mono space-y-1">
            <div>--primary: {primaryColor}</div>
            <div>--radius: {borderRadius}</div>
            <div>--font-sans: {fontFamily.split(',')[0]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

