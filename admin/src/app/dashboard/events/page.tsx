'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetEventsQuery } from '@/lib/store/api';
import { formatDate } from '@/lib/utils';

export default function EventsPage() {
  const { data, isLoading } = useGetEventsQuery({});
  const events = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      PUBLISHED: 'success',
      DRAFT: 'warning',
      CANCELLED: 'destructive',
      COMPLETED: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events Management</h1>
        <p className="text-gray-600 mt-1">Manage all events on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.host?.firstName} {event.host?.lastName}</TableCell>
                    <TableCell>{formatDate(event.startDate)}</TableCell>
                    <TableCell>{event.city || event.location}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.ticketTypes?.reduce((sum: number, tt: any) => sum + tt.sold, 0) || 0}</TableCell>
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
