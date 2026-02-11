import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supportApi } from '../../api/support';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { TEXTS, TICKET_STATUSES, TICKET_PRIORITIES } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

export const Tickets: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => supportApi.getAll(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{TEXTS.myTickets}</h1>
        <Link to="/support/create">
          <Button>{TEXTS.createTicket}</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : data?.results && data.results.length > 0 ? (
        <div className="space-y-4">
          {data.results.map((ticket) => (
            <Card key={ticket.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {ticket.ticket_number}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={TICKET_STATUSES[ticket.status].color}>
                    {TICKET_STATUSES[ticket.status].label}
                  </Badge>
                  <Badge className={TICKET_PRIORITIES[ticket.priority].color}>
                    {TICKET_PRIORITIES[ticket.priority].label}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {ticket.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Категория: {ticket.category}</span>
                <span>Создан: {formatDateTime(ticket.created_at)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">{TEXTS.noResults}</p>
          <Link to="/support/create">
            <Button>{TEXTS.createTicket}</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Tickets;