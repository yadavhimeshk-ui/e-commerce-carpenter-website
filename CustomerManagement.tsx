import { useState, useEffect } from 'react';
import { FileDown, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { exportCustomersToExcel } from '../../utils/excelExport';

interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  mobile: string | null;
  created_at: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setCustomers(data as Customer[]);
    }
  };

  const handleExport = () => {
    const filteredCustomers = searchTerm
      ? customers.filter(
          (c) =>
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.mobile?.includes(searchTerm)
        )
      : customers;
    exportCustomersToExcel(filteredCustomers);
  };

  const filteredCustomers = searchTerm
    ? customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.mobile?.includes(searchTerm)
      )
    : customers;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                    {customer.id.substring(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {customer.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {customer.email || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {customer.mobile || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'No customers match your search.' : 'No customers registered yet.'}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Total Customers: {filteredCustomers.length}</p>
      </div>
    </div>
  );
}
