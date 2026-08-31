import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { MapView } from '../MapView';
import { InvoiceModal } from '../InvoiceModal';
import { getOrderStatusText } from '../../i18n/translations';
import {
  MapPin,
  Car,
  Package,
  CheckCircle,
  AlertCircle,
  FileText,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';

export const AdminOrdersMonitoringView: React.FC = () => {
  const { orders, updateOrderStatus, language, t } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = (o.orderNumber || '').includes(q);
      const matchCust = (o.customerName || '').toLowerCase().includes(q);
      const matchSpec = (o.specialistName || '').toLowerCase().includes(q);
      const matchSrv = (o.serviceName || '').toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchSpec && !matchSrv) return false;
    }
    return true;
  });

  const handleAdminForceRelease = (orderId: string) => {
    const msg = language === 'ru' ? 'Подтвердить досрочное освобождение эскроу и завершение заказа?' : language === 'en' ? 'Confirm force release of escrow funds and close order?' : 'Հաստատու՞մ եք էսքրոու գումարի արտահերթ ազատումը և պատվերի ավարտը:';
    if (confirm(msg)) {
      updateOrderStatus(orderId, 'closed', language === 'ru' ? 'Заказ закрыт решением администратора' : language === 'en' ? 'Order closed by administrative decision' : 'Ադմինիստրատորի արտահերթ որոշմամբ պատվերը փակվեց');
    }
  };

  const handleAdminForceCancel = (orderId: string) => {
    const promptMsg = language === 'ru' ? 'Укажите причину отмены:' : language === 'en' ? 'Specify cancellation reason:' : 'Նշեք չեղարկման պատճառը՝';
    const reason = prompt(promptMsg) || (language === 'ru' ? 'Административная отмена' : language === 'en' ? 'Administrative cancellation' : 'Ադմինիստրատիվ չեղարկում');
    updateOrderStatus(orderId, 'cancelled', reason);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.admin.ordersMonitoringTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.ordersMonitoringSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live GPS Stream Active</span>
        </div>
      </div>

      {/* Map & Selected Order Focus Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600" />
              {language === 'ru' ? 'Маршрут заказа:' : language === 'en' ? 'Order route:' : 'Ընտրված Պատվերի Երթուղին՝'} #{selectedOrder?.orderNumber} ({selectedOrder?.serviceName})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {t.tracking.client}՝ {selectedOrder?.customerName}
            </span>
          </div>

          <MapView
            customerLocation={selectedOrder?.customerLocation}
            specialistLocation={selectedOrder?.specialistLiveLocation}
            interactive={false}
            height="320px"
            showRoute={true}
          />
        </div>

        {/* Selected Order Admin Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t.orders.orderNumber}</span>
              <div className="font-extrabold text-slate-900 text-sm">#{selectedOrder?.orderNumber}</div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                selectedOrder?.status === 'closed'
                  ? 'bg-slate-100 text-slate-700'
                  : selectedOrder?.status === 'on_the_way'
                  ? 'bg-amber-100 text-amber-800'
                  : selectedOrder?.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {getOrderStatusText(selectedOrder?.status, language)}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block text-[11px]">{t.orders.service}</span>
              <span className="font-semibold text-slate-900">{selectedOrder?.serviceName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">{t.orders.specialist} & {t.orders.address}</span>
              <span className="font-semibold text-slate-900">
                {selectedOrder?.specialistName || (language === 'ru' ? 'Мастер' : language === 'en' ? 'Specialist' : 'Վարպետ')} • {selectedOrder?.customerAddress}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">{t.orders.totalAmount}</span>
              <span className="font-bold text-slate-900">{selectedOrder?.totalAmount.toLocaleString()} ֏</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.specialist.commission} (15%)</span>
              <span className="font-bold text-purple-700">{selectedOrder?.commissionAmount.toLocaleString()} ֏</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.orders.escrowStatus}</span>
              <span className="font-bold text-emerald-600 capitalize">{selectedOrder?.paymentStatus}</span>
            </div>
          </div>

          {/* Admin Emergency Control Actions */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setInvoiceOrder(selectedOrder)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              {t.tracking.viewReceipt}
            </button>

            {selectedOrder?.status !== 'closed' && selectedOrder?.status !== 'cancelled' && (
              <>
                <button
                  onClick={() => handleAdminForceRelease(selectedOrder.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t.admin.forceReleaseEscrow}
                </button>

                <button
                  onClick={() => handleAdminForceCancel(selectedOrder.id)}
                  className="w-full py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors"
                >
                  {t.admin.forceCancelOrder}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.admin.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="all">{t.admin.allStatuses}</option>
              <option value="created">{getOrderStatusText('created', language)}</option>
              <option value="confirmed">{getOrderStatusText('confirmed', language)}</option>
              <option value="on_the_way">{getOrderStatusText('on_the_way', language)}</option>
              <option value="in_progress">{getOrderStatusText('in_progress', language)}</option>
              <option value="completed">{getOrderStatusText('completed', language)}</option>
              <option value="closed">{getOrderStatusText('closed', language)}</option>
              <option value="cancelled">{getOrderStatusText('cancelled', language)}</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">{t.orders.orderNumber}</th>
                <th className="pb-3">{t.tracking.client}</th>
                <th className="pb-3">{t.orders.specialist}</th>
                <th className="pb-3">{t.orders.totalAmount}</th>
                <th className="pb-3">{t.specialist.commission}</th>
                <th className="pb-3">{t.orders.status}</th>
                <th className="pb-3 text-right">{t.admin.mapFocus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{ord.serviceName}</div>
                      <div className="text-[10px] text-slate-400">#{ord.orderNumber}</div>
                    </td>
                    <td className="py-3.5 text-slate-700">{ord.customerName}</td>
                    <td className="py-3.5 text-slate-700">{ord.specialistName || '—'}</td>
                    <td className="py-3.5 font-bold text-slate-900">{ord.totalAmount.toLocaleString()} ֏</td>
                    <td className="py-3.5 text-purple-700 font-bold">{ord.commissionAmount.toLocaleString()} ֏</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'closed'
                            ? 'bg-slate-100 text-slate-700'
                            : ord.status === 'on_the_way'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {getOrderStatusText(ord.status, language)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(ord);
                        }}
                        className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        {t.admin.mapFocus}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  );
};

