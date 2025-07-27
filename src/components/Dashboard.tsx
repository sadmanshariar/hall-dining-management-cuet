import React from 'react';
import { CreditCard, Calendar, AlertCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { isTokenActive, formatDate } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  
  const activeTokens = state.tokens.filter(token => 
    token.studentId === state.currentUser?.id && isTokenActive(token)
  );
  
  const totalSpent = state.tokens
    .filter(token => token.studentId === state.currentUser?.id)
    .reduce((sum, token) => sum + token.totalCost, 0);
  
  const totalRefunds = state.cancelledDays
    .filter(day => day.studentId === state.currentUser?.id && day.status === 'approved')
    .reduce((sum, day) => sum + day.refundAmount, 0);

  const activeDiningMonth = state.diningMonths.find(dm => dm.isActive);

  if (state.userRole === 'manager') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tokens</p>
                <p className="text-3xl font-bold text-gray-900">{state.tokens.filter(t => t.isActive).length}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">৳{state.tokens.reduce((sum, t) => sum + t.totalCost, 0).toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Cancellations</p>
                <p className="text-3xl font-bold text-gray-900">{state.cancelledDays.filter(c => c.status === 'pending').length}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{state.students.length}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Dining Month */}
        {activeDiningMonth && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Active Dining Month
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Period</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(activeDiningMonth.startDate)} - {formatDate(activeDiningMonth.endDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Current Day</p>
                <p className="text-lg font-semibold text-gray-900">
                  Day {Math.min(30, Math.max(1, Math.ceil((new Date().getTime() - new Date(activeDiningMonth.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1))} of 30
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Token Purchases</h3>
            <div className="space-y-3">
              {state.tokens.slice(-5).map((token) => {
                const student = state.students.find(s => s.id === token.studentId);
                return (
                  <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-gray-600">
                        {token.duration} days • {token.mealType === 'lunch' ? 'Lunch Only' : 'Lunch + Dinner'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">৳{token.totalCost}</p>
                      <p className="text-sm text-gray-600">{formatDate(token.purchaseDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Cancellations</h3>
            <div className="space-y-3">
              {state.cancelledDays.filter(day => day.status === 'pending').map((day) => {
                const student = state.students.find(s => s.id === day.studentId);
                return (
                  <div key={day.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(day.cancelledDate)} • {day.mealType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">৳{day.refundAmount}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900">৳{state.currentUser?.balance.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-3xl font-bold text-gray-900">৳{totalRefunds.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Active Tokens
          </h3>
          
          {activeTokens.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active tokens</p>
              <p className="text-sm text-gray-500 mt-1">Purchase a token to start enjoying meals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTokens.map((token) => (
                <div key={token.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                    <span className="text-sm font-medium text-gray-900">৳{token.totalCost}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{token.duration} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Meal Type</p>
                      <p className="font-medium">
                        {token.mealType === 'lunch' ? 'Lunch Only' : 'Lunch + Dinner'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium">{formatDate(token.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(token.endDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            {state.tokens
              .filter(token => token.studentId === state.currentUser?.id)
              .slice(-3)
              .map((token) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Token Purchased</p>
                    <p className="text-sm text-gray-600">
                      {token.duration} days • {token.mealType === 'lunch' ? 'Lunch Only' : 'Lunch + Dinner'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">৳{token.totalCost}</p>
                    <p className="text-sm text-gray-600">{formatDate(token.purchaseDate)}</p>
                  </div>
                </div>
              ))}
            
            {state.cancelledDays
              .filter(day => day.studentId === state.currentUser?.id)
              .slice(-2)
              .map((day) => (
                <div key={day.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Meal Cancelled</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(day.cancelledDate)} • {day.mealType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">৳{day.refundAmount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      day.status === 'approved' ? 'bg-green-100 text-green-800' :
                      day.status === 'denied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {day.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;