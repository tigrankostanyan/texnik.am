import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  SpecialistProfile,
  ServiceCategory,
  ServiceOffering,
  Order,
  Review,
  ReportFlag,
  DeviceSession,
  ChatMessage,
  NotificationItem,
  AuditLog,
  PlatformSettings,
  UserRole,
  OrderStatus,
  PaymentMethod,
  Language,
} from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';
import {
  INITIAL_USERS,
  INITIAL_SPECIALIST_PROFILES,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '../data/mockData';
import {
  moderateTextContent,
  checkDataOverlap,
  getOrCreateDeviceFingerprint,
  getDeviceName,
} from '../utils/security';

interface AppContextType {
  // Current user & auth
  currentUser: User | null;
  activeRole: UserRole;
  isLoggedIn: boolean;
  users: User[];
  specialistProfiles: Record<string, SpecialistProfile>;
  categories: ServiceCategory[];
  orders: Order[];
  reviews: Review[];
  reports: ReportFlag[];
  deviceSessions: DeviceSession[];
  chatMessages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  securityAlert: string | null;
  pwaInstallPrompt: any;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;

  // Actions
  switchUser: (userId: string) => void;
  logout: () => void;
  registerUser: (userData: {
    fullName: string;
    phone: string;
    email: string;
    role: 'customer' | 'specialist';
    address?: string;
    idDocumentName?: string;
    selectedCategories?: string[];
    bio?: string;
    workingAddress?: string;
  }) => { success: boolean; error?: string; overlapWarning?: boolean; userId?: string };
  verifyPhoneOTP: (userId: string, code: string) => boolean;
  verifyEmailCode: (userId: string, code: string) => boolean;
  enableTwoFactor: (userId: string, secret: string, type: 'totp' | 'sms') => void;
  dismissSecurityAlert: () => void;

  // Category & Service management (Admin)
  saveCategory: (category: ServiceCategory) => void;
  deleteCategory: (categoryId: string) => void;
  saveService: (service: ServiceOffering) => void;
  deleteService: (categoryId: string, serviceId: string) => void;

  // Order Lifecycle
  createOrder: (orderData: Partial<Order>) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus, note?: string) => void;
  reassignOrder: (orderId: string, newSpecialistId?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  submitOrderReview: (orderId: string, rating: number, comment: string) => { success: boolean; error?: string };

  // Specialist actions
  updateSpecialistSchedule: (schedule: SpecialistProfile['weeklySchedule']) => void;
  toggleSpecialistOnline: (online: boolean) => void;
  updateSpecialistBio: (bio: string) => { success: boolean; error?: string };
  requestPayout: (amount: number) => { success: boolean; error?: string };
  payCashDebt: (amount: number) => void;

  // Admin moderation & settings
  setGlobalCommissionRate: (rate: number) => void;
  setSpecialistCommissionOverride: (specialistId: string, override?: number) => void;
  approveSpecialist: (specialistId: string, note?: string) => void;
  rejectSpecialist: (specialistId: string, note?: string) => void;
  toggleUserSuspension: (userId: string, reason?: string) => void;
  resolveOverlapAccount: (userId: string, allow: boolean) => void;
  resolveReport: (reportId: string, actionNote: string, suspendTarget?: boolean) => void;
  updatePlatformColors: (colors: PlatformSettings['colors']) => void;

  // Chat & Moderation
  sendChatMessage: (orderId: string, text: string) => { success: boolean; error?: string };
  submitReport: (reportData: {
    targetUserId: string;
    orderId?: string;
    reason: string;
    details: string;
  }) => { success: boolean; error?: string };

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  triggerPushNotification: (title: string, message: string, linkOrderId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage hydration or initial defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [specialistProfiles, setSpecialistProfiles] = useState<Record<string, SpecialistProfile>>(() => {
    const saved = localStorage.getItem('vp_specialists');
    return saved ? JSON.parse(saved) : INITIAL_SPECIALIST_PROFILES;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('vp_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('vp_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [reports, setReports] = useState<ReportFlag[]>(() => {
    const saved = localStorage.getItem('vp_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('vp_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('vp_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('vp_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('vp_chat_messages');
    if (saved) return JSON.parse(saved);
    return {
      ord_102: [
        {
          id: 'msg_1',
          orderId: 'ord_102',
          senderId: 'user_cust_2',
          senderName: 'Դավիթ Պետրոսյան',
          senderRole: 'customer',
          text: 'Բարև Ձեզ, դռան կոդը #244 է:',
          createdAt: '2026-08-30T10:50:00Z',
          read: true,
        },
        {
          id: 'msg_2',
          orderId: 'ord_102',
          senderId: 'user_spec_1',
          senderName: 'Գոռ Հակոբյան',
          senderRole: 'specialist',
          text: 'Բարև Ձեզ, շնորհակալություն, արդեն մոտենում եմ:',
          createdAt: '2026-08-30T11:02:00Z',
          read: true,
        }
      ]
    };
  });

  // Current session & active user (defaults to Customer 2, with easy instant switcher)
  const [currentUserId, setCurrentUserId] = useState<string>('user_cust_2');
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<any>(null);

  // Multi-language localization state (hy, ru, en)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vp_lang');
    return saved === 'ru' || saved === 'en' || saved === 'hy' ? saved : 'hy';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vp_lang', lang);
  };

  const t = translations[language] || translations.hy;

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const activeRole: UserRole = currentUser ? currentUser.role : 'customer';

  // Apply colors to root CSS variables dynamically
  useEffect(() => {
    if (settings.colors) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', settings.colors.primary);
      root.style.setProperty('--color-primary-hover', settings.colors.primaryHover);
      root.style.setProperty('--color-primary-light', settings.colors.primaryLight);
      root.style.setProperty('--color-accent', settings.colors.accent);
      root.style.setProperty('--color-accent-light', settings.colors.accentLight);
      root.style.setProperty('--color-bg', settings.colors.background);
      root.style.setProperty('--color-surface', settings.colors.surface);
    }
  }, [settings.colors]);

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('vp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vp_specialists', JSON.stringify(specialistProfiles));
  }, [specialistProfiles]);

  useEffect(() => {
    localStorage.setItem('vp_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vp_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vp_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('vp_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('vp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vp_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('vp_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Register PWA install prompt & Service Worker
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration note:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Initialize device sessions & fingerprinting
  useEffect(() => {
    if (currentUser) {
      const devId = getOrCreateDeviceFingerprint();
      const devName = getDeviceName();
      
      const newSession: DeviceSession = {
        id: `sess_${Date.now()}`,
        userId: currentUser.id,
        deviceId: devId,
        deviceName: devName,
        ipAddress: '178.134.42.88 (Yerevan, AM)',
        locationName: 'Երևան, Հայաստան',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isCurrent: true,
        status: 'active',
      };

      setDeviceSessions([
        newSession,
        {
          id: `sess_old_1`,
          userId: currentUser.id,
          deviceId: 'dev_mock_mobile_old',
          deviceName: 'Apple iPhone 14 Pro (Safari)',
          ipAddress: '37.26.172.10',
          locationName: 'Երևան, Հայաստան',
          createdAt: '2026-08-28T09:12:00Z',
          lastActive: '2026-08-28T09:40:00Z',
          isCurrent: false,
          status: 'active',
        },
      ]);
    }
  }, [currentUserId]);

  // Simulated live location progression for active specialist on the way
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        let changed = false;
        const updated = prevOrders.map((ord) => {
          if (ord.status === 'on_the_way' && ord.specialistLiveLocation) {
            changed = true;
            const destLat = ord.customerLocation.lat;
            const destLng = ord.customerLocation.lng;
            const curLat = ord.specialistLiveLocation.lat;
            const curLng = ord.specialistLiveLocation.lng;

            // Move step closer
            const step = 0.0008;
            const dLat = destLat - curLat;
            const dLng = destLng - curLng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);

            if (dist > 0.001) {
              const nextLat = curLat + (dLat / dist) * step;
              const nextLng = curLng + (dLng / dist) * step;
              const nextEta = Math.max(1, Math.round((dist / step) * 1.5));
              return {
                ...ord,
                specialistLiveLocation: {
                  lat: nextLat,
                  lng: nextLng,
                  etaMinutes: nextEta,
                },
              };
            } else {
              // Arrived
              return {
                ...ord,
                specialistLiveLocation: {
                  lat: destLat,
                  lng: destLng,
                  etaMinutes: 0,
                },
              };
            }
          }
          return ord;
        });
        return changed ? updated : prevOrders;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const addAuditLog = useCallback((action: string, details: string) => {
    const log: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: currentUser ? currentUser.id : 'system',
      actorName: currentUser ? currentUser.fullName : 'Համակարգ',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, [currentUser]);

  const triggerPushNotification = useCallback((title: string, message: string, linkOrderId?: string) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUserId,
      title,
      message,
      type: 'order',
      linkOrderId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    // Service worker push notification trigger if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/icon-192.png' });
    }
  }, [currentUserId]);

  const switchUser = useCallback((userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      if (target.status === 'frozen_overlap') {
        setSecurityAlert(`Հաշիվը սառեցված է տվյալների համընկնման պատճառով (Հաճախորդ և Մասնագետ նույն տվյալներով): Դիմեք Ադմինին:`);
      } else if (target.status === 'blocked_fraud' || target.status === 'suspended_admin') {
        setSecurityAlert(`Հաշիվը արգելափակված է անվտանգության կանոնների խախտման պատճառով:`);
      }
      setCurrentUserId(userId);
    }
  }, [users]);

  const logout = useCallback(() => {
    // Return to first customer
    setCurrentUserId('user_cust_1');
  }, []);

  const dismissSecurityAlert = useCallback(() => {
    setSecurityAlert(null);
  }, []);

  // Register new User with Anti-Fraud Data Overlap check
  const registerUser = useCallback((userData: {
    fullName: string;
    phone: string;
    email: string;
    role: 'customer' | 'specialist';
    address?: string;
    idDocumentName?: string;
    selectedCategories?: string[];
    bio?: string;
    workingAddress?: string;
  }) => {
    // 1. Check Content Moderation for Specialist Bio
    if (userData.bio) {
      const mod = moderateTextContent(userData.bio);
      if (!mod.passed) {
        return { success: false, error: mod.violations.join('; ') };
      }
    }

    // 2. Check Data Overlap detection
    const overlap = checkDataOverlap(userData.phone, userData.email, userData.role, users);
    const initialStatus = overlap.hasOverlap ? 'frozen_overlap' : 'active';

    const newUserId = `user_${userData.role}_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      role: userData.role,
      fullName: userData.fullName,
      phone: userData.phone,
      email: userData.email,
      address: userData.address || '',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      isPhoneVerified: false,
      isEmailVerified: false,
      twoFactorEnabled: false,
      status: initialStatus,
      moderationStrikes: 0,
      activeDeviceId: getOrCreateDeviceFingerprint(),
      lastLoginAt: new Date().toISOString(),
    };

    if (userData.role === 'specialist') {
      const newProfile: SpecialistProfile = {
        userId: newUserId,
        idDocumentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
        idDocumentName: userData.idDocumentName || 'id_document.pdf',
        idVerified: false,
        categories: userData.selectedCategories || ['cat_computers'],
        bio: userData.bio || '',
        workingAddress: userData.workingAddress || userData.address || 'ք. Երևան',
        rating: 5.0,
        reviewCount: 0,
        isOnline: true,
        approvalStatus: 'pending',
        earningsGross: 0,
        earningsCommissionPaid: 0,
        earningsNet: 0,
        cashCommissionDebt: 0,
        availablePayoutBalance: 0,
        payoutSchedule: 'weekly',
        location: {
          lat: 40.1872,
          lng: 44.5152,
          address: userData.workingAddress || 'ք. Երևան',
        },
        weeklySchedule: {
          0: { start: '10:00', end: '18:00', active: false },
          1: { start: '09:00', end: '19:00', active: true },
          2: { start: '09:00', end: '19:00', active: true },
          3: { start: '09:00', end: '19:00', active: true },
          4: { start: '09:00', end: '19:00', active: true },
          5: { start: '09:00', end: '19:00', active: true },
          6: { start: '10:00', end: '17:00', active: true },
        },
      };

      setSpecialistProfiles((prev) => ({ ...prev, [newUserId]: newProfile }));
    }

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);

    if (overlap.hasOverlap) {
      addAuditLog(
        'DATA_OVERLAP_FROZEN',
        `Հաշիվը (${userData.fullName}) ավտոմատ սառեցվել է՝ համընկնող տվյալների պատճառով (${overlap.conflictingUser?.fullName})`
      );
      setSecurityAlert('Զգուշացում. Նույն հեռախոսահամարով/էլ. հասցեով գրանցում է հայտնաբերվել այլ դերում: Հաշիվը փոխանցվել է Ադմինի ստուգմանը:');
      return { success: true, overlapWarning: true, userId: newUserId };
    }

    addAuditLog('USER_REGISTERED', `Նոր ${userData.role} գրանցվեց՝ ${userData.fullName}`);
    return { success: true, userId: newUserId };
  }, [users, addAuditLog]);

  const verifyPhoneOTP = useCallback((userId: string, code: string) => {
    // Default valid test OTP is 1234 or any 4 digits in simulation
    if (code.length >= 4) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isPhoneVerified: true } : u))
      );
      addAuditLog('PHONE_VERIFIED', `Հաստատվեց հեռախոսահամարը ID: ${userId}`);
      return true;
    }
    return false;
  }, [addAuditLog]);

  const verifyEmailCode = useCallback((userId: string, code: string) => {
    if (code.length >= 4) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isEmailVerified: true } : u))
      );
      addAuditLog('EMAIL_VERIFIED', `Հաստատվեց էլ. հասցեն ID: ${userId}`);
      return true;
    }
    return false;
  }, [addAuditLog]);

  const enableTwoFactor = useCallback((userId: string, secret: string, type: 'totp' | 'sms') => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, twoFactorEnabled: true, twoFactorSecret: secret, twoFactorType: type }
          : u
      )
    );
    addAuditLog('2FA_ENABLED', `Միացվեց 2FA (${type}) ID: ${userId}`);
  }, [addAuditLog]);

  // Categories & Services CRUD
  const saveCategory = useCallback((category: ServiceCategory) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === category.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = category;
        return copy;
      }
      return [...prev, category];
    });
    addAuditLog('CATEGORY_SAVED', `Պահպանվեց կատեգորիան՝ ${category.nameHy}`);
  }, [addAuditLog]);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    addAuditLog('CATEGORY_DELETED', `Ջնջվեց կատեգորիան ID: ${categoryId}`);
  }, [addAuditLog]);

  const saveService = useCallback((service: ServiceOffering) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === service.categoryId) {
          const sIndex = cat.services.findIndex((s) => s.id === service.id);
          const newServices = [...cat.services];
          if (sIndex >= 0) {
            newServices[sIndex] = service;
          } else {
            newServices.push(service);
          }
          return { ...cat, services: newServices };
        }
        return cat;
      })
    );
    addAuditLog('SERVICE_SAVED', `Պահպանվեց ծառայությունը՝ ${service.nameHy}`);
  }, [addAuditLog]);

  const deleteService = useCallback((categoryId: string, serviceId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            services: cat.services.filter((s) => s.id !== serviceId),
          };
        }
        return cat;
      })
    );
    addAuditLog('SERVICE_DELETED', `Ջնջվեց ծառայությունը ID: ${serviceId}`);
  }, [addAuditLog]);

  // Create Order with commission & escrow hold
  const createOrder = useCallback((orderData: Partial<Order>) => {
    if (!currentUser) return { success: false, error: 'Մուտք եղեք հարթակ' };

    const specialistId = orderData.specialistId;
    const specialistProf = specialistId ? specialistProfiles[specialistId] : undefined;
    const specialistUser = specialistId ? users.find((u) => u.id === specialistId) : undefined;

    const basePrice = orderData.basePrice || 5000;
    const calloutFee = orderData.serviceMode === 'specialist_goes' ? (orderData.calloutFee || 0) : 0;
    const totalAmount = basePrice + calloutFee;

    // Commission calculation
    const commRate = specialistProf?.commissionOverride
      ? specialistProf.commissionOverride / 100
      : settings.globalCommissionRate;

    const commissionAmount = Math.round(totalAmount * commRate);
    const specialistEarnings = totalAmount - commissionAmount;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      customerAddress: orderData.customerAddress || currentUser.address || 'ք. Երևան',
      specialistId: specialistId,
      specialistName: specialistUser?.fullName || 'Մասնագետ',
      specialistPhone: specialistUser?.phone || '+37493000000',
      specialistWorkingAddress: specialistProf?.workingAddress,
      categoryId: orderData.categoryId || 'cat_computers',
      serviceId: orderData.serviceId || 'srv_1',
      serviceName: orderData.serviceName || 'Ծառայություն',
      serviceMode: orderData.serviceMode || 'specialist_goes',
      status: orderData.serviceMode === 'phone_consult' ? 'sent_to_specialist' : 'sent_to_specialist',
      createdAt: new Date().toISOString(),
      scheduledDate: orderData.scheduledDate,
      scheduledTime: orderData.scheduledTime,
      isImmediate: orderData.isImmediate ?? true,
      customerLocation: orderData.customerLocation || {
        lat: 40.1872,
        lng: 44.5152,
        address: orderData.customerAddress || 'ք. Երևան',
      },
      specialistLiveLocation: specialistProf?.location
        ? {
            lat: specialistProf.location.lat,
            lng: specialistProf.location.lng,
            etaMinutes: 12,
          }
        : undefined,
      problemDescription: orderData.problemDescription || '',
      attachments: orderData.attachments || [],
      basePrice,
      calloutFee,
      totalAmount,
      commissionRate: commRate,
      commissionAmount,
      specialistEarnings,
      paymentMethod: orderData.paymentMethod || 'online_escrow',
      paymentStatus: orderData.paymentMethod === 'online_escrow' ? 'escrow_held' : 'unpaid',
      statusHistory: [
        { status: 'created', timestamp: new Date().toISOString(), note: 'Պատվերը ստեղծված է' },
        { status: 'sent_to_specialist', timestamp: new Date().toISOString(), note: 'Ուղարկված է մասնագետին' },
      ],
      hasReview: false,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send push notification to specialist
    if (specialistId) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: specialistId,
          title: 'Նոր պատվերի հարցում',
          message: `Ստացվել է նոր պատվեր #${newOrder.orderNumber} (${newOrder.serviceName}):`,
          type: 'order',
          linkOrderId: newOrder.id,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    }

    addAuditLog('ORDER_CREATED', `Ստեղծվեց պատվեր #${newOrder.orderNumber} (${currentUser.fullName})`);

    return { success: true, order: newOrder };
  }, [currentUser, specialistProfiles, users, settings, addAuditLog]);

  // Update Order Status State Machine
  const updateOrderStatus = useCallback((orderId: string, nextStatus: OrderStatus, note?: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          const timestamp = new Date().toISOString();
          let paymentStatus = ord.paymentStatus;

          // If transitioning to closed and online payment -> release escrow
          if ((nextStatus === 'completed' || nextStatus === 'paid' || nextStatus === 'closed') && ord.paymentMethod === 'online_escrow') {
            paymentStatus = 'paid_released';
          }

          // Update specialist earnings if moving to closed
          if (nextStatus === 'closed' && ord.specialistId) {
            setSpecialistProfiles((prevSpecs) => {
              const spec = prevSpecs[ord.specialistId!];
              if (!spec) return prevSpecs;

              if (ord.paymentMethod === 'online_escrow') {
                return {
                  ...prevSpecs,
                  [ord.specialistId!]: {
                    ...spec,
                    earningsGross: spec.earningsGross + ord.totalAmount,
                    earningsCommissionPaid: spec.earningsCommissionPaid + ord.commissionAmount,
                    earningsNet: spec.earningsNet + ord.specialistEarnings,
                    availablePayoutBalance: spec.availablePayoutBalance + ord.specialistEarnings,
                  },
                };
              } else {
                // Cash payment: specialist collects total cash on spot, owes platform commission
                return {
                  ...prevSpecs,
                  [ord.specialistId!]: {
                    ...spec,
                    earningsGross: spec.earningsGross + ord.totalAmount,
                    earningsCommissionPaid: spec.earningsCommissionPaid + ord.commissionAmount,
                    earningsNet: spec.earningsNet + ord.specialistEarnings,
                    cashCommissionDebt: spec.cashCommissionDebt + ord.commissionAmount,
                  },
                };
              }
            });
          }

          const updated: Order = {
            ...ord,
            status: nextStatus,
            paymentStatus,
            statusHistory: [
              ...ord.statusHistory,
              { status: nextStatus, timestamp, note },
            ],
          };

          // Trigger push notifications
          const notifUserId = currentUser?.id === ord.customerId ? ord.specialistId : ord.customerId;
          if (notifUserId) {
            let title = 'Պատվերի կարգավիճակը փոխվեց';
            let message = `Պատվեր #${ord.orderNumber}: ${nextStatus}`;
            if (nextStatus === 'confirmed') message = 'Մասնագետը հաստատեց Ձեր պատվերը';
            if (nextStatus === 'on_the_way') message = 'Մասնագետը ճանապարհին է դեպի Ձեզ';
            if (nextStatus === 'in_progress') message = 'Աշխատանքը ընթացքի մեջ է';
            if (nextStatus === 'completed') message = 'Աշխատանքը նշվեց որպես ավարտված';
            if (nextStatus === 'closed') message = 'Պատվերը հաջողությամբ փակվեց։ Կարող եք գնահատել մասնագետին';

            setNotifications((prev) => [
              {
                id: `notif_${Date.now()}`,
                userId: notifUserId,
                title,
                message,
                type: 'order',
                linkOrderId: ord.id,
                createdAt: timestamp,
                read: false,
              },
              ...prev,
            ]);
          }

          return updated;
        }
        return ord;
      })
    );

    addAuditLog('ORDER_STATUS_CHANGED', `Պատվեր ID: ${orderId} -> ${nextStatus} (${note || ''})`);
  }, [currentUser, addAuditLog]);

  // Reassign order (Timeout fallback)
  const reassignOrder = useCallback((orderId: string, newSpecialistId?: string) => {
    // Pick another available specialist
    const available = Object.keys(specialistProfiles).filter(
      (sId) => sId !== newSpecialistId && specialistProfiles[sId].approvalStatus === 'approved'
    );
    const targetId = newSpecialistId || available[0] || 'user_spec_2';
    const targetUser = users.find((u) => u.id === targetId);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            specialistId: targetId,
            specialistName: targetUser?.fullName || 'Մասնագետ',
            specialistPhone: targetUser?.phone || '+37493000000',
            status: 'sent_to_specialist',
            statusHistory: [
              ...ord.statusHistory,
              {
                status: 'timeout_reassigned',
                timestamp: new Date().toISOString(),
                note: `Ավտո-վերաուղղորդում նոր մասնագետի՝ ${targetUser?.fullName}`,
              },
            ],
          };
        }
        return ord;
      })
    );

    addAuditLog('ORDER_REASSIGNED', `Պատվեր ID: ${orderId} վերաուղղորդվեց ${targetUser?.fullName}-ին`);
  }, [specialistProfiles, users, addAuditLog]);

  // Cancel order
  const cancelOrder = useCallback((orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'cancelled',
            cancellationReason: reason,
            paymentStatus: ord.paymentMethod === 'online_escrow' ? 'refunded' : 'unpaid',
            statusHistory: [
              ...ord.statusHistory,
              { status: 'cancelled', timestamp: new Date().toISOString(), note: reason },
            ],
          };
        }
        return ord;
      })
    );
    addAuditLog('ORDER_CANCELLED', `Պատվեր ID: ${orderId} չեղարկվեց. Պատճառ՝ ${reason}`);
  }, [addAuditLog]);

  // Review submission (Strictly only for closed orders)
  const submitOrderReview = useCallback((orderId: string, rating: number, comment: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'Պատվերը չի գտնվել' };

    if (targetOrder.status !== 'closed') {
      return { success: false, error: 'Կարծիք կարող եք թողնել միայն փակված և վճարված պատվերների համար' };
    }

    if (targetOrder.hasReview) {
      return { success: false, error: 'Այս պատվերի համար կարծիք արդեն թողնված է' };
    }

    // Content moderation on review text
    const mod = moderateTextContent(comment);
    if (!mod.passed) {
      return { success: false, error: mod.violations.join('; ') };
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      orderId,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      specialistId: targetOrder.specialistId || 'user_spec_1',
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate specialist rating
    if (targetOrder.specialistId) {
      setSpecialistProfiles((prev) => {
        const spec = prev[targetOrder.specialistId!];
        if (!spec) return prev;
        const specReviews = reviews.filter((r) => r.specialistId === targetOrder.specialistId);
        const newCount = specReviews.length + 1;
        const totalRating = specReviews.reduce((sum, r) => sum + r.rating, rating);
        const avg = Number((totalRating / newCount).toFixed(2));

        return {
          ...prev,
          [targetOrder.specialistId!]: {
            ...spec,
            rating: avg,
            reviewCount: newCount,
          },
        };
      });
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, hasReview: true } : o))
    );

    addAuditLog('REVIEW_SUBMITTED', `Կարծիք #${targetOrder.orderNumber} պատվերի համար (${rating} աստղ)`);
    return { success: true };
  }, [orders, reviews, addAuditLog]);

  // Specialist Schedule & Profile updates
  const updateSpecialistSchedule = useCallback((schedule: SpecialistProfile['weeklySchedule']) => {
    if (!currentUser) return;
    setSpecialistProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        weeklySchedule: schedule,
      },
    }));
    addAuditLog('SCHEDULE_UPDATED', `Թարմացվեց աշխատանքային գրաֆիկը`);
  }, [currentUser, addAuditLog]);

  const toggleSpecialistOnline = useCallback((online: boolean) => {
    if (!currentUser) return;
    setSpecialistProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        isOnline: online,
      },
    }));
  }, [currentUser]);

  const updateSpecialistBio = useCallback((bio: string) => {
    if (!currentUser) return { success: false, error: 'Գրանցված չեք' };
    const mod = moderateTextContent(bio);
    if (!mod.passed) {
      // Increase moderation strikes
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === currentUser.id) {
            const strikes = u.moderationStrikes + 1;
            if (strikes >= 3) {
              return { ...u, moderationStrikes: strikes, status: 'blocked_fraud' };
            }
            return { ...u, moderationStrikes: strikes };
          }
          return u;
        })
      );
      addAuditLog('MODERATION_STRIKE', `Արգելված կոնտակտի փորձ բիոյում (ID: ${currentUser.id})`);
      return { success: false, error: `Արգելված է անձնական հեռախոս կամ կոնտակտ նշել: Խախտում. ${mod.violations[0]}` };
    }

    setSpecialistProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        bio,
      },
    }));
    addAuditLog('BIO_UPDATED', `Թարմացվեց մասնագետի բիոն`);
    return { success: true };
  }, [currentUser, addAuditLog]);

  const requestPayout = useCallback((amount: number) => {
    if (!currentUser) return { success: false, error: 'Գրանցված չեք' };
    const spec = specialistProfiles[currentUser.id];
    if (!spec || spec.availablePayoutBalance < amount) {
      return { success: false, error: 'Անբավարար հասանելի մնացորդ' };
    }

    setSpecialistProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        availablePayoutBalance: prev[currentUser.id].availablePayoutBalance - amount,
      },
    }));

    addAuditLog('PAYOUT_REQUESTED', `Վճարման հարցում ${amount.toLocaleString()} ֏ (${currentUser.fullName})`);
    return { success: true };
  }, [currentUser, specialistProfiles, addAuditLog]);

  const payCashDebt = useCallback((amount: number) => {
    if (!currentUser) return;
    setSpecialistProfiles((prev) => {
      const spec = prev[currentUser.id];
      if (!spec) return prev;
      return {
        ...prev,
        [currentUser.id]: {
          ...spec,
          cashCommissionDebt: Math.max(0, spec.cashCommissionDebt - amount),
        },
      };
    });
    addAuditLog('COMMISSION_DEBT_PAID', `Մարվեց կանխիկ կոմիսիայի պարտք ${amount.toLocaleString()} ֏`);
  }, [currentUser, addAuditLog]);

  // Admin Actions
  const setGlobalCommissionRate = useCallback((rate: number) => {
    setSettings((prev) => ({ ...prev, globalCommissionRate: rate }));
    addAuditLog('GLOBAL_COMMISSION_SET', `Գլոբալ կոմիսիան սահմանվեց ${(rate * 100).toFixed(0)}%`);
  }, [addAuditLog]);

  const setSpecialistCommissionOverride = useCallback((specialistId: string, override?: number) => {
    setSpecialistProfiles((prev) => ({
      ...prev,
      [specialistId]: {
        ...prev[specialistId],
        commissionOverride: override,
      },
    }));
    addAuditLog('SPEC_COMMISSION_OVERRIDE', `Մասնագետի կոմիսիան override: ${override ? override + '%' : 'Default'}`);
  }, [addAuditLog]);

  const approveSpecialist = useCallback((specialistId: string, note?: string) => {
    setSpecialistProfiles((prev) => ({
      ...prev,
      [specialistId]: {
        ...prev[specialistId],
        approvalStatus: 'approved',
        idVerified: true,
        approvalNote: note,
      },
    }));
    addAuditLog('SPECIALIST_APPROVED', `Հաստատվեց մասնագետը ID: ${specialistId}`);
  }, [addAuditLog]);

  const rejectSpecialist = useCallback((specialistId: string, note?: string) => {
    setSpecialistProfiles((prev) => ({
      ...prev,
      [specialistId]: {
        ...prev[specialistId],
        approvalStatus: 'rejected',
        approvalNote: note,
      },
    }));
    addAuditLog('SPECIALIST_REJECTED', `Մերժվեց մասնագետը ID: ${specialistId}. Պատճառ՝ ${note}`);
  }, [addAuditLog]);

  const toggleUserSuspension = useCallback((userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended_admin' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    addAuditLog('USER_STATUS_TOGGLED', `Օգտատիրոջ կարգավիճակը փոխվեց ID: ${userId} (${reason || ''})`);
  }, [addAuditLog]);

  const resolveOverlapAccount = useCallback((userId: string, allow: boolean) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: allow ? 'active' : 'suspended_admin' };
        }
        return u;
      })
    );
    addAuditLog('OVERLAP_RESOLVED', `Տվյալների համընկնման հարցը լուծվեց ID: ${userId} -> ${allow ? 'Թույլատրված' : 'Արգելափակված'}`);
  }, [addAuditLog]);

  const resolveReport = useCallback((reportId: string, actionNote: string, suspendTarget?: boolean) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved', resolutionNote: actionNote } : r))
    );
    const rep = reports.find((r) => r.id === reportId);
    if (rep && suspendTarget) {
      setUsers((prev) =>
        prev.map((u) => (u.id === rep.targetUserId ? { ...u, status: 'blocked_fraud' } : u))
      );
    }
    addAuditLog('REPORT_RESOLVED', `Լուծվեց բողոք #${reportId}: ${actionNote}`);
  }, [reports, addAuditLog]);

  const updatePlatformColors = useCallback((colors: PlatformSettings['colors']) => {
    setSettings((prev) => ({ ...prev, colors }));
    addAuditLog('COLORS_UPDATED', `Թարմացվեցին բրենդային գույները`);
  }, [addAuditLog]);

  // Order Chat with anti-bypass moderation
  const sendChatMessage = useCallback((orderId: string, text: string) => {
    if (!currentUser) return { success: false, error: 'Մուտք գործեք' };

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return { success: false, error: 'Պատվերը չի գտնվել' };

    if (targetOrder.status === 'closed' || targetOrder.status === 'cancelled') {
      return { success: false, error: 'Պատվերը փակված է: Չաթը ավտոմատ արգելափակված է անվտանգության նկատառումներով:' };
    }

    // Content moderation check
    const mod = moderateTextContent(text);
    if (!mod.passed) {
      // Strike the user
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === currentUser.id) {
            const strikes = u.moderationStrikes + 1;
            return {
              ...u,
              moderationStrikes: strikes,
              status: strikes >= 3 ? 'blocked_fraud' : u.status,
            };
          }
          return u;
        })
      );
      addAuditLog('CHAT_BYPASS_ATTEMPT', `Չաթում կոնտակտի փորձ ID: ${currentUser.id}`);
      return {
        success: false,
        error: `Հաղորդագրությունն արգելափակվեց: Չաթում չի թույլատրվում գրել անձնական հեռախոսահամար կամ հղումներ: (${mod.violations[0]})`,
      };
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setChatMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newMsg],
    }));

    return { success: true };
  }, [currentUser, orders, addAuditLog]);

  const submitReport = useCallback((reportData: {
    targetUserId: string;
    orderId?: string;
    reason: string;
    details: string;
  }) => {
    if (!currentUser) return { success: false, error: 'Մուտք գործեք' };

    const targetUser = users.find((u) => u.id === reportData.targetUserId);

    const newRep: ReportFlag = {
      id: `rep_${Date.now()}`,
      reportedByUserId: currentUser.id,
      reportedByName: currentUser.fullName,
      reportedByRole: currentUser.role,
      targetUserId: reportData.targetUserId,
      targetUserName: targetUser?.fullName || 'Օգտատեր',
      targetUserRole: targetUser?.role || 'specialist',
      orderId: reportData.orderId,
      reason: reportData.reason,
      details: reportData.details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newRep, ...prev]);
    addAuditLog('REPORT_FILED', `Նոր բողոք ${currentUser.fullName}-ից ընդդեմ ${targetUser?.fullName}`);
    return { success: true };
  }, [currentUser, users, addAuditLog]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        isLoggedIn: !!currentUser,
        users,
        specialistProfiles,
        categories,
        orders,
        reviews,
        reports,
        deviceSessions,
        chatMessages,
        notifications,
        auditLogs,
        settings,
        securityAlert,
        pwaInstallPrompt,
        language,
        setLanguage,
        t,
        switchUser,
        logout,
        registerUser,
        verifyPhoneOTP,
        verifyEmailCode,
        enableTwoFactor,
        dismissSecurityAlert,
        saveCategory,
        deleteCategory,
        saveService,
        deleteService,
        createOrder,
        updateOrderStatus,
        reassignOrder,
        cancelOrder,
        submitOrderReview,
        updateSpecialistSchedule,
        toggleSpecialistOnline,
        updateSpecialistBio,
        requestPayout,
        payCashDebt,
        setGlobalCommissionRate,
        setSpecialistCommissionOverride,
        approveSpecialist,
        rejectSpecialist,
        toggleUserSuspension,
        resolveOverlapAccount,
        resolveReport,
        updatePlatformColors,
        sendChatMessage,
        submitReport,
        markNotificationAsRead,
        triggerPushNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
