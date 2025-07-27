import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Student, Manager, Token, CancelledDay, DashboardStats, DiningMonth, PaymentTransaction } from '../types';

interface AppState {
  currentUser: Student | null;
  currentManager: Manager | null;
  userRole: 'student' | 'manager' | null;
  isAuthenticated: boolean;
  students: Student[];
  managers: Manager[];
  tokens: Token[];
  cancelledDays: CancelledDay[];
  diningMonths: DiningMonth[];
  paymentTransactions: PaymentTransaction[];
  dashboardStats: DashboardStats;
}

type AppAction =
  | { type: 'LOGIN_STUDENT'; payload: Student }
  | { type: 'LOGIN_MANAGER'; payload: Manager }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TOKEN'; payload: Token }
  | { type: 'ADD_DINING_MONTH'; payload: DiningMonth }
  | { type: 'ADD_CANCELLED_DAY'; payload: CancelledDay }
  | { type: 'ADD_PAYMENT_TRANSACTION'; payload: PaymentTransaction }
  | { type: 'UPDATE_STUDENT_BALANCE'; payload: { studentId: string; amount: number } }
  | { type: 'UPDATE_CANCELLED_DAY_STATUS'; payload: { id: string; status: 'approved' | 'denied'; approvedBy: string } }
  | { type: 'UPDATE_DASHBOARD_STATS'; payload: Partial<DashboardStats> };

const initialState: AppState = {
  currentUser: null,
  currentManager: null,
  userRole: null,
  isAuthenticated: false,
  students: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      password: 'student123',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-001',
      balance: 5000
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      password: 'student456',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-002',
      balance: 3500
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      password: 'student789',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-003',
      balance: 2800
    }
  ],
  managers: [
    {
      id: 'mgr-1',
      name: 'Sarah Wilson',
      email: 'manager@university.edu',
      password: 'manager123',
      hallId: 'HALL-001'
    }
  ],
  tokens: [],
  cancelledDays: [],
  diningMonths: [
    {
      id: 'dm-1',
      startDate: '2025-01-01',
      endDate: '2025-01-30',
      isActive: true,
      createdBy: 'mgr-1',
      createdAt: '2024-12-25T00:00:00Z'
    }
  ],
  paymentTransactions: [],
  dashboardStats: {
    totalActiveTokens: 0,
    totalRevenue: 0,
    totalRefunds: 0,
    dailyMealCount: 0,
    totalStudents: 3,
    pendingCancellations: 0
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN_STUDENT':
      return {
        ...state,
        currentUser: action.payload,
        currentManager: null,
        userRole: 'student',
        isAuthenticated: true
      };
    
    case 'LOGIN_MANAGER':
      return {
        ...state,
        currentUser: null,
        currentManager: action.payload,
        userRole: 'manager',
        isAuthenticated: true
      };
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        currentManager: null,
        userRole: null,
        isAuthenticated: false
      };
    
    case 'ADD_TOKEN':
      return {
        ...state,
        tokens: [...state.tokens, action.payload]
      };
    
    case 'ADD_DINING_MONTH':
      return {
        ...state,
        diningMonths: state.diningMonths.map(dm => ({ ...dm, isActive: false })),
        diningMonths: [...state.diningMonths.map(dm => ({ ...dm, isActive: false })), action.payload]
      };
    
    case 'ADD_CANCELLED_DAY':
      return {
        ...state,
        cancelledDays: [...state.cancelledDays, action.payload]
      };
    
    case 'ADD_PAYMENT_TRANSACTION':
      return {
        ...state,
        paymentTransactions: [...state.paymentTransactions, action.payload]
      };
    
    case 'UPDATE_STUDENT_BALANCE':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.studentId
            ? { ...student, balance: student.balance + action.payload.amount }
            : student
        ),
        currentUser: state.currentUser?.id === action.payload.studentId
          ? { ...state.currentUser, balance: state.currentUser.balance + action.payload.amount }
          : state.currentUser
      };
    
    case 'UPDATE_CANCELLED_DAY_STATUS':
      return {
        ...state,
        cancelledDays: state.cancelledDays.map(day =>
          day.id === action.payload.id
            ? { 
                ...day, 
                status: action.payload.status,
                approvedBy: action.payload.approvedBy,
                approvedAt: new Date().toISOString()
              }
            : day
        )
      };
    
    case 'UPDATE_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: { ...state.dashboardStats, ...action.payload }
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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