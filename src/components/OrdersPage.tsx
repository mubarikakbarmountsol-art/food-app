import React, { useState } from 'react';
import { Search, Calendar, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  deliveryDate: string;
  deliveryTime: string;
  customerName: string;
  customerPhone: string;
  branch: string;
  totalAmount: string;
  paymentStatus: 'Paid' | 'Unpaid';
  orderStatus: 'Confirmed' | 'Delivered' | 'Processing' | 'Pending' | 'Cancelled' | 'Failed To Deliver' | 'Returned';
  orderType: 'Delivery' | 'Takeaway' | 'Dine In';
}

const sampleOrders: Order[] = [
  {
    id: '1',
    orderId: '100143',
    deliveryDate: '15 Jun 2025',
    deliveryTime: '12:17 PM',
    customerName: 'Diego Ramirez',
    customerPhone: '**********',
    branch: 'Main Branch',
    totalAmount: '1,383.80$',
    paymentStatus: 'Unpaid',
    orderStatus: 'Confirmed',
    orderType: 'Delivery'
  },
  {
    id: '2',
    orderId: '100142',
    deliveryDate: '15 Jun 2025',
    deliveryTime: '12:41 PM',
    customerName: 'Sophia Nguyen',
    customerPhone: '+8**********',
    branch: 'Main Branch',
    totalAmount: '1,257.90$',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    orderType: 'Delivery'
  },
  {
    id: '3',
    orderId: '100141',
    deliveryDate: '15 Jun 2025',
    deliveryTime: '12:38 PM',
    customerName: 'Sophia Nguyen',
    customerPhone: '+8**********',
    branch: 'Main Branch',
    totalAmount: '634.20$',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    orderType: 'Delivery'
  }
];

const statusColors = {
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Processing': 'bg-yellow-100 text-yellow-800',
  'Pending': 'bg-orange-100 text-orange-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Failed To Deliver': 'bg-red-100 text-red-800',
  'Returned': 'bg-gray-100 text-gray-800'
};

const paymentStatusColors = {
  'Paid': 'bg-green-100 text-green-800',
  'Unpaid': 'bg-red-100 text-red-800'
};

interface OrdersPageProps {
  orderType: string;
}

export default function OrdersPage({ orderType }: OrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branch');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getOrderCount = (status: string) => {
    const counts: { [key: string]: number } = {
      'all-orders': 114,
      'pending-orders': 39,
      'confirmed-orders': 20,
      'processing-orders': 6,
      'out-for-delivery-orders': 7,
      'delivered-orders': 30,
      'returned-orders': 2,
      'failed-to-deliver-orders': 2,
      'cancelled-orders': 3,
      'scheduled-orders': 0
    };
    return counts[status] || 0;
  };

  const getPageTitle = (orderType: string) => {
    const titles: { [key: string]: string } = {
      'all-orders': 'All Orders',
      'pending-orders': 'Pending Orders',
      'confirmed-orders': 'Confirmed Orders',
      'processing-orders': 'Processing Orders',
      'out-for-delivery-orders': 'Out For Delivery Orders',
      'delivered-orders': 'Delivered Orders',
      'returned-orders': 'Returned Orders',
      'failed-to-deliver-orders': 'Failed To Deliver Orders',
      'cancelled-orders': 'Cancelled Orders',
      'scheduled-orders': 'Scheduled Orders'
    };
    return titles[orderType] || 'Orders';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-800">
              📋 {getPageTitle(orderType)}
            </h1>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
              {getOrderCount(orderType)}
            </span>
          </div>
          <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Select date range</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Branch
              </label>
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option>All Branch</option>
                <option>Main Branch</option>
                <option>Secondary Branch</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="dd/mm/yyyy"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="dd/mm/yyyy"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Clear
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Show Data
              </button>
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">39</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-800">20</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-800">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🚚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Out For Delivery</p>
                <p className="text-2xl font-bold text-gray-800">7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-800">30</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">❌</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600">↩️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Returned</p>
                <p className="text-2xl font-bold text-gray-800">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed To Deliver</p>
                <p className="text-2xl font-bold text-gray-800">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Order ID, Order Status or Transaction Reference"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{order.deliveryDate}</div>
                      <div className="text-gray-500">{order.deliveryTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-gray-500">{order.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.totalAmount}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}