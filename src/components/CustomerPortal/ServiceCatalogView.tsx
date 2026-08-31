import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, ServiceOffering, ServiceMode, SpecialistProfile } from '../../types';
import {
  getCategoryName,
  getServiceName,
  getServiceDescription,
  getServiceModeText,
} from '../../i18n/translations';
import {
  Laptop,
  Smartphone,
  Camera,
  Wrench,
  Search,
  Clock,
  Car,
  PhoneCall,
  Store,
  ShieldCheck,
  Star,
  ArrowRight,
  Filter,
  Sparkles,
  Users,
} from 'lucide-react';

interface ServiceCatalogViewProps {
  onSelectServiceToBook: (service: ServiceOffering, category: ServiceCategory) => void;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({ onSelectServiceToBook }) => {
  const { categories, specialistProfiles, language, t } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');

  const getCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Camera':
        return <Camera className={className} />;
      case 'Wrench':
      default:
        return <Wrench className={className} />;
    }
  };

  // Find specialists count per category
  const getSpecialistsForCategory = (catId: string) => {
    return (Object.values(specialistProfiles) as SpecialistProfile[]).filter(
      (p) => p.approvalStatus === 'approved' && p.categories.includes(catId)
    );
  };

  // Filter services
  const filteredServices = useMemo(() => {
    const list: { service: ServiceOffering; category: ServiceCategory }[] = [];

    categories.forEach((cat) => {
      if (selectedCategoryId !== 'all' && cat.id !== selectedCategoryId) return;

      cat.services.forEach((srv) => {
        if (
          selectedModeFilter !== 'all' &&
          !srv.availableModes.includes(selectedModeFilter as ServiceMode)
        ) {
          return;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const localizedSrvName = (getServiceName(srv, language) || '').toLowerCase();
          const localizedCatName = (getCategoryName(cat, language) || '').toLowerCase();
          const localizedDesc = (getServiceDescription(srv, language) || '').toLowerCase();

          const srvNameHy = (srv.nameHy || '').toLowerCase();
          const srvName = (srv.name || '').toLowerCase();
          const srvDesc = (srv.description || '').toLowerCase();

          const catNameHy = (cat.nameHy || '').toLowerCase();
          const catName = (cat.name || '').toLowerCase();

          const matchName =
            localizedSrvName.includes(q) ||
            srvNameHy.includes(q) ||
            srvName.includes(q);
          const matchDesc = localizedDesc.includes(q) || srvDesc.includes(q);
          const matchCat =
            localizedCatName.includes(q) ||
            catNameHy.includes(q) ||
            catName.includes(q);

          if (!matchName && !matchDesc && !matchCat) return;
        }

        list.push({ service: srv, category: cat });
      });
    });

    return list;
  }, [categories, selectedCategoryId, selectedModeFilter, searchQuery, language]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner with Modern Gradient & Search */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-blue-200 border border-white/15 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.catalog.bannerBadge}</span>
            <span className="w-1 h-1 rounded-full bg-blue-300" />
            <span className="text-emerald-300 font-medium">
              {language === 'ru' ? 'Безопасные сделки' : language === 'en' ? 'Escrow Protected' : 'Էսքրոու Ապահովություն'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.catalog.bannerTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {t.catalog.bannerSubtitle}
          </p>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t.catalog.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/40 shadow-lg font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  ✕ {t.common.cancel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Category Cards Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.catalog.categoriesTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.catalog.categoriesSubtitle}</p>
          </div>
          {selectedCategoryId !== 'all' && (
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t.catalog.showAll}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const catSpecs = getSpecialistsForCategory(cat.id);
            const localizedCatName = getCategoryName(cat, language);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
                className={`relative overflow-hidden rounded-2xl border text-left p-3.5 sm:p-4 transition-all group flex flex-col justify-between h-36 sm:h-40 ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Background image overlay */}
                {cat.imageUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={cat.imageUrl}
                      alt={localizedCatName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    {getCategoryIcon(cat.iconName, 'w-5 h-5')}
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200">
                    {cat.services.length} {t.catalog.servicesCount}
                  </span>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {localizedCatName}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>
                      {catSpecs.length} {t.catalog.specialistsCount}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.catalog.servicesCount}:
          </span>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredServices.length}
          </span>
        </div>

        {/* Mode Filter Selector */}
        <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium shrink-0">{t.catalog.serviceModeFilter}:</span>
          <select
            value={selectedModeFilter}
            onChange={(e) => setSelectedModeFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
          >
            <option value="all">{t.catalog.allModes}</option>
            <option value="specialist_goes">{t.catalog.specialistGoes}</option>
            <option value="customer_brings">{t.catalog.customerBrings}</option>
            <option value="phone_consult">{t.catalog.phoneConsult}</option>
          </select>
        </div>
      </div>

      {/* Services Grid with Rich Attractive Cards */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{t.catalog.noServicesFound}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t.catalog.noServicesDesc}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryId('all');
              setSearchQuery('');
              setSelectedModeFilter('all');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            {t.catalog.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(({ service, category }) => {
            const ratingScore = service.rating || 4.9;
            const reviewsCount = service.reviewsCount || 28;
            const specialistsCount = getSpecialistsForCategory(category.id).length;
            const localizedCatName = getCategoryName(category, language);
            const localizedSrvName = getServiceName(service, language);
            const localizedDesc = getServiceDescription(service, language);

            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Container with Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={service.imageUrl || category.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'}
                      alt={localizedSrvName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient overlays for contrast and readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-black/35" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                          {getCategoryIcon(category.iconName, 'w-3.5 h-3.5 text-blue-600')}
                          <span>{localizedCatName}</span>
                        </span>

                        {service.popular && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                            <Sparkles className="w-3 h-3 fill-white" />
                            {t.catalog.popularBadge}
                          </span>
                        )}
                      </div>

                      {/* Rating Badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-slate-900/85 backdrop-blur-md text-amber-400 border border-white/15 shadow-md shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ratingScore}</span>
                        <span className="text-[10px] text-slate-300 font-normal">({reviewsCount})</span>
                      </div>
                    </div>

                    {/* Bottom Image Overlay Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-white/10 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>~{service.estimatedDurationMin} {t.catalog.durationMinutes}</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-semibold border border-white/10 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>
                          {specialistsCount > 0 ? `${specialistsCount} ${t.catalog.specialistsCount}` : t.orders.statusInProgress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {localizedSrvName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {localizedDesc}
                      </p>
                    </div>

                    {/* Available Service Modes Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.availableModes.includes('specialist_goes') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          <Car className="w-3 h-3 text-blue-600" />
                          {t.catalog.specialistGoes}{' '}
                          {service.calloutFee > 0 ? `(+${service.calloutFee.toLocaleString()} ֏)` : '(0 ֏)'}
                        </span>
                      )}
                      {service.availableModes.includes('customer_brings') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100">
                          <Store className="w-3 h-3 text-amber-600" />
                          {t.catalog.customerBrings}
                        </span>
                      )}
                      {service.availableModes.includes('phone_consult') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          <PhoneCall className="w-3 h-3 text-purple-600" />
                          {t.catalog.phoneConsult}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price & CTA Button */}
                <div className="p-5 pt-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-b-3xl">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.catalog.priceFrom}
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 flex items-baseline gap-1">
                      <span>{service.basePrice.toLocaleString()} ֏</span>
                      {service.maxPrice && (
                        <span className="text-xs text-slate-400 font-normal">
                          - {service.maxPrice.toLocaleString()} ֏
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectServiceToBook(service, category)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:scale-102"
                  >
                    <span>{t.catalog.bookNow}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


