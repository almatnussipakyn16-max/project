import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supportApi } from '../../api/support';
import type { CreateTicketRequest } from '../../api/types';

const SupportCreate: FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateTicketRequest>({
    subject: '',
    priority: 'MEDIUM',
    description: '',
  });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: CreateTicketRequest) => supportApi.create(data),
    onSuccess: () => {
      navigate('/support');
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || 'Ошибка создания тикета');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.subject || !formData.description) {
      setError('Заполните все обязательные поля');
      return;
    }

    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Создать тикет поддержки</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Тема */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Тема <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Кратко опишите проблему"
                required
              />
            </div>


            {/* Приоритет */}
            <div className="mb-6">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Приоритет
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
                <option value="URGENT">Срочный</option>
              </select>
            </div>

            {/* Описание */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Описание проблемы <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Подробно опишите вашу проблему или вопрос..."
                required
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Создание...' : 'Создать тикет'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportCreate;