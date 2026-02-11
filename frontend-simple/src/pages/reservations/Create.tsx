import { FC, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { restaurantsApi } from '../../api/restaurants';
import { reservationsApi } from '../../api/reservations';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { TEXTS } from '../../utils/constants';

export const CreateReservation: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurant: '',
    reservation_date: '',
    reservation_time: '',
    guest_count: 2,
    special_requests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: restaurantsData } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getAll({ page_size: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: reservationsApi.create,
    onSuccess: () => {
      navigate('/reservations');
    },
    onError: (error: any) => {
      alert('Ошибка создания брони: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.restaurant) {
      newErrors.restaurant = TEXTS.required;
    }
    if (!formData.reservation_date) {
      newErrors.reservation_date = TEXTS.required;
    }
    if (!formData.reservation_time) {
      newErrors.reservation_time = TEXTS.required;
    }
    if (formData.guest_count < 1) {
      newErrors.guest_count = 'Минимум 1 гость';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createMutation.mutate({
      restaurant: Number(formData.restaurant),
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      guest_count: formData.guest_count,
      special_requests: formData.special_requests,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{TEXTS.makeReservation}</h1>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ресторан <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.restaurant}
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Выберите ресторан</option>
                {restaurantsData?.results
                  .filter(r => r.reservation_available)
                  .map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
              </select>
              {errors.restaurant && (
                <p className="mt-1 text-sm text-red-500">{errors.restaurant}</p>
              )}
            </div>

            <Input
              label={TEXTS.reservationDate}
              type="date"
              value={formData.reservation_date}
              onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
              error={errors.reservation_date}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            <Input
              label={TEXTS.reservationTime}
              type="time"
              value={formData.reservation_time}
              onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
              error={errors.reservation_time}
              required
            />

            <Input
              label={TEXTS.guestCount}
              type="number"
              value={formData.guest_count}
              onChange={(e) => setFormData({ ...formData, guest_count: Number(e.target.value) })}
              error={errors.guest_count}
              min={1}
              max={20}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {TEXTS.specialRequests}
              </label>
              <textarea
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Особые пожелания (опционально)"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/reservations')}
              >
                {TEXTS.cancel}
              </Button>
              <Button
                type="submit"
                isLoading={createMutation.isPending}
                className="flex-1"
              >
                {TEXTS.confirm}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
