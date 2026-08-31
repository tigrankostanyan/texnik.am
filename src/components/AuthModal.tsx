import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Smartphone, Mail, UserCheck, AlertTriangle, CheckCircle, Upload, ArrowRight, Lock } from 'lucide-react';
import { generateTotpSecret, getTotpCode, verifyTotpCode } from '../utils/totp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'customer' | 'specialist';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'customer' }) => {
  const { registerUser, users, switchUser, verifyPhoneOTP, verifyEmailCode, enableTwoFactor, language } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<'customer' | 'specialist'>(initialRole);
  const [step, setStep] = useState<'form' | 'phone_otp' | 'email_code' | 'two_factor' | 'completed'>('form');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+374');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [workingAddress, setWorkingAddress] = useState('');
  const [idFileName, setIdFileName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat_computers');

  // Verification states
  const [createdUserId, setCreatedUserId] = useState<string>('');
  const [otpInput, setOtpInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [overlapWarning, setOverlapWarning] = useState(false);

  // Quick Login list
  const [selectedLoginUserId, setSelectedLoginUserId] = useState(users[0]?.id || '');

  const txt = {
    hy: {
      authTitle: 'Varpet Ավտենտիֆիկացիա',
      authSubtitle: 'PWA ծառայությունների հարթակ',
      registerTab: 'Գրանցում (New User)',
      loginTab: 'Մուտք (Login / Switch Profile)',
      selectProfile: 'Ընտրեք գործող պրոֆիլ արագ մուտքի համար',
      loginWithSelected: 'Մուտք գործել ընտրված հաշվով',
      chooseRole: 'Ընտրեք Ձեր դերը հարթակում',
      customer: 'Հաճախորդ',
      customerDesc: 'Ծառայություն պատվիրող',
      specialist: 'Մասնագետ / Վարպետ',
      specialistDesc: 'Ծառայություն մատուցող',
      continueWithGoogle: 'Շարունակել Google-ով (OAuth)',
      orFillData: 'կամ լրացրեք տվյալները',
      fullName: 'Անուն Ազգանուն',
      phoneOTP: 'Հեռախոսահամար (OTP)',
      email: 'Էլ. փոստ (Email)',
      address: 'Հասցե (Address)',
      specVerification: 'Մասնագետի պարտադիր վերիֆիկացիա',
      servicesCategory: 'Ծառայությունների կատեգորիա',
      catComp: 'Համակարգիչների վերանորոգում',
      catSmart: 'Սմարթֆոնների վերանորոգում',
      catPhoto: 'Լուսանկարչություն',
      catApp: 'Կենցաղային տեխնիկա',
      idVerification: 'Ինքնության հաստատում (ID / Անձնագիր)',
      uploadId: 'Վերբեռնել ID փաստաթուղթ',
      bio: 'Մասնագիտական կենսագրություն (Bio)',
      bioNotice: '(Արգելված է նշել անձնական հեռախոս, հղումներ, @հաշիվներ)',
      bioPlaceholder: 'Նկարագրեք Ձեր աշխատանքային փորձը...',
      submitRegister: 'Գրանցվել & Անցնել Verification',
      verifyPhoneTitle: 'Հաստատեք հեռախոսահամարը (OTP)',
      verifyPhoneSub: 'Մենք ուղարկել ենք 4-նիշ կոդ հետևյալ համարին՝',
      testCode: '(Թեստային կոդ՝ 1234)',
      verifyPhoneBtn: 'Հաստատել հեռախոսը',
      verifyEmailTitle: 'Հաստատեք էլ. հասցեն (Email)',
      verifyEmailSub: 'Կոդն ուղարկվել է հետևյալ հասցեին՝',
      verifyEmailBtn: 'Հաստատել Email-ը',
      twoFactorTitle: 'Երկփուլային վավերացում (2FA - TOTP)',
      twoFactorSub: 'Միացրեք Google Authenticator՝ հաշվի պաշտպանվածության համար',
      secretKey: 'Գաղտնի բանալի (Secret)',
      enterInApp: 'Մուտքագրեք այս բանալին Google Authenticator հավելվածում կամ ստուգեք ակտիվ կոդը՝',
      enter6Digits: 'Մուտքագրեք 6-նիշ կոդը հավելվածից',
      skipForNow: 'Բաց թողնել առայժմ',
      enable2FA: 'Ակտիվացնել 2FA',
      completedTitle: 'Գրանցումը և Վերիֆիկացիան ավարտված են',
      completedOverlap: 'Զգուշացում. Քանի որ նույն կոնտակտը գրանցված է այլ դերում, Ձեր պրոֆիլը կակտիվանա Ադմինի ստուգումից հետո:',
      completedDesc: 'Ձեր հաշիվը հաջողությամբ ստեղծված և պաշտպանված է:',
      startUsing: 'Անցնել հարթակի օգտագործմանը',
      fillNameAndPhone: 'Լրացրեք անունը և վավեր հեռախոսահամարը',
      emailRequiredSpec: 'Մասնագետի համար էլ. հասցեն պարտադիր է',
      idRequiredSpec: 'Խնդրում ենք կցել ինքնությունը հաստատող փաստաթուղթ (ID / Անձնագիր)',
      regError: 'Գրանցման սխալ',
      otpErr: 'Մուտքագրեք 4-նիշ OTP կոդը (օր.՝ 1234)',
      wrongOtp: 'Սխալ OTP կոդ',
      wrongEmail: 'Սխալ էլ. հասցեի կոդ',
      enter2FAErr: 'Մուտքագրեք Google Authenticator-ի 6-նիշ կոդը (կամ փորձեք 123456)',
      invalid2FA: 'Անվավեր 2FA կոդ',
    },
    ru: {
      authTitle: 'Varpet Аутентификация',
      authSubtitle: 'Платформа PWA услуг',
      registerTab: 'Регистрация (New User)',
      loginTab: 'Вход (Login / Switch Profile)',
      selectProfile: 'Выберите активный профиль для быстрого входа',
      loginWithSelected: 'Войти под выбранным аккаунтом',
      chooseRole: 'Выберите вашу роль на платформе',
      customer: 'Клиент',
      customerDesc: 'Заказчик услуг',
      specialist: 'Мастер / Специалист',
      specialistDesc: 'Исполнитель услуг',
      continueWithGoogle: 'Продолжить с Google (OAuth)',
      orFillData: 'или заполните данные',
      fullName: 'Имя и Фамилия',
      phoneOTP: 'Номер телефона (OTP)',
      email: 'Эл. почта (Email)',
      address: 'Адрес (Address)',
      specVerification: 'Обязательная верификация мастера',
      servicesCategory: 'Категория услуг',
      catComp: 'Ремонт компьютеров',
      catSmart: 'Ремонт смартфонов',
      catPhoto: 'Фотоуслуги',
      catApp: 'Бытовая техника',
      idVerification: 'Подтверждение личности (ID / Паспорт)',
      uploadId: 'Загрузить документ ID',
      bio: 'Профессиональная биография (Bio)',
      bioNotice: '(Запрещено указывать личный телефон, ссылки, @аккаунты)',
      bioPlaceholder: 'Опишите ваш опыт работы...',
      submitRegister: 'Зарегистрироваться и пройти верификацию',
      verifyPhoneTitle: 'Подтвердите номер телефона (OTP)',
      verifyPhoneSub: 'Мы отправили 4-значный код на номер:',
      testCode: '(Тестовый код: 1234)',
      verifyPhoneBtn: 'Подтвердить телефон',
      verifyEmailTitle: 'Подтвердите эл. почту (Email)',
      verifyEmailSub: 'Код отправлен на адрес:',
      verifyEmailBtn: 'Подтвердить Email',
      twoFactorTitle: 'Двухфакторная аутентификация (2FA - TOTP)',
      twoFactorSub: 'Включите Google Authenticator для максимальной безопасности',
      secretKey: 'Секретный ключ (Secret)',
      enterInApp: 'Введите этот ключ в приложении Google Authenticator или проверьте активный код:',
      enter6Digits: 'Введите 6-значный код из приложения',
      skipForNow: 'Пропустить пока',
      enable2FA: 'Активировать 2FA',
      completedTitle: 'Регистрация и верификация завершены',
      completedOverlap: 'Внимание: так как контакт уже зарегистрирован в другой роли, профиль активируется после проверки модератором.',
      completedDesc: 'Ваш аккаунт успешно создан и защищен.',
      startUsing: 'Перейти к платформе',
      fillNameAndPhone: 'Заполните имя и корректный номер телефона',
      emailRequiredSpec: 'Для мастера эл. почта обязательна',
      idRequiredSpec: 'Пожалуйста, прикрепите документ личности (ID / Паспорт)',
      regError: 'Ошибка регистрации',
      otpErr: 'Введите 4-значный OTP код (напр. 1234)',
      wrongOtp: 'Неверный OTP код',
      wrongEmail: 'Неверный код эл. почты',
      enter2FAErr: 'Введите 6-значный код Google Authenticator (или 123456)',
      invalid2FA: 'Недействительный 2FA код',
    },
    en: {
      authTitle: 'Varpet Authentication',
      authSubtitle: 'PWA Services Platform',
      registerTab: 'Register (New User)',
      loginTab: 'Sign In (Login / Switch Profile)',
      selectProfile: 'Select an existing profile for quick access',
      loginWithSelected: 'Sign in with selected account',
      chooseRole: 'Choose your role on the platform',
      customer: 'Customer',
      customerDesc: 'Orders & hires services',
      specialist: 'Specialist / Pro',
      specialistDesc: 'Provides services',
      continueWithGoogle: 'Continue with Google (OAuth)',
      orFillData: 'or enter your information',
      fullName: 'Full Name',
      phoneOTP: 'Phone Number (OTP)',
      email: 'Email Address',
      address: 'Address',
      specVerification: 'Mandatory Specialist Verification',
      servicesCategory: 'Service Category',
      catComp: 'Computer Repair',
      catSmart: 'Smartphone Repair',
      catPhoto: 'Photography Services',
      catApp: 'Home Appliances',
      idVerification: 'Identity Verification (ID / Passport)',
      uploadId: 'Upload ID Document',
      bio: 'Professional Bio',
      bioNotice: '(Forbidden to include direct phone, external links, @accounts)',
      bioPlaceholder: 'Describe your professional background...',
      submitRegister: 'Register & Proceed to Verification',
      verifyPhoneTitle: 'Verify Phone Number (OTP)',
      verifyPhoneSub: 'We sent a 4-digit verification code to:',
      testCode: '(Demo code: 1234)',
      verifyPhoneBtn: 'Verify Phone',
      verifyEmailTitle: 'Verify Email Address',
      verifyEmailSub: 'A verification code was sent to:',
      verifyEmailBtn: 'Verify Email',
      twoFactorTitle: 'Two-Factor Authentication (2FA - TOTP)',
      twoFactorSub: 'Enable Google Authenticator for enhanced account safety',
      secretKey: 'Secret Key',
      enterInApp: 'Enter this secret key in Google Authenticator or check code:',
      enter6Digits: 'Enter the 6-digit code from your app',
      skipForNow: 'Skip for now',
      enable2FA: 'Enable 2FA',
      completedTitle: 'Registration & Verification Complete',
      completedOverlap: 'Notice: This contact is already associated with another role; profile will activate after Admin approval.',
      completedDesc: 'Your account is successfully created and secured.',
      startUsing: 'Start Using Platform',
      fillNameAndPhone: 'Please fill in full name and a valid phone number',
      emailRequiredSpec: 'Email address is required for specialists',
      idRequiredSpec: 'Please upload identity document (ID / Passport)',
      regError: 'Registration error',
      otpErr: 'Enter the 4-digit OTP code (e.g., 1234)',
      wrongOtp: 'Invalid OTP code',
      wrongEmail: 'Invalid email verification code',
      enter2FAErr: 'Enter 6-digit Google Authenticator code (or try 123456)',
      invalid2FA: 'Invalid 2FA code',
    },
  };

  const str = txt[language] || txt.hy;

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || phone.length < 9) {
      setErrorMessage(str.fillNameAndPhone);
      return;
    }

    if (role === 'specialist') {
      if (!email.trim()) {
        setErrorMessage(str.emailRequiredSpec);
        return;
      }
      if (!idFileName) {
        setErrorMessage(str.idRequiredSpec);
        return;
      }
    }

    const res = registerUser({
      fullName,
      phone,
      email,
      role,
      address,
      bio,
      workingAddress,
      idDocumentName: idFileName || 'id_passport.pdf',
      selectedCategories: [selectedCategory],
    });

    if (!res.success) {
      setErrorMessage(res.error || str.regError);
      return;
    }

    if (res.userId) {
      setCreatedUserId(res.userId);
      if (res.overlapWarning) {
        setOverlapWarning(true);
      }
      // Advance to mandatory phone OTP verification
      setStep('phone_otp');
    }
  };

  const handleVerifyPhone = () => {
    if (!otpInput || otpInput.length < 4) {
      setErrorMessage(str.otpErr);
      return;
    }
    const ok = verifyPhoneOTP(createdUserId, otpInput);
    if (ok) {
      setErrorMessage('');
      if (email.trim()) {
        setStep('email_code');
      } else {
        // Move to 2FA prompt
        const sec = generateTotpSecret();
        setTwoFactorSecret(sec);
        setStep('two_factor');
      }
    } else {
      setErrorMessage(str.wrongOtp);
    }
  };

  const handleVerifyEmail = () => {
    if (!emailInput || emailInput.length < 4) {
      setErrorMessage(str.otpErr);
      return;
    }
    const ok = verifyEmailCode(createdUserId, emailInput);
    if (ok) {
      setErrorMessage('');
      const sec = generateTotpSecret();
      setTwoFactorSecret(sec);
      setStep('two_factor');
    } else {
      setErrorMessage(str.wrongEmail);
    }
  };

  const handleSetupTwoFactor = (enable: boolean) => {
    if (enable) {
      if (!twoFactorInput || twoFactorInput.length !== 6) {
        setErrorMessage(str.enter2FAErr);
        return;
      }
      const valid = verifyTotpCode(twoFactorSecret, twoFactorInput);
      if (!valid) {
        setErrorMessage(str.invalid2FA);
        return;
      }
      enableTwoFactor(createdUserId, twoFactorSecret, 'totp');
    }
    setStep('completed');
  };

  const handleGoogleOAuthSim = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFullName('Google User');
    setEmail(`google.user.${randomSuffix}@gmail.com`);
    setPhone('+37494' + randomSuffix + '12');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
              VP
            </div>
            <div>
              <h3 className="font-semibold text-sm">{str.authTitle}</h3>
              <p className="text-xs text-slate-400">{str.authSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Mode Switcher Tabs */}
          {step === 'form' && (
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {str.registerTab}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {str.loginTab}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Quick Login Mode */}
          {mode === 'login' && step === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {str.selectProfile}
                </label>
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedLoginUserId(u.id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedLoginUserId === u.id
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                            {u.fullName}
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 font-bold">
                                Admin
                              </span>
                            )}
                            {u.role === 'specialist' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                                {str.specialist}
                              </span>
                            )}
                            {u.role === 'customer' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">
                                {str.customer}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.phone} • {u.email}</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-blue-600">Select</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  switchUser(selectedLoginUserId);
                  onClose();
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm"
              >
                {str.loginWithSelected}
              </button>
            </div>
          )}

          {/* Registration Form Step */}
          {mode === 'register' && step === 'form' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {str.chooseRole}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      role === 'customer'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div className="font-semibold text-xs">{str.customer}</div>
                    <div className="text-[10px] text-slate-500">{str.customerDesc}</div>
                  </div>
                  <div
                    onClick={() => setRole('specialist')}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      role === 'specialist'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                    <div className="font-semibold text-xs">{str.specialist}</div>
                    <div className="text-[10px] text-slate-500">{str.specialistDesc}</div>
                  </div>
                </div>
              </div>

              {/* Google OAuth quick fill button */}
              <button
                type="button"
                onClick={handleGoogleOAuthSim}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                {str.continueWithGoogle}
              </button>

              <div className="relative my-2 text-center">
                <span className="bg-white px-2 text-[11px] text-slate-400">{str.orFillData}</span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {str.fullName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {str.phoneOTP} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+37494112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {str.email} {role === 'specialist' && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    {str.address}
                  </label>
                  <input
                    type="text"
                    placeholder="Yerevan, Armenia"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Specialist Specific Fields */}
              {role === 'specialist' && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    {str.specVerification}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {str.servicesCategory}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="cat_computers">{str.catComp}</option>
                      <option value="cat_smartphones">{str.catSmart}</option>
                      <option value="cat_photography">{str.catPhoto}</option>
                      <option value="cat_appliances">{str.catApp}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {str.idVerification} <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 border border-dashed border-amber-300 hover:border-amber-500 bg-white rounded-lg text-xs text-slate-600 cursor-pointer flex items-center justify-center gap-2">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>{idFileName || str.uploadId}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIdFileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                      {idFileName && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {str.bio}
                      <span className="text-[10px] text-slate-400 block">
                        {str.bioNotice}
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder={str.bioPlaceholder}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {str.submitRegister}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Step: Phone OTP Verification */}
          {step === 'phone_otp' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{str.verifyPhoneTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {str.verifyPhoneSub} <b>{phone}</b>
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                  {str.testCode}
                </span>
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="1 2 3 4"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-40 mx-auto text-center tracking-widest text-lg font-bold py-2 border-2 border-blue-600 rounded-xl focus:outline-none"
              />

              <button
                type="button"
                onClick={handleVerifyPhone}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
              >
                {str.verifyPhoneBtn}
              </button>
            </div>
          )}

          {/* Step: Email Verification */}
          {step === 'email_code' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{str.verifyEmailTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {str.verifyEmailSub} <b>{email}</b>
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                  {str.testCode}
                </span>
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="1 2 3 4"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-40 mx-auto text-center tracking-widest text-lg font-bold py-2 border-2 border-indigo-600 rounded-xl focus:outline-none"
              />

              <button
                type="button"
                onClick={handleVerifyEmail}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
              >
                {str.verifyEmailBtn}
              </button>
            </div>
          )}

          {/* Step: 2FA Google Authenticator Setup */}
          {step === 'two_factor' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{str.twoFactorTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {str.twoFactorSub}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                <div className="text-xs font-mono text-slate-800 bg-white p-2 rounded-lg border border-slate-200 font-bold tracking-wider">
                  {str.secretKey}: {twoFactorSecret}
                </div>
                <div className="text-[11px] text-slate-500">
                  {str.enterInApp} <b>{getTotpCode(twoFactorSecret)}</b>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 text-center">
                  {str.enter6Digits}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000 000"
                  value={twoFactorInput}
                  onChange={(e) => setTwoFactorInput(e.target.value)}
                  className="w-44 mx-auto block text-center tracking-widest text-lg font-bold py-2 border-2 border-emerald-600 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSetupTwoFactor(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {str.skipForNow}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetupTwoFactor(true)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
                >
                  {str.enable2FA}
                </button>
              </div>
            </div>
          )}

          {/* Completed State */}
          {step === 'completed' && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900">{str.completedTitle}</h4>
                {overlapWarning ? (
                  <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {str.completedOverlap}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    {str.completedDesc}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                {str.startUsing}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
