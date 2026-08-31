import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flag, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ReportModalProps {
  targetUserId: string;
  targetUserName: string;
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetUserId,
  targetUserName,
  orderId,
  isOpen,
  onClose,
}) => {
  const { submitReport, language } = useApp();
  const [reason, setReason] = useState('Անձնական կոնտակտների/հեռախոսի առաջարկ հարթակից դուրս');
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reportTxt = {
    hy: {
      title: 'Ուղարկել Զեկույց / Բողոք Ադմինին',
      sentTitle: 'Բողոքն ուղարկված է Ադմինին',
      sentDesc: 'Մեր անվտանգության թիմը կուսումնասիրի դեպքը և կձեռնարկի համապատասխան քայլեր:',
      targetUser: 'Բողոքարկվող օգտատեր՝',
      reasonLabel: 'Խախտման պատճառ',
      r1: 'Անձնական կոնտակտի առաջարկ (հակա-շրջանցում)',
      r2: 'Կեղծ տվյալներ կամ խաբեություն',
      r3: 'Անհարգալից վարքագիծ',
      r4: 'Չկատարված կամ անորակ աշխատանք',
      r5: 'Գնի անհիմն բարձրացում տեղում',
      detailsLabel: 'Մանրամասն նկարագրություն',
      detailsPlaceholder: 'Նկարագրեք տեղի ունեցածը...',
      cancel: 'Չեղարկել',
      submit: 'Ուղարկել Բողոքը',
      errDetail: 'Մանրամասնեք խախտումը',
      errGeneric: 'Սխալ բողոքարկման ժամանակ',
    },
    ru: {
      title: 'Отправить жалобу / Отчет администратору',
      sentTitle: 'Жалоба отправлена администратору',
      sentDesc: 'Служба безопасности рассмотрит инцидент и примет необходимые меры.',
      targetUser: 'Пользователь, на которого подается жалоба:',
      reasonLabel: 'Причина нарушения',
      r1: 'Предложение личных контактов / обход платформы',
      r2: 'Ложные данные или мошенничество',
      r3: 'Неуважительное или грубое поведение',
      r4: 'Невыполненная или некачественная работа',
      r5: 'Необоснованное повышение цены на месте',
      detailsLabel: 'Подробное описание',
      detailsPlaceholder: 'Опишите произошедшее...',
      cancel: 'Отмена',
      submit: 'Отправить жалобу',
      errDetail: 'Пожалуйста, опишите детали нарушения',
      errGeneric: 'Ошибка при отправке жалобы',
    },
    en: {
      title: 'Submit Report / Dispute to Admin',
      sentTitle: 'Report successfully submitted to Admin',
      sentDesc: 'Our trust and safety team will inspect the case and take appropriate enforcement actions.',
      targetUser: 'Reported user:',
      reasonLabel: 'Violation Reason',
      r1: 'Direct offline contact solicitation / platform bypass',
      r2: 'Fraud or fraudulent information',
      r3: 'Disrespectful or abusive behavior',
      r4: 'Incomplete or substandard service quality',
      r5: 'Unjustified on-site price increase',
      detailsLabel: 'Detailed Description',
      detailsPlaceholder: 'Explain what happened...',
      cancel: 'Cancel',
      submit: 'Submit Report',
      errDetail: 'Please specify details of the violation',
      errGeneric: 'Error submitting report',
    },
  };

  const str = reportTxt[language] || reportTxt.hy;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMessage(str.errDetail);
      return;
    }

    const res = submitReport({
      targetUserId,
      orderId,
      reason,
      details,
    });

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } else {
      setErrorMessage(res.error || str.errGeneric);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-400" />
            <span className="font-semibold text-xs">{str.title}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <div className="text-sm font-bold text-slate-900">{str.sentTitle}</div>
              <p className="text-xs text-slate-500">
                {str.sentDesc}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs text-slate-600">
                {str.targetUser} <b className="text-slate-900">{targetUserName}</b>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {str.reasonLabel}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Անձնական կոնտակտների/հեռախոսի առաջարկ հարթակից դուրս">
                    {str.r1}
                  </option>
                  <option value="Կեղծ տվյալներ կամ խաբեություն">{str.r2}</option>
                  <option value="Անհարգալից կամ վտանգավոր վարքագիծ">{str.r3}</option>
                  <option value="Չկատարված կամ անորակ աշխատանք">{str.r4}</option>
                  <option value="Գնի անհիմն բարձրացում տեղում">{str.r5}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {str.detailsLabel}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={str.detailsPlaceholder}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {str.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  {str.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
