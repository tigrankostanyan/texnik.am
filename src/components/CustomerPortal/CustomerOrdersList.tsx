import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { InvoiceModal } from '../InvoiceModal';
import {
  getOrderStatusText,
  getServiceModeText,
} from '../../i18n/translations';
import {
  Package,
  Clock,
  CheckCircle,
  Car,
  FileText,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Star,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface CustomerOrdersListProps {
  onSelectOrder: (order: Order) => void;
  onNewOrderClick: () => void;
  onReorder: (order: Order) => void;
}

export const CustomerOrdersList: React.FC<CustomerOrdersListProps> = ({
  onSelectOrder,
  onNewOrderClick,
  onReorder,
}) => {
  const { customerOrders, currentUser, categories, users, language, t } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Helper to find service thumbnail
  const getServiceThumbnail = (catId: string, srvId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80';
    const srv = cat.services.find((s) => s.id === srvId);
    return srv?.imageUrl || cat.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=80';
  };

  const getSpecialistAvatar = (specId?: string) => {
    if (!specId) return undefined;
    const u = users.find((usr) => usr.id === specId);
    return u?.avatarUrl;
  };

  const filteredOrders = customerOrders.filter((ord) => {
    if (filterTab === 'active') {
      return ord.status !== 'closed' && ord.status !== 'cancelled';
    }
    if (filterTab === 'completed') {
      return ord.status === 'closed' || ord.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{t.orders.myOrders}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.orders.myOrdersSubtitle}
          </p>
        </div>

        <button
          onClick={onNewOrderClick}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.orders.newOrder}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-84 text-xs font-semibold">
        <button
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.orders.filterAll} ({customerOrders.length})
        </button>
        <button
          onClick={() => setFilterTab('active')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            filterTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.orders.filterActive} ({customerOrders.filter((o) => o.status !== 'closed' && o.status !== 'cancelled').length})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            filterTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.orders.filterCompleted}
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{t.orders.noOrdersFound}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t.orders.noOrdersDesc}
            </p>
          </div>
          <button
            onClick={onNewOrderClick}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            {t.orders.viewCatalogAndBook}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const thumbnail = getServiceThumbnail(ord.categoryId, ord.serviceId);
            const specAvatar = getSpecialistAvatar(ord.specialistId);

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left Details with Image Thumbnail */}
                <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src={thumbnail}
                      alt={ord.serviceName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{ord.orderNumber}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {ord.serviceName}
                      </h3>
                      {ord.serviceMode && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {getServiceModeText(ord.serviceMode, language)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      {/* Specialist preview with avatar */}
                      <div className="flex items-center gap-1.5 font-medium">
                        {specAvatar ? (
                          <img
                            src={specAvatar}
                            alt={ord.specialistName || 'Specialist'}
                            referrerPolicy="no-referrer"
                            className="w-4 h-4 rounded-full object-cover border border-slate-300"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-200 text-[8px] font-bold flex items-center justify-center text-slate-600">
                            {language === 'ru' ? 'М' : language === 'en' ? 'S' : 'Վ'}
                          </div>
                        )}
                        <span>{ord.specialistName || (language === 'ru' ? 'Мастер' : language === 'en' ? 'Specialist' : 'Վարպետ')}</span>
                      </div>

                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(ord.createdAt).toLocaleDateString(language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {ord.totalAmount.toLocaleString()} ֏
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-md">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{ord.customerAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      ord.status === 'closed'
                        ? 'bg-slate-100 text-slate-700'
                        : ord.status === 'on_the_way'
                        ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                        : ord.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ord.status === 'on_the_way' && <Car className="w-3.5 h-3.5" />}
                    {ord.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{getOrderStatusText(ord.status, language)}</span>
                  </span>

                  {/* Live Track / Details button */}
                  <button
                    onClick={() => onSelectOrder(ord)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>{t.orders.viewTrack}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Invoice button */}
                  {(ord.status === 'completed' || ord.status === 'paid' || ord.status === 'closed') && (
                    <button
                      onClick={() => setInvoiceOrder(ord)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
                      title={language === 'ru' ? 'Квитанция / Инвойс' : language === 'en' ? 'Invoice' : 'Դիտել Ինվոյս'}
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                    </button>
                  )}

                  {/* 1-Click Reorder button */}
                  {ord.status === 'closed' && (
                    <button
                      onClick={() => onReorder(ord)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
                      title={language === 'ru' ? 'Повторить заказ' : language === 'en' ? 'Reorder' : 'Կրկնել պատվերը'}
                    >
                      <RotateCcw className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  );
};


