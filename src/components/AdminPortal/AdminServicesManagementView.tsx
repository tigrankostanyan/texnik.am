import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, ServiceOffering, ServiceMode } from '../../types';
import { getCategoryName, getServiceName } from '../../i18n/translations';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Car,
  Store,
  PhoneCall,
  Clock,
  DollarSign,
} from 'lucide-react';

export const AdminServicesManagementView: React.FC = () => {
  const { categories, addCategory, addServiceToCategory, updateService, language, t } = useApp();

  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Wrench');

  // Service form modal
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null);

  const [serviceNameHy, setServiceNameHy] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [basePrice, setBasePrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [calloutFee, setCalloutFee] = useState(2000);
  const [durationMin, setDurationMin] = useState(60);
  const [selectedModes, setSelectedModes] = useState<ServiceMode[]>([
    'specialist_goes',
    'customer_brings',
  ]);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName,
      nameHy: newCatName,
      iconName: newCatIcon,
    });

    setNewCatName('');
    setIsAddingCategory(false);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceNameHy.trim()) return;

    if (editingService) {
      updateService(activeCategory.id, {
        ...editingService,
        name: serviceNameHy,
        nameHy: serviceNameHy,
        description: serviceDesc,
        basePrice,
        maxPrice,
        calloutFee,
        estimatedDurationMin: durationMin,
        availableModes: selectedModes,
      });
      setEditingService(null);
    } else {
      addServiceToCategory(activeCategory.id, {
        categoryId: activeCategory.id,
        name: serviceNameHy,
        nameHy: serviceNameHy,
        description: serviceDesc,
        basePrice,
        maxPrice,
        calloutFee,
        estimatedDurationMin: durationMin,
        availableModes: selectedModes,
        isActive: true,
      });
      setIsAddingService(false);
    }

    // Reset
    setServiceNameHy('');
    setServiceDesc('');
    setBasePrice(5000);
    setCalloutFee(2000);
  };

  const handleOpenEdit = (srv: ServiceOffering) => {
    setEditingService(srv);
    setServiceNameHy(srv.nameHy);
    setServiceDesc(srv.description);
    setBasePrice(srv.basePrice);
    setMaxPrice(srv.maxPrice || srv.basePrice);
    setCalloutFee(srv.calloutFee);
    setDurationMin(srv.estimatedDurationMin);
    setSelectedModes(srv.availableModes);
    setIsAddingService(true);
  };

  const toggleMode = (mode: ServiceMode) => {
    if (selectedModes.includes(mode)) {
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter((m) => m !== mode));
      }
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.admin.servicesManagementTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin.servicesManagementSubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService(null);
            setServiceNameHy('');
            setServiceDesc('');
            setIsAddingService(true);
          }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.admin.addNewService}
        </button>
      </div>

      {/* Categories Tabs & Add Button */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedCatId === cat.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{getCategoryName(cat, language)}</span>
            <span className="text-[10px] opacity-80">({cat.services.length})</span>
          </button>
        ))}

        <button
          onClick={() => setIsAddingCategory(true)}
          className="px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-slate-300 hover:border-purple-500 text-slate-600 hover:text-purple-700 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.admin.newCategory}</span>
        </button>
      </div>

      {/* Add Category Form if Open */}
      {isAddingCategory && (
        <form
          onSubmit={handleCreateCategory}
          className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex flex-wrap items-center gap-3 animate-in fade-in"
        >
          <input
            type="text"
            required
            placeholder={language === 'ru' ? 'Название категории (напр. Электрик)...' : language === 'en' ? 'Category name (e.g. Electrician)...' : 'Կատեգորիայի անվանում (օր.՝ Էլեկտրիկ)...'}
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs flex-1 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
          <select
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
          >
            <option value="Wrench">Wrench</option>
            <option value="Laptop">Laptop</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Camera">Camera</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
          >
            {t.wizard.confirmBooking}
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCategory(false)}
            className="px-3 py-2 text-slate-600 text-xs font-semibold"
          >
            {t.wizard.cancel}
          </button>
        </form>
      )}

      {/* Services List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            {getCategoryName(activeCategory, language)} — {t.admin.servicesList}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {activeCategory?.services.length} {language === 'ru' ? 'услуг' : language === 'en' ? 'services' : 'ծառայություն'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">{t.admin.nameAndDesc}</th>
                <th className="pb-3">{t.admin.basePrice}</th>
                <th className="pb-3">{t.admin.calloutFeeCol}</th>
                <th className="pb-3">{t.admin.durationCol}</th>
                <th className="pb-3">{t.admin.availableModesCol}</th>
                <th className="pb-3 text-right">{t.admin.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCategory?.services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 max-w-xs">
                    <div className="font-bold text-slate-900">{getServiceName(srv, language)}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{srv.description}</div>
                  </td>
                  <td className="py-3.5 font-bold text-purple-700">
                    {srv.basePrice.toLocaleString()} ֏ {srv.maxPrice ? `— ${srv.maxPrice.toLocaleString()} ֏` : ''}
                  </td>
                  <td className="py-3.5 font-medium text-slate-700">
                    {srv.calloutFee > 0 ? `+${srv.calloutFee.toLocaleString()} ֏` : '0 ֏'}
                  </td>
                  <td className="py-3.5 text-slate-600">~{srv.estimatedDurationMin} {language === 'ru' ? 'мин' : language === 'en' ? 'min' : 'րոպե'}</td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {srv.availableModes.includes('specialist_goes') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-50 text-blue-700 font-bold">
                          {t.catalog.specialistGoes}
                        </span>
                      )}
                      {srv.availableModes.includes('customer_brings') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-800 font-bold">
                          {t.catalog.customerBrings}
                        </span>
                      )}
                      {srv.availableModes.includes('phone_consult') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-50 text-purple-700 font-bold">
                          {t.catalog.phoneConsult}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                      title={t.admin.editService}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isAddingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900">
              {editingService ? t.admin.editService : t.admin.addNewService}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.admin.nameAndDesc}
                </label>
                <input
                  type="text"
                  required
                  placeholder="օր.՝ Էկրանի փոխարինում"
                  value={serviceNameHy}
                  onChange={(e) => setServiceNameHy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'ru' ? 'Описание' : language === 'en' ? 'Description' : 'Նկարագրություն'}</label>
                <textarea
                  rows={2}
                  placeholder={language === 'ru' ? 'Укажите детали услуги...' : language === 'en' ? 'Specify service details...' : 'Նշեք ծառայության մանրամասները...'}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.admin.basePrice} (֏)</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.admin.calloutFeeCol} (Callout ֏)
                  </label>
                  <input
                    type="number"
                    required
                    value={calloutFee}
                    onChange={(e) => setCalloutFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'ru' ? 'Максимальная цена (֏)' : language === 'en' ? 'Max Price (֏)' : 'Առավելագույն Գին (֏)'}</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.admin.durationCol} ({language === 'ru' ? 'мин' : language === 'en' ? 'min' : 'րոպե'})</label>
                  <input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Service Modes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  {t.admin.availableModesCol}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => toggleMode('specialist_goes')}
                    className={`p-2 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                      selectedModes.includes('specialist_goes')
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {t.catalog.specialistGoes}
                  </div>
                  <div
                    onClick={() => toggleMode('customer_brings')}
                    className={`p-2 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                      selectedModes.includes('customer_brings')
                        ? 'border-amber-600 bg-amber-50 text-amber-700'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {t.catalog.customerBrings}
                  </div>
                  <div
                    onClick={() => toggleMode('phone_consult')}
                    className={`p-2 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                      selectedModes.includes('phone_consult')
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {t.catalog.phoneConsult}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t.wizard.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {t.admin.saveService}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

