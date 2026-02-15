import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supportApi } from '../../api/support';
import { Spinner } from '../../components/common/Spinner';
import { formatDate } from '../../utils/formatters';
import type { SupportTicket } from '../../api/types';

const SupportTickets: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => supportApi.getAll(),
  });

  const tickets = data?.results || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'OPEN': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'OPEN': 'Открыт',
      'IN_PROGRESS': 'В работе',
      'RESOLVED': 'Решён',
      'CLOSED': 'Закрыт',
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'LOW': 'text-gray-600',
      'MEDIUM': 'text-blue-600',
      'HIGH': 'text-orange-600',
      'URGENT': 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getPriorityText = (priority: string) => {
    const texts: Record<string, string> = {
      'LOW': 'Низкий',
      'MEDIUM': 'Средний',
      'HIGH': 'Высокий',
      'URGENT': 'Срочный',
    };
    return texts[priority] || priority;
  };

  const getCategoryText = (category: string) => {
    const texts: Record<string, string> = {
      'GENERAL': 'Общий вопрос',
      'TECHNICAL': 'Техническая проблема',
      'BILLING': 'Вопрос по оплате',
      'ACCOUNT': 'Проблема с аккаунтом',
      'ORDER': 'Вопрос по заказу',
      'RESERVATION': 'Вопрос по бронированию',
    };
    return texts[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои тикеты поддержки</h1>
        <Link
          to="/support/create"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
        >
          + Создать тикет
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">💬</span>
          <p className="text-gray-500 text-lg mb-4">
            У вас пока нет тикетов поддержки
          </p>
          <Link
            to="/support/create"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Создать первый тикет
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket: SupportTicket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">
                      {ticket.subject}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Тикет #{ticket.ticket_number || ticket.id}
                  </p>
                </div>
                <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                  {getPriorityText(ticket.priority)}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {ticket.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>📁 {getCategoryText(ticket.category)}</span>
                  <span>📅 {formatDate(ticket.created_at)}</span>
                </div>
                <Link
                  to={`/support/${ticket.id}`}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Подробнее →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;