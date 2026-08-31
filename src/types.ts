export type Language = 'hy' | 'ru' | 'en';

export type UserRole = 'customer' | 'specialist' | 'admin';

export type UserStatus = 'active' | 'frozen_overlap' | 'blocked_fraud' | 'suspended_admin';

export type ServiceMode = 'specialist_goes' | 'customer_brings' | 'phone_consult';

export type OrderStatus =
  | 'created'
  | 'sent_to_specialist'
  | 'confirmed'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'paid'
  | 'closed'
  | 'cancelled'
  | 'rejected'
  | 'timeout_reassigned';

export type PaymentMethod = 'cash_on_delivery' | 'online_escrow';

export type PaymentStatus = 'unpaid' | 'escrow_held' | 'paid_released' | 'refunded';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorType?: 'totp' | 'sms';
  status: UserStatus;
  moderationStrikes: number;
  activeDeviceId: string;
  lastLoginAt: string;
}

export interface SpecialistProfile {
  userId: string;
  idDocumentUrl?: string;
  idDocumentName?: string;
  idVerified: boolean;
  categories: string[]; // category IDs
  bio: string;
  workingAddress: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvalNote?: string;
  commissionOverride?: number; // e.g. 15%
  earningsGross: number;
  earningsCommissionPaid: number;
  earningsNet: number;
  cashCommissionDebt: number;
  availablePayoutBalance: number;
  payoutSchedule: 'instant' | 'weekly' | 'monthly';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  weeklySchedule: Record<number, { start: string; end: string; active: boolean }>; // 0=Sun, 1=Mon, ...
}

export interface ServiceOffering {
  id: string;
  categoryId: string;
  name: string;
  nameHy: string;
  description: string;
  basePrice: number;
  maxPrice?: number;
  calloutFee: number;
  requiresPrepayment: boolean;
  availableModes: ServiceMode[];
  commissionOverride?: number;
  estimatedDurationMin: number;
  imageUrl?: string;
  popular?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameHy: string;
  iconName: string;
  description: string;
  imageUrl?: string;
  services: ServiceOffering[];
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  specialistId?: string;
  specialistName?: string;
  specialistPhone?: string;
  specialistWorkingAddress?: string;
  categoryId: string;
  serviceId: string;
  serviceName: string;
  serviceMode: ServiceMode;
  status: OrderStatus;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  isImmediate: boolean;
  customerLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  specialistLiveLocation?: {
    lat: number;
    lng: number;
    heading?: number;
    etaMinutes?: number;
  };
  problemDescription: string;
  attachments: string[];
  basePrice: number;
  calloutFee: number;
  totalAmount: number;
  commissionRate: number; // e.g. 0.20
  commissionAmount: number;
  specialistEarnings: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cancellationReason?: string;
  statusHistory: OrderStatusHistoryItem[];
  hasReview: boolean;
  assignedSpecialistsPool?: string[];
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  specialistId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ReportFlag {
  id: string;
  reportedByUserId: string;
  reportedByName: string;
  reportedByRole: UserRole;
  targetUserId: string;
  targetUserName: string;
  targetUserRole: UserRole;
  orderId?: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNote?: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  locationName: string;
  createdAt: string;
  lastActive: string;
  isCurrent: boolean;
  status: 'active' | 'terminated_alert';
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'security' | 'moderation' | 'system';
  linkOrderId?: string;
  createdAt: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface PlatformColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
}

export interface PlatformSettings {
  globalCommissionRate: number; // e.g. 0.20
  payoutScheduleDefault: 'instant' | 'weekly' | 'monthly';
  cancellationPolicyNotice: string;
  colors: PlatformColors;
  autoReassignTimeoutMinutes: number;
}
