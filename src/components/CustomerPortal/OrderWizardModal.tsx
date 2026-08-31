import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceOffering, ServiceCategory, ServiceMode, PaymentMethod, SpecialistProfile } from '../../types';
import {
  getCategoryName,
  getServiceName,
  getServiceDescription,
  getServiceModeText,
} from '../../i18n/translations';
import { MapView } from '../MapView';
import { searchAddresses, GeocodingResult } from '../../utils/geocoding';
import {
  Car,
  Store,
  PhoneCall,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  Search,
  Loader2,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderWizardModalProps {
  service: ServiceOffering;
  category: ServiceCategory;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const OrderWizardModal: React.FC<OrderWizardModalProps> = ({
  service,
  category,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { currentUser, specialistProfiles, users, createOrder, language, t } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedMode, setSelectedMode] = useState<ServiceMode>(service.availableModes[0] || 'specialist_goes');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('user_spec_1');
  const [isImmediate, setIsImmediate] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-30');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:30 - 15:30');
  const [addressInput, setAddressInput] = useState<string>(currentUser?.address || 'ք. Երևան, Բաղրամյան 24, բն. 14');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({
    lat: 40.1872,
    lng: 44.5152,
  });
  const [addressSuggestions, setAddressSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchTimeoutRef = useRef<any>(null);

  const [problemDescription, setProblemDescription] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_escrow');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const QUICK_DISTRICTS = [
    { labelHy: 'Կենտրոն', labelRu: 'Кентрон', labelEn: 'Kentron', name: 'ք. Երևան, Հանրապետության Հրապարակ', lat: 40.1776, lng: 44.5126 },
    { labelHy: 'Արաբկիր', labelRu: 'Арабкир', labelEn: 'Arabkir', name: 'ք. Երևան, Կոմիտասի պողոտա', lat: 40.2078, lng: 44.5148 },
    { labelHy: 'Դավթաշեն', labelRu: 'Давташен', labelEn: 'Davtashen', name: 'ք. Երևան, Տիգրան Պետրոսյան փողոց', lat: 40.2170, lng: 44.4750 },
    { labelHy: 'Աջափնյակ', labelRu: 'Ачапняк', labelEn: 'Ajapnyak', name: 'ք. Երևան, Լենինգրադյան փողոց', lat: 40.1920, lng: 44.4760 },
    { labelHy: 'Նոր Նորք', labelRu: 'Нор Норк', labelEn: 'Nor Nork', name: 'ք. Երևան, Գայի պողոտա', lat: 40.1989, lng: 44.5615 },
    { labelHy: 'Մալաթիա', labelRu: 'Малатия', labelEn: 'Malatia', name: 'ք. Երևան, Սեբաստիայի փողոց', lat: 40.1770, lng: 44.4620 },
    { labelHy: 'Շենգավիթ', labelRu: 'Шенгавит', labelEn: 'Shengavit', name: 'ք. Երևան, Գարեգին Նժդեհի հրապարակ', lat: 40.1510, lng: 44.4840 },
  ];

  const handleAddressInputChange = (value: string) => {
    setAddressInput(value);
    setShowSuggestions(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (!value.trim()) {
      setAddressSuggestions([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAddress(true);
      const results = await searchAddresses(value, language);
      setAddressSuggestions(results);
      setIsSearchingAddress(false);
    }, 250);
  };

  const handleSelectSuggestion = (item: GeocodingResult) => {
    setAddressInput(item.displayName);
    setLocationCoords({ lat: item.lat, lng: item.lng });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!addressInput.trim()) return;
    setIsSearchingAddress(true);
    const results = await searchAddresses(addressInput, language);
    setIsSearchingAddress(false);
    if (results.length > 0) {
      handleSelectSuggestion(results[0]);
    }
  };

  // Eligible specialists for this category
  const eligibleSpecialists = useMemo(() => {
    return (Object.values(specialistProfiles) as SpecialistProfile[]).filter(
      (spec) =>
        spec.approvalStatus === 'approved' &&
        spec.categories.includes(category.id)
    );
  }, [specialistProfiles, category.id]);

  if (!isOpen) return null;

  const currentSpecialistProfile = specialistProfiles[selectedSpecialistId] || eligibleSpecialists[0];
  const currentSpecialistUser = users.find((u) => u.id === currentSpecialistProfile?.userId);

  // Total pricing calculation
  const basePrice = service.basePrice;
  const calloutFee = selectedMode === 'specialist_goes' ? service.calloutFee : 0;
  const totalAmount = basePrice + calloutFee;

  const localizedCategoryName = getCategoryName(category, language);
  const localizedServiceName = getServiceName(service, language);

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (selectedMode === 'specialist_goes' && !addressInput.trim()) {
        setErrorMessage(
          language === 'ru'
            ? 'Пожалуйста, укажите адрес'
            : language === 'en'
            ? 'Please enter the address'
            : 'Խնդրում ենք մուտքագրել հասցեն'
        );
        return;
      }
      setStep(4);
    }
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const res = createOrder({
      serviceId: service.id,
      serviceName: localizedServiceName,
      categoryId: category.id,
      serviceMode: selectedMode,
      specialistId: currentSpecialistProfile?.userId || 'user_spec_1',
      customerAddress: addressInput,
      customerLocation: {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        address: addressInput,
      },
      problemDescription,
      attachments: attachmentName ? [attachmentName] : [],
      basePrice,
      calloutFee,
      totalAmount,
      paymentMethod,
      isImmediate,
      scheduledDate: isImmediate ? undefined : selectedDate,
      scheduledTime: isImmediate ? undefined : selectedTimeSlot,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      onOrderSuccess(res.order.id);
      onClose();
    } else {
      setErrorMessage(res.error || (language === 'ru' ? 'Ошибка создания заказа' : language === 'en' ? 'Order creation error' : 'Պատվերի ստեղծման սխալ'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={service.imageUrl || category.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80'}
              alt={localizedServiceName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
            />
            <div>
              <div className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                {localizedCategoryName}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">{localizedServiceName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-blue-600 font-bold' : 'text-slate-500'}>
              {t.wizard.step1Title}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-blue-600 font-bold' : 'text-slate-500'}>
              {t.wizard.step2Title}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-blue-600 font-bold' : 'text-slate-500'}>
              {t.wizard.step3Title}
            </span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              4
            </span>
            <span className={step === 4 ? 'text-blue-600 font-bold' : 'text-slate-500'}>
              {t.wizard.step4Title}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Service Mode Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.wizard.step1Title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ru'
                    ? 'Укажите, каким способом вы хотите получить услугу'
                    : language === 'en'
                    ? 'Choose how you would like to receive the service'
                    : 'Նշեք, թե ինչպես եք ցանկանում ստանալ ծառայությունը'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {service.availableModes.includes('specialist_goes') && (
                  <div
                    onClick={() => setSelectedMode('specialist_goes')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      selectedMode === 'specialist_goes'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          1. {getServiceModeText('specialist_goes', language)}
                        </span>
                        <span className="text-xs font-bold text-blue-700">
                          +{service.calloutFee.toLocaleString()} ֏
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'ru'
                          ? 'Специалист прибудет по вашему адресу со всеми необходимыми инструментами.'
                          : language === 'en'
                          ? 'The specialist will arrive at your address with all necessary tools.'
                          : 'Մասնագետը կժամանի Ձեր նշած վայր՝ բոլոր անհրաժեշտ գործիքներով և պահեստամասերով:'}
                      </p>
                    </div>
                  </div>
                )}

                {service.availableModes.includes('customer_brings') && (
                  <div
                    onClick={() => setSelectedMode('customer_brings')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      selectedMode === 'customer_brings'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          2. {getServiceModeText('customer_brings', language)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">0 ֏</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'ru'
                          ? 'Клиент самостоятельно приносит устройство в мастерскую/сервисный центр.'
                          : language === 'en'
                          ? 'Customer brings the device directly to the specialist workshop.'
                          : 'Հաճախորդն անձամբ է մոտենում մասնագետի աշխատանքային արհեստանոց/արտել:'}
                      </p>
                    </div>
                  </div>
                )}

                {service.availableModes.includes('phone_consult') && (
                  <div
                    onClick={() => setSelectedMode('phone_consult')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      selectedMode === 'phone_consult'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          3. {getServiceModeText('phone_consult', language)}
                        </span>
                        <span className="text-xs font-bold text-purple-700">
                          {language === 'ru' ? 'Консультация' : language === 'en' ? 'Consultation' : 'Անվճար նախազանգ'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'ru'
                          ? 'Специалист свяжется с вами для первичной диагностики и оценки стоимости.'
                          : language === 'en'
                          ? 'Specialist will call you for initial problem assessment and guidance.'
                          : 'Մասնագետը կապվում է Ձեզ հետ՝ խնդրի բարդությունն ու գինը նախապես ճշտելու համար:'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Specialist & Time Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.wizard.step2Title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {eligibleSpecialists.map((spec) => {
                    const u = users.find((x) => x.id === spec.userId);
                    const isSelected = selectedSpecialistId === spec.userId;
                    return (
                      <div
                        key={spec.userId}
                        onClick={() => setSelectedSpecialistId(spec.userId)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={u?.avatarUrl}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                            <span>{u?.fullName}</span>
                            <span className="flex items-center gap-0.5 text-amber-600 text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {spec.rating}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{spec.workingAddress}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                            ● {spec.isOnline
                              ? (language === 'ru' ? 'Сейчас свободен' : language === 'en' ? 'Available now' : 'Այս պահին ազատ է')
                              : (language === 'ru' ? 'Занят' : language === 'en' ? 'Busy' : 'Զբաղված է')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timing Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">
                  {language === 'ru' ? 'Время выполнения' : language === 'en' ? 'Schedule & Time' : 'Ժամանակացույց'}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsImmediate(true)}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isImmediate
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {t.wizard.immediateBooking}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsImmediate(false)}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      !isImmediate
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {t.wizard.scheduledBooking}
                  </button>
                </div>

                {!isImmediate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        {language === 'ru' ? 'Дата' : language === 'en' ? 'Date' : 'Ամսաթիվ'}
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        {language === 'ru' ? 'Доступное время' : language === 'en' ? 'Time Slot' : 'Հասանելի ժամային slot'}
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="10:00 - 11:30">10:00 - 11:30</option>
                        <option value="12:00 - 13:30">12:00 - 13:30</option>
                        <option value="14:30 - 15:30">14:30 - 15:30</option>
                        <option value="16:00 - 17:30">16:00 - 17:30</option>
                        <option value="18:00 - 19:30">18:00 - 19:30</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Address & Problem Description */}
          {step === 3 && (
            <div className="space-y-4">
              {selectedMode === 'specialist_goes' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {t.wizard.addressInputLabel}
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">
                        {language === 'ru' ? 'Поиск улицы или выбор на карте' : language === 'en' ? 'Search street or pick on map' : 'Գրեք հասցեն կամ ընտրեք քարտեզից'}
                      </span>
                    </label>

                    <form onSubmit={handleExecuteSearch} className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          placeholder={
                            language === 'ru'
                              ? 'Поиск: напр. Абовян 15, Баграмян, Комитас...'
                              : language === 'en'
                              ? 'Search: e.g. Abovyan 15, Baghramyan, Komitas...'
                              : 'Որոնում՝ օր. Աբովյան 15, Բաղրամյան 24, Կոմիտաս...'
                          }
                          value={addressInput}
                          onChange={(e) => handleAddressInputChange(e.target.value)}
                          onFocus={() => {
                            if (addressSuggestions.length > 0) setShowSuggestions(true);
                          }}
                          className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-sm"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {isSearchingAddress ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </div>
                        {addressInput && (
                          <button
                            type="button"
                            onClick={() => {
                              setAddressInput('');
                              setAddressSuggestions([]);
                              setShowSuggestions(false);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleExecuteSearch()}
                        className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition flex items-center gap-1 shrink-0"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{language === 'ru' ? 'Найти' : language === 'en' ? 'Find' : 'Գտնել'}</span>
                      </button>
                    </form>

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute z-[1050] top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
                        <div className="p-1.5 max-h-48 overflow-y-auto divide-y divide-slate-100">
                          {addressSuggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(item)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 hover:text-blue-900 rounded-lg flex items-center gap-2.5 transition group"
                            >
                              <div className="p-1.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 shrink-0">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 truncate">
                                <span className="font-semibold block truncate">{item.displayName}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick District Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar text-[11px]">
                      <span className="text-slate-600 font-bold shrink-0 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-slate-700" />
                        {language === 'ru' ? 'Районы:' : language === 'en' ? 'Districts:' : 'Թաղամասեր՝'}
                      </span>
                      {QUICK_DISTRICTS.map((dist, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const label = language === 'ru' ? dist.labelRu : language === 'en' ? dist.labelEn : dist.labelHy;
                            setAddressInput(dist.name);
                            setLocationCoords({ lat: dist.lat, lng: dist.lng });
                            setShowSuggestions(false);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg font-medium whitespace-nowrap transition"
                        >
                          {language === 'ru' ? dist.labelRu : language === 'en' ? dist.labelEn : dist.labelHy}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leaflet interactive location picker */}
                  <MapView
                    customerLocation={{ lat: locationCoords.lat, lng: locationCoords.lng }}
                    interactive={true}
                    height="230px"
                    language={language}
                    onSelectLocation={(loc) => {
                      setLocationCoords({ lat: loc.lat, lng: loc.lng });
                      setAddressInput(loc.address);
                      setShowSuggestions(false);
                    }}
                  />
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-700" />
                    {language === 'ru'
                      ? 'Адрес мастерской специалиста'
                      : language === 'en'
                      ? 'Specialist Workshop Address'
                      : 'Մասնագետի սերվիս կենտրոնի հասցեն'}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {currentSpecialistProfile?.workingAddress || 'ք. Երևան, Կոմիտաս 35'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {language === 'ru'
                      ? 'После подтверждения заказа вы можете подойти по указанному адресу.'
                      : language === 'en'
                      ? 'After order confirmation, you can visit the specified service center.'
                      : 'Հաստատումից հետո Դուք կարող եք մոտենալ նշված աշխատանքային հասցեով:'}
                  </div>
                </div>
              )}

              {/* Problem Description & Attachments */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    {t.wizard.problemDescLabel}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      language === 'ru'
                        ? 'Опишите симптомы поломки или модель устройства...'
                        : language === 'en'
                        ? 'Describe the issue or device model...'
                        : 'Նկարագրեք խնդրի ախտանշանները կամ սարքի մոդելը...'
                    }
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    {t.wizard.attachmentsLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl text-xs text-slate-600 cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>{attachmentName || (language === 'ru' ? 'Загрузить фото дефекта' : language === 'en' ? 'Upload defect photo' : 'Վերբեռնել խոտանի լուսանկար')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachmentName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                    {attachmentName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method & Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.wizard.paymentMethodLabel}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ru'
                    ? 'Средства удерживаются на безопасном эскроу-счете и переводятся мастеру только после выполнения заказа'
                    : language === 'en'
                    ? 'Funds are held securely in Escrow and released to the specialist only upon order completion'
                    : 'Գումարը պահվում է անվտանգ Էսքրոու հաշվին և փոխանցվում է միայն աշխատանքի ավարտից հետո'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('online_escrow')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'online_escrow'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      {t.wizard.recommended}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{t.wizard.onlineEscrow}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {t.wizard.onlineEscrowDesc}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-6 h-6 text-amber-600" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {language === 'ru' ? 'Наличные' : language === 'en' ? 'Cash' : 'Տեղում'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{t.wizard.cashOnDelivery}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {t.wizard.cashOnDeliveryDesc}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 pb-1 border-b border-slate-200">
                  {language === 'ru' ? 'Сводка заказа' : language === 'en' ? 'Order Summary' : 'Վճարման ամփոփագիր'}
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.wizard.basePriceLabel} ({localizedServiceName})</span>
                  <span className="font-medium text-slate-900">{basePrice.toLocaleString()} ֏</span>
                </div>
                {calloutFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{t.wizard.calloutFeeLabel}</span>
                    <span className="font-medium text-slate-900">+{calloutFee.toLocaleString()} ֏</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>{t.wizard.totalLabel}</span>
                  <span className="text-base text-blue-700">{totalAmount.toLocaleString()} ֏</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.wizard.back}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {t.common.cancel}
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>{t.wizard.next}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.wizard.confirmAndBook}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

