import * as XLSX from 'xlsx';

export function exportOrdersToExcel(orders: any[]) {
  const ws = XLSX.utils.json_to_sheet(orders.map(order => ({
    'Order ID': order.id,
    'Customer Name': order.customer_name,
    'Customer Email': order.customer_email || 'N/A',
    'Customer Mobile': order.customer_mobile || 'N/A',
    'Product Name': order.product_name,
    'Quantity': order.quantity,
    'Price': order.product_price,
    'Total Amount': order.total_amount,
    'Delivery Address': order.delivery_address,
    'Status': order.status,
    'Order Date': new Date(order.created_at).toLocaleString(),
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  XLSX.writeFile(wb, `Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportCustomersToExcel(customers: any[]) {
  const ws = XLSX.utils.json_to_sheet(customers.map(customer => ({
    'Customer ID': customer.id,
    'Name': customer.name || 'N/A',
    'Email': customer.email || 'N/A',
    'Mobile': customer.mobile || 'N/A',
    'Joined Date': new Date(customer.created_at).toLocaleString(),
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');

  XLSX.writeFile(wb, `Customers_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportSingleOrder(order: any) {
  const ws = XLSX.utils.json_to_sheet([{
    'Order ID': order.id,
    'Customer Name': order.customer_name,
    'Customer Email': order.customer_email || 'N/A',
    'Customer Mobile': order.customer_mobile || 'N/A',
    'Product Name': order.product_name,
    'Quantity': order.quantity,
    'Price': order.product_price,
    'Total Amount': order.total_amount,
    'Delivery Address': order.delivery_address,
    'Status': order.status,
    'Order Date': new Date(order.created_at).toLocaleString(),
  }]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Order');

  XLSX.writeFile(wb, `Order_${order.id.substring(0, 8)}_${new Date().toISOString().split('T')[0]}.xlsx`);
}
