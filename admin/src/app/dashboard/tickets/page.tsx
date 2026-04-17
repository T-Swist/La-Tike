'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetTicketsQuery } from '@/lib/store/api';
import { formatDateTime } from '@/lib/utils';

export default function TicketsPage() {
  const { data, isLoading } = useGetTicketsQuery(undefined);
  const tickets = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      VALID: 'success',
      USED: 'default',
      CANCELLED: 'destructive',
      REFUNDED: 'warning',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tickets Management</h1>
        <p className="text-gray-600 mt-1">View and manage all tickets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading tickets...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scanned</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets?.map((ticket: any) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-sm">
                      {ticket.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{ticket.event?.title}</TableCell>
                    <TableCell>{ticket.holderEmail || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.scannedAt ? formatDateTime(ticket.scannedAt) : 'Not scanned'}
                    </TableCell>
                    <TableCell>{formatDateTime(ticket.createdAt)}</TableCell>
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
