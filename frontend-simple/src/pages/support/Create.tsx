import { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supportApi } from '../../api/support';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { TEXTS } from '../../utils/constants';
import type { TicketPriority } from '../../api/types';
import Create from '../reservations/Create';

const CATEGORIES = [
  'Заказ',
  'Доставка',
  'Оплата',
  'Техническая проблема',
  'Жалоба',
  'Другое',
];

export const CreateTicket: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'MEDIUM' as TicketPriority,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: supportApi.create,
    onSuccess: () => {
      navigate('/support');
    },
    onError: (error: any) => {
      alert('Ошибка создания тикета: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject) {
      newErrors.subject = TEXTS.required;
    }
    if (!formData.description) {
      newErrors.description = TEXTS.required;
    }
    if (!formData.category) {
      newErrors.category = TEXTS.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{TEXTS.createTicket}</h1>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={TEXTS.ticketSubject}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              error={errors.subject}
              placeholder="Краткое описание проблемы"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Выберите категорию</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {TEXTS.ticketPriority}
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
                <option value="URGENT">Срочный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {TEXTS.ticketDescription} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Подробно опишите вашу проблему..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/support')}
              >
                {TEXTS.cancel}
              </Button>
              <Button
                type="submit"
                isLoading={createMutation.isPending}
                className="flex-1"
              >
                {TEXTS.submit}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default Create;