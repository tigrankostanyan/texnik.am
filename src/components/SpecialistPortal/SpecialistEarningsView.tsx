import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Building,
} from 'lucide-react';

export const SpecialistEarningsView: React.FC = () => {
  const { specialistOrders, specialistProfiles, currentUser, language, t } = useApp();
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'idram' | 'bank_card' | 'telcell'>('idram');
  const [accountNumber, setAccountNumber] = useState('094 11 22 33');

  const myProfile = currentUser ? specialistProfiles[currentUser.id] : null;

  // Calculate earnings
  const completedOrders = specialistOrders.filter(
    (o) => o.status === 'closed' || o.status === 'paid' || o.status === 'completed'
  );

  const totalGrossRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommissionDeducted = completedOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalNetEarnings = completedOrders.reduce((sum, o) => sum + o.specialistEarnings, 0);

  const pendingEscrow = specialistOrders
    .filter((o) => o.status === 'in_progress' || o.status === 'on_the_way' || o.status === 'confirmed')
    .reduce((sum, o) => sum + o.specialistEarnings, 0);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t.specialist.earningsAndFinance}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.specialist.earningsSubtitle}
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Payout Balance */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.specialist.availableNetIncome}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalNetEarnings.toLocaleString()} ֏
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {t.specialist.readyForPayout}
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.specialist.escrowFrozen}
            </span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-700">
            {pendingEscrow.toLocaleString()} ֏
          </div>
          <div className="text-[11px] text-slate-500">{t.specialist.escrowSubtitle}</div>
        </div>

        {/* Gross Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.specialist.grossRevenue}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalGrossRevenue.toLocaleString()} ֏
          </div>
          <div className="text-[11px] text-slate-500">{completedOrders.length} {t.specialist.completedOrdersCount}</div>
        </div>

        {/* Commission Deducted */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.specialist.platformCommission} (15%)
            </span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-800">
            {totalCommissionDeducted.toLocaleString()} ֏
          </div>
          <div className="text-[11px] text-slate-500">{t.specialist.platformFeeDesc}</div>
        </div>
      </div>

      {/* Payout Request Section & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Completed Orders Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              {t.specialist.incomeLog}
            </h3>
            <span className="text-xs text-slate-400">{t.specialist.recentTransactions}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">{t.specialist.orderCol}</th>
                  <th className="pb-3">{t.specialist.customerCol}</th>
                  <th className="pb-3 text-right">{t.specialist.revenueCol}</th>
                  <th className="pb-3 text-right">{t.specialist.commissionCol} (15%)</th>
                  <th className="pb-3 text-right">{t.specialist.netEarningsCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      {t.specialist.noCompletedPayouts}
                    </td>
                  </tr>
                ) : (
                  completedOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{ord.serviceName}</div>
                        <div className="text-[10px] text-slate-400">#{ord.orderNumber} • {new Date(ord.createdAt).toLocaleDateString(language === 'hy' ? 'hy-AM' : language === 'ru' ? 'ru-RU' : 'en-US')}</div>
                      </td>
                      <td className="py-3 text-slate-700 font-medium">{ord.customerName}</td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        {ord.totalAmount.toLocaleString()} ֏
                      </td>
                      <td className="py-3 text-right text-rose-600 font-medium">
                        -{ord.commissionAmount.toLocaleString()} ֏
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600">
                        +{ord.specialistEarnings.toLocaleString()} ֏
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Payout Request Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            {t.specialist.payoutRequest}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.specialist.payoutSubtitle}
          </p>

          {payoutSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-900">{t.specialist.payoutSuccessTitle}</div>
              <div className="text-[11px] text-emerald-700">
                {t.specialist.payoutSuccessDesc}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  {t.specialist.selectPayoutMethod}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('idram')}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      payoutMethod === 'idram'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Idram
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('telcell')}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      payoutMethod === 'telcell'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Telcell
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank_card')}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      payoutMethod === 'bank_card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {language === 'ru' ? 'Карта' : language === 'en' ? 'Card' : 'Քարտ'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.specialist.accountNumberOrPhone}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.specialist.payoutAmountLabel} (֏)
                </label>
                <input
                  type="number"
                  defaultValue={totalNetEarnings > 0 ? totalNetEarnings : 10000}
                  max={totalNetEarnings || 50000}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{t.specialist.requestPayoutBtn}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

