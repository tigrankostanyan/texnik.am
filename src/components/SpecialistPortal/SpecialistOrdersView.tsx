import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { MapView } from '../MapView';
import { OrderChatDrawer } from '../OrderChatDrawer';
import { InvoiceModal } from '../InvoiceModal';
import { ReportModal } from '../ReportModal';
import { getOrderStatusText } from '../../i18n/translations';
import {
  CheckCircle,
  XCircle,
  Car,
  Play,
  CheckCheck,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
  ShieldCheck,
  Flag,
} from 'lucide-react';

export const SpecialistOrdersView: React.FC = () => {
  const { specialistOrders, updateOrderStatus, currentUser, language, t } = useApp();

  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string; orderId: string } | null>(null);

  const pendingOrders = specialistOrders.filter(
    (o) => o.status === 'created' || o.status === 'sent_to_specialist'
  );

  const activeOrders = specialistOrders.filter(
    (o) =>
      o.status === 'confirmed' ||
      o.status === 'on_the_way' ||
      o.status === 'in_progress' ||
      o.status === 'completed'
  );

  const closedOrders = specialistOrders.filter(
    (o) => o.status === 'closed' || o.status === 'paid' || o.status === 'cancelled'
  );

  const handleAcceptOrder = (orderId: string) => {
    const reason = language === 'ru'
      ? 'Мастер принял заказ'
      : language === 'en'
      ? 'Specialist accepted order'
      : 'Մասնագետը հաստատեց պատվերը';
    updateOrderStatus(orderId, 'confirmed', reason);
  };

  const handleRejectOrder = (orderId: string) => {
    const promptMsg = language === 'ru' ? 'Укажите причину отказа:' : language === 'en' ? 'Specify rejection reason:' : 'Նշեք մերժման պատճառը՝';
    const fallback = language === 'ru' ? 'По причине занятости' : language === 'en' ? 'Due to schedule conflict' : 'Զբաղվածության պատճառով';
    const reason = prompt(promptMsg) || fallback;
    updateOrderStatus(orderId, 'cancelled', reason);
  };

  const handleStartTravel = (orderId: string) => {
    const reason = language === 'ru'
      ? 'Мастер выехал по адресу клиента'
      : language === 'en'
      ? 'Specialist is on the way to customer'
      : 'Մասնագետը ճանապարհվեց դեպի հաճախորդի հասցե';
    updateOrderStatus(orderId, 'on_the_way', reason);
  };

  const handleStartWork = (orderId: string) => {
    const reason = language === 'ru'
      ? 'Мастер на месте, работа начата'
      : language === 'en'
      ? 'Specialist arrived, work started'
      : 'Մասնագետը տեղում է, աշխատանքը սկսված է';
    updateOrderStatus(orderId, 'in_progress', reason);
  };

  const handleCompleteWork = (orderId: string) => {
    const reason = language === 'ru'
      ? 'Мастер завершил работу'
      : language === 'en'
      ? 'Specialist marked job completed'
      : 'Մասնագետը ավարտեց աշխատանքը';
    updateOrderStatus(orderId, 'completed', reason);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.specialist.ordersDashboard}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.specialist.dashboardSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">Live GPS & Order Dispatching</span>
        </div>
      </div>

      {/* 1. Pending Incoming Orders (Action Required) */}
      {pendingOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>{t.specialist.newRequests}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                      #{ord.orderNumber}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{ord.serviceName}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-blue-700">{ord.totalAmount.toLocaleString()} ֏</div>
                    <div className="text-[10px] text-slate-500">
                      {t.specialist.yourEarnings}: ~{ord.specialistEarnings.toLocaleString()} ֏
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span><b>{t.specialist.address}:</b> {ord.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      <b>{t.specialist.time}:</b> {ord.isImmediate ? (language === 'ru' ? 'Срочно (Сейчас)' : language === 'en' ? 'Immediate' : 'Շտապ (Այս պահին)') : `${ord.scheduledDate} ${ord.scheduledTime}`}
                    </span>
                  </div>
                  {ord.problemDescription && (
                    <p className="text-slate-600 italic bg-white p-2 rounded-xl border border-amber-200 text-[11px]">
                      «{ord.problemDescription}»
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-amber-200">
                  <button
                    onClick={() => handleRejectOrder(ord.id)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    {t.specialist.reject}
                  </button>
                  <button
                    onClick={() => handleAcceptOrder(ord.id)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t.specialist.acceptOrder}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active Orders in Progress */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {t.specialist.activeOrders} ({activeOrders.length})
        </h3>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            {t.specialist.noActiveOrders}
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{ord.serviceName}</span>
                      <span className="text-xs text-slate-400">#{ord.orderNumber}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t.specialist.customer}: <b>{ord.customerName}</b> ({ord.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ord.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'on_the_way'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : ord.status === 'in_progress'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {getOrderStatusText(ord.status, language)}
                    </span>

                    <button
                      onClick={() => setActiveChatOrder(ord)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title={t.tracking.chat}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.tracking.chat}</span>
                    </button>

                    <button
                      onClick={() =>
                        setReportTarget({
                          id: ord.customerId,
                          name: ord.customerName,
                          orderId: ord.id,
                        })
                      }
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                      title={t.tracking.report}
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content & Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block">{t.specialist.address}:</span>
                      <span className="font-semibold text-slate-900">{ord.customerAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.specialist.paymentAndAmount}:</span>
                      <span className="font-semibold text-slate-900">
                        {ord.totalAmount.toLocaleString()} ֏ ({ord.paymentMethod === 'online_escrow' ? t.wizard.step3Escrow : t.wizard.step3Cash})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t.specialist.netEarnings}:</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        {ord.specialistEarnings.toLocaleString()} ֏
                      </span>
                    </div>
                    {ord.problemDescription && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 italic">
                        «{ord.problemDescription}»
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <MapView
                      customerLocation={ord.customerLocation}
                      specialistLocation={ord.specialistLiveLocation}
                      interactive={false}
                      height="180px"
                      showRoute={true}
                    />
                  </div>
                </div>

                {/* State Transition Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    {language === 'ru' ? 'Этапы: Подтвержден → В пути → В работе → Завершен' : language === 'en' ? 'Order steps: Confirmed → On the way → In progress → Completed' : 'Կարգավիճակի քայլերը՝ Հաստատված → Ճանապարհին → Ընթացքի մեջ → Ավարտված'}
                  </div>

                  <div className="flex gap-2">
                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => handleStartTravel(ord.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Car className="w-4 h-4" />
                        {t.specialist.onTheWay}
                      </button>
                    )}

                    {ord.status === 'on_the_way' && (
                      <button
                        onClick={() => handleStartWork(ord.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Play className="w-4 h-4" />
                        {t.specialist.startWork}
                      </button>
                    )}

                    {ord.status === 'in_progress' && (
                      <button
                        onClick={() => handleCompleteWork(ord.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <CheckCheck className="w-4 h-4" />
                        {t.specialist.completeWork}
                      </button>
                    )}

                    <button
                      onClick={() => setActiveInvoiceOrder(ord)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      {language === 'ru' ? 'Инвойс' : language === 'en' ? 'Invoice' : 'Ինվոյս'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Closed / History Orders */}
      {closedOrders.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.specialist.orderHistory} ({closedOrders.length})
          </h3>

          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {closedOrders.map((ord) => (
              <div key={ord.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {ord.serviceName} <span className="text-slate-400 font-normal">#{ord.orderNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {ord.customerName} • {new Date(ord.createdAt).toLocaleDateString(language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">+{ord.specialistEarnings.toLocaleString()} ֏</div>
                    <div className="text-[10px] text-slate-400">{t.specialist.commission}: {ord.commissionAmount.toLocaleString()} ֏</div>
                  </div>
                  <button
                    onClick={() => setActiveInvoiceOrder(ord)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"
                    title={language === 'ru' ? 'Инвойс' : language === 'en' ? 'Invoice' : 'Դիտել Ինվոյս'}
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      {activeChatOrder && (
        <OrderChatDrawer
          order={activeChatOrder}
          isOpen={!!activeChatOrder}
          onClose={() => setActiveChatOrder(null)}
        />
      )}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}
      {reportTarget && (
        <ReportModal
          targetUserId={reportTarget.id}
          targetUserName={reportTarget.name}
          orderId={reportTarget.orderId}
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
};

