'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetPaymentsQuery } from '@/lib/store/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function PaymentsPage() {
  const { data, isLoading } = useGetPaymentsQuery(undefined);
  const payments = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      SUCCEEDED: 'success',
      PENDING: 'warning',
      FAILED: 'destructive',
      REFUNDED: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments Management</h1>
        <p className="text-gray-600 mt-1">View and manage all transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading payments...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.orderId.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paymentMethod || 'Card'}</TableCell>
                    <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
