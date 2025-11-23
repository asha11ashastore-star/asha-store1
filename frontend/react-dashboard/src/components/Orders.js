import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  IndianRupee,
  Eye,
  Truck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// HARDCODED - NO ENV VARS
const API_BASE_URL = 'https://asha-store-backend.onrender.com';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderSlip, setShowOrderSlip] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Orders response:', data);
        setOrders(data.items || data || []);
      } else {
        const errorText = await response.text();
        console.error('Orders error:', response.status, errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, paymentStatus = null) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: orderStatus })
      });

      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'pending': Clock,
      'confirmed': CheckCircle,
      'processing': Package,
      'shipped': Truck,
      'delivered': CheckCircle,
      'cancelled': AlertCircle
    };
    const IconComponent = statusIcons[status?.toLowerCase()] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'new') return order.order_status === 'pending';
    if (filter === 'processing') return order.order_status === 'processing';
    if (filter === 'shipped') return order.order_status === 'shipped';
    return true;
  });

  const OrderSlip = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order Slip</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                <p className="text-lg font-semibold">{order.order_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                <p className="text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                  {getStatusIcon(order.order_status)}
                  <span className="ml-1 capitalize">{order.order_status}</span>
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                <p className="text-lg font-semibold flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {order.total_amount?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">{order.customer_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{order.customer_email}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.customer_name}</p>
                <p className="whitespace-pre-line">{order.customer_address}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {item.total?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        @ ₹{item.price?.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {order.total_amount?.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Payment Method: {order.payment_method || 'Manual'}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className={`p-4 rounded-lg ${
                order.payment_status === 'completed' ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-medium ${
                    order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.payment_status === 'completed' ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
                {order.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    Notes: {order.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={order.order_status !== 'pending'}
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={order.order_status !== 'processing'}
                >
                  Mark as Shipped
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed', 'completed')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={order.order_status === 'completed' || order.order_status === 'cancelled'}
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-brown"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Orders</h1>
        <p className="text-gray-600">Manage all orders from your customers</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-primary-brown text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'new' 
              ? 'bg-primary-brown text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          New Orders ({orders.filter(o => o.order_status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'processing' 
              ? 'bg-primary-brown text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Processing ({orders.filter(o => o.order_status === 'processing').length})
        </button>
        <button
          onClick={() => setFilter('shipped')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'shipped' 
              ? 'bg-primary-brown text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Shipped ({orders.filter(o => o.order_status === 'shipped').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No customer orders yet. Orders will appear here after customers make purchases.'
              : `No ${filter} orders found.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        <span className="ml-1 capitalize">{order.order_status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {order.total_amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderSlip(true);
                        }}
                        className="text-primary-brown hover:text-primary-brown/80 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Slip Modal */}
      {showOrderSlip && (
        <OrderSlip
          order={selectedOrder}
          onClose={() => {
            setShowOrderSlip(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;
