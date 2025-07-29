import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter, Download, User, Phone, Mail, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface Deliveryman {
  id: string;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  totalOrders: number;
  ongoing: number;
  cancelled: number;
  completed: number;
  payedAmount: number;
  pendingAmount: number;
  status: 'active' | 'inactive';
  avatar?: string;
}

const deliverymen: Deliveryman[] = [
  {
    id: '1',
    name: 'Dim Tim',
    email: 'd*********@gmail.com',
    phone: '+8***********',
    joiningDate: '07 Nov 2023, 05:57 PM',
    totalOrders: 6,
    ongoing: 4,
    cancelled: 0,
    completed: 2,
    payedAmount: 750.00,
    pendingAmount: 182.00,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Will Smith',
    email: 'd*********@demo.com',
    phone: '+8***********',
    joiningDate: '04 Jan 2023, 12:00 PM',
    totalOrders: 16,
    ongoing: 8,
    cancelled: 0,
    completed: 8,
    payedAmount: 20500.00,
    pendingAmount: 4931.22,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Marco Rossi',
    email: 'd*********@demo.com',
    phone: '+1***********',
    joiningDate: '25 Oct 2022, 04:59 PM',
    totalOrders: 0,
    ongoing: 0,
    cancelled: 0,
    completed: 0,
    payedAmount: 0.00,
    pendingAmount: 0.00,
    status: 'active'
  },
  {
    id: '4',
    name: 'Ethan Walker',
    email: 'd*********@demo.com',
    phone: '+3******** 34',
    joiningDate: '13 Oct 2021, 02:15 AM',
    totalOrders: 2,
    ongoing: 0,
    cancelled: 0,
    completed: 2,
    payedAmount: 200.00,
    pendingAmount: 0.00,
    status: 'active'
  }
];

export default function DeliverymanListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredDeliverymen = deliverymen.filter(deliveryman => {
    const matchesSearch = deliveryman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliveryman.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliveryman.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || deliveryman.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalDeliverymen = deliverymen.length;
  const activeDeliverymen = deliverymen.filter(d => d.status === 'active').length;
  const inactiveDeliverymen = deliverymen.filter(d => d.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">🚚 Deliveryman List</h1>
            <p className="text-gray-600">Manage your delivery team</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliveryman Joining Date
            </label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Select Date"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliveryman Status
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalDeliverymen}</p>
              <p className="text-sm text-blue-700">Total Deliveryman</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{activeDeliverymen}</p>
              <p className="text-sm text-green-700">Active Deliveryman</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{inactiveDeliverymen}</p>
              <p className="text-sm text-red-700">Inactive Deliveryman</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-800">Deliveryman List</h3>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
              {filteredDeliverymen.length}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-80"
              />
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Search
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Deliveryman</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ongoing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payed Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeliverymen.map((deliveryman, index) => (
                <tr key={deliveryman.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {deliveryman.avatar ? (
                          <img src={deliveryman.avatar} alt={deliveryman.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{deliveryman.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{deliveryman.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{deliveryman.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deliveryman.joiningDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{deliveryman.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{deliveryman.ongoing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{deliveryman.cancelled}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{deliveryman.completed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${deliveryman.payedAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${deliveryman.pendingAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="flex items-center">
                      {deliveryman.status === 'active' ? (
                        <ToggleRight className="w-8 h-8 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
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