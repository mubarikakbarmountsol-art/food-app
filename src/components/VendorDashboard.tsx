import React from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import Chart from './Chart';
import RecentOrders from './RecentOrders';

export default function VendorDashboard() {
  const vendorStats = [
    { title: 'Total Products', value: 45, icon: Package, color: 'blue' as const },
    { title: 'Total Orders', value: 128, icon: ShoppingCart, color: 'green' as const },
    { title: 'Revenue', value: 5420, icon: DollarSign, color: 'purple' as const, trend: 'USD' },
    { title: 'Growth', value: 12, icon: TrendingUp, color: 'orange' as const, trend: '+12% this month' },
  ];

  const orderStats = [
    { title: 'Pending Orders', value: 8, icon: Clock, color: 'orange' as const },
    { title: 'Completed Today', value: 15, icon: CheckCircle, color: 'green' as const },
  ];

  const salesData = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 150 },
    { label: 'Wed', value: 180 },
    { label: 'Thu', value: 140 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 250 },
    { label: 'Sun', value: 180 },
  ];

  const revenueData = [
    { label: 'Week 1', value: 1200 },
    { label: 'Week 2', value: 1500 },
    { label: 'Week 3', value: 1800 },
    { label: 'Week 4', value: 2100 },
  ];

  const recentOrders = [
    { id: '100164', customer: 'John Smith', status: 'processing' as const, time: '2 mins ago', amount: 'USD 45' },
    { id: '100163', customer: 'Sarah Johnson', status: 'confirmed' as const, time: '5 mins ago', amount: 'USD 32' },
    { id: '100162', customer: 'Mike Brown', status: 'delivered' as const, time: '10 mins ago', amount: 'USD 78' },
    { id: '100161', customer: 'Emily Davis', status: 'pending' as const, time: '15 mins ago', amount: 'USD 55' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome to Vendor Dashboard! 🏪</h1>
        <p className="text-blue-100">Manage your restaurant, track orders, and grow your business</p>
      </div>

      {/* Main Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">Business Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {vendorStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {orderStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Chart title="Daily Sales" data={salesData} type="line" color="rgb(59, 130, 246)" />
        <Chart title="Weekly Revenue" data={revenueData} type="bar" color="rgb(16, 185, 129)" />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Add New Product
            </button>
            <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
              View All Orders
            </button>
            <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors">
              Create Promotion
            </button>
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Update Menu
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">4.8</div>
            <div className="text-sm text-green-700">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <div className="text-sm text-blue-700">Order Completion</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">25 min</div>
            <div className="text-sm text-purple-700">Avg Preparation Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}