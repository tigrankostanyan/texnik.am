import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { MapView } from '../MapView';
import { InvoiceModal } from '../InvoiceModal';
import { OrderChatDrawer } from '../OrderChatDrawer';
import { ReportModal } from '../ReportModal';
import {
  getOrderStatusText,
  getServiceModeText,
} from '../../i18n/translations';
import {
  Car,
  Clock,
  CheckCircle,
  Phone,
  MessageSquare,
  FileText,
  Star,
  AlertTriangle,
  Flag,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  RotateCcw,
} from 'lucide-react';

interface OrderTrackingViewProps {
  order: Order;
  onBackToOrders: () => void;
  onReorder: (order: Order) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  order,
  onBackToOrders,
  onReorder,
}) => {
  const { updateOrderStatus, submitOrderReview, cancelOrder, language, t } = useApp();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'created':
      case 'sent_to_specialist':
        return 1;
      case 'confirmed':
        return 2;
      case 'on_the_way':
        return 3;
      case 'in_progress':
        return 4;
      case 'completed':
      case 'paid':
        return 5;
      case 'closed':
        return 6;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStepIndex(order.status);

  const handleCustomerConfirmCompletion = () => {
    // Transition to closed and release escrow payment
    const reason = language === 'ru'
      ? 'Клиент подтвердил выполнение работы и оплату'
      : language === 'en'
      ? 'Customer confirmed job completion & payment'
      : 'Հաճախորդը հաստատեց աշխատանքի ավարտը և վճարումը';
    updateOrderStatus(order.id, 'closed', reason);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    const res = submitOrderReview(order.id, ratingScore, reviewComment);
    if (res.success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
      }, 1500);
    } else {
      setReviewError(res.error || (language === 'ru' ? 'Ошибка сохранения отзыва' : language === 'en' ? 'Review submission error' : 'Կարծիքի գրանցման սխալ'));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Status Tag */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          onClick={onBackToOrders}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          ← {t.tracking.backToOrders}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {t.tracking.orderNumber} #{order.orderNumber}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'closed'
                ? 'bg-slate-100 text-slate-700'
                : order.status === 'on_the_way'
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : order.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'cancelled'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {getOrderStatusText(order.status, language)}
          </span>
        </div>
      </div>

      {/* Main Grid: Map Live Tracking & Stepper Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map & Location Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Live ETA Top banner if on the way */}
            {order.status === 'on_the_way' && (
              <div className="bg-amber-500 text-slate-950 px-5 py-3 flex items-center justify-between font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 animate-bounce" />
                  <span>{t.tracking.specialistApproaching}</span>
                </div>
                <div className="bg-white/30 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  {t.tracking.etaPrefix} ~{order.specialistLiveLocation?.etaMinutes || 8} {t.tracking.etaMinutes}
                </div>
              </div>
            )}

            {/* Map Container */}
            <div className="p-3">
              <MapView
                customerLocation={order.customerLocation}
                specialistLocation={order.specialistLiveLocation}
                interactive={false}
                height="360px"
                showRoute={order.status === 'on_the_way' || order.status === 'in_progress'}
              />
            </div>

            {/* Address & Service Details */}
            <div className="p-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">{t.tracking.serviceAddress}</span>
                <div className="font-bold text-slate-900">{order.customerAddress}</div>
                {order.problemDescription && (
                  <p className="text-slate-600 mt-1 italic line-clamp-2">«{order.problemDescription}»</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">{t.tracking.serviceMode}</span>
                <div className="font-bold text-slate-900">
                  {getServiceModeText(order.serviceMode, language)}
                </div>
                <div className="text-slate-500 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  {order.paymentMethod === 'online_escrow' ? t.wizard.step3Escrow : t.wizard.step3Cash} (
                  {order.totalAmount.toLocaleString()} ֏)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Specialist Info & Stepper Actions */}
        <div className="space-y-4">
          {/* Specialist Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.tracking.specialistAssigned}
              </span>
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                title={t.tracking.report}
              >
                <Flag className="w-3 h-3" />
                {t.tracking.report}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                {order.specialistName ? order.specialistName.charAt(0) : (language === 'ru' ? 'М' : language === 'en' ? 'S' : 'Վ')}
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-900">
                  {order.specialistName || (language === 'ru' ? 'Специалист' : language === 'en' ? 'Specialist' : 'Մասնագետ')}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {order.specialistWorkingAddress || (language === 'ru' ? 'Ереван, Армения' : language === 'en' ? 'Yerevan, Armenia' : 'Երևան, Հայաստան')}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsChatOpen(true)}
                className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.tracking.chat}</span>
              </button>

              <button
                onClick={() => alert(`${language === 'ru' ? 'Телефон мастера:' : language === 'en' ? 'Specialist phone:' : 'Մասնագետի հեռախոսահամարն է՝'} ${order.specialistPhone}`)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.tracking.call}</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {t.tracking.timelineTitle}
            </h4>

            <div className="space-y-3 relative pl-6 border-l-2 border-slate-200 ml-2 text-xs">
              {/* Step 1: Created */}
              <div className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  ✓
                </div>
                <div className="font-bold text-slate-900">{t.tracking.step1Title}</div>
                <div className="text-[11px] text-slate-500">{t.tracking.step1Desc}</div>
              </div>

              {/* Step 2: Confirmed */}
              <div className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep >= 2 ? '✓' : '2'}
                </div>
                <div className="font-bold text-slate-900">{t.tracking.step2Title}</div>
                <div className="text-[11px] text-slate-500">{t.tracking.step2Desc}</div>
              </div>

              {/* Step 3: On the way */}
              <div className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep >= 3 ? '✓' : '3'}
                </div>
                <div className="font-bold text-slate-900">{t.tracking.step3Title}</div>
                <div className="text-[11px] text-slate-500">{t.tracking.step3Desc}</div>
              </div>

              {/* Step 4: In Progress */}
              <div className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep >= 4 ? '✓' : '4'}
                </div>
                <div className="font-bold text-slate-900">{t.tracking.step4Title}</div>
                <div className="text-[11px] text-slate-500">{t.tracking.step4Desc}</div>
              </div>

              {/* Step 5: Completed */}
              <div className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    currentStep >= 5 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep >= 5 ? '✓' : '5'}
                </div>
                <div className="font-bold text-slate-900">{t.tracking.step5Title}</div>
                <div className="text-[11px] text-slate-500">{t.tracking.step5Desc}</div>
              </div>
            </div>

            {/* Actions for current status */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {/* Dual completion button if completed by specialist */}
              {order.status === 'completed' && (
                <button
                  onClick={handleCustomerConfirmCompletion}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t.tracking.confirmCompletionBtn}
                </button>
              )}

              {/* Invoice Button */}
              {(order.status === 'completed' || order.status === 'paid' || order.status === 'closed') && (
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  {t.tracking.viewInvoice}
                </button>
              )}

              {/* Review Button strictly for Closed status */}
              {order.status === 'closed' && (
                <div>
                  {order.hasReview ? (
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-emerald-500" />
                      {t.tracking.reviewedThankYou}
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      {t.tracking.leaveReview}
                    </button>
                  )}
                </div>
              )}

              {/* 1-Click Reorder Button */}
              {order.status === 'closed' && (
                <button
                  onClick={() => onReorder(order)}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.tracking.reorderBtn}
                </button>
              )}

              {/* Cancel button if order not yet started */}
              {(order.status === 'created' || order.status === 'sent_to_specialist' || order.status === 'confirmed') && (
                <button
                  onClick={() => {
                    const promptMsg = language === 'ru' ? 'Укажите причину отмены:' : language === 'en' ? 'Specify cancellation reason:' : 'Նշեք չեղարկման պատճառը՝';
                    const r = prompt(promptMsg);
                    if (r) cancelOrder(order.id, r);
                  }}
                  className="w-full py-2 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors"
                >
                  {t.tracking.cancelOrder}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      {isInvoiceOpen && <InvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />}
      {isChatOpen && (
        <OrderChatDrawer order={order} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
      {isReportOpen && (
        <ReportModal
          targetUserId={order.specialistId || 'user_spec_1'}
          targetUserName={order.specialistName || (language === 'ru' ? 'Специалист' : language === 'en' ? 'Specialist' : 'Մասնագետ')}
          orderId={order.id}
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <Star className="w-10 h-10 text-amber-500 fill-amber-400 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">
                {t.tracking.rateSpecialistTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.tracking.rateSpecialistDesc}
              </p>
            </div>

            {reviewSuccess ? (
              <div className="text-center py-4 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle className="w-5 h-5" />
                {t.tracking.reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                    {reviewError}
                  </div>
                )}

                {/* 5 Stars Rating Picker */}
                <div className="flex justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingScore ? 'text-amber-500 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.tracking.reviewCommentLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.tracking.reviewCommentPlaceholder}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs"
                  >
                    {t.tracking.publishReviewBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

