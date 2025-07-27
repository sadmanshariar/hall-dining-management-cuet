export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  hallId: string;
  registrationNumber: string;
  balance: number;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  password: string;
  hallId: string;
}

export interface DiningMonth {
  id: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Token {
  id: string;
  studentId: string;
  duration: 5 | 7 | 15 | 30;
  mealType: 'lunch' | 'lunch_dinner';
  startDate: string;
  endDate: string;
  totalCost: number;
  isActive: boolean;
  purchaseDate: string;
  diningMonthId: string;
}

export interface CancelledDay {
  id: string;
  studentId: string;
  tokenId: string;
  cancelledDate: string;
  mealType: 'lunch' | 'dinner' | 'both';
  refundAmount: number;
  requestDate: string;
  status: 'approved' | 'denied' | 'pending';
  approvedBy?: string;
  approvedAt?: string;
}

export interface MealPricing {
  lunchOnly: number;
  lunchDinner: number;
  special15Day: number;
  special30Day: number;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket' | 'card';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface DashboardStats {
  totalActiveTokens: number;
  totalRevenue: number;
  totalRefunds: number;
  dailyMealCount: number;
  totalStudents: number;
  pendingCancellations: number;
}