import { FC, useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TEXTS } from '../../utils/constants';
import { isValidEmail, isValidPassword } from '../../utils/validators';

export const Register: FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = TEXTS.required;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = TEXTS.invalidEmail;
    }

    if (!formData.password) {
      newErrors.password = TEXTS.required;
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Минимум 8 символов';
    }

    if (!formData.first_name) {
      newErrors.first_name = TEXTS.required;
    }

    if (!formData.last_name) {
      newErrors.last_name = TEXTS.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ ...formData, role: 'CUSTOMER' });
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        setError(
          errorData.email?.[0] ||
          errorData.password?.[0] ||
          'Ошибка регистрации. Проверьте данные.'
        );
      } else {
        setError('Ошибка регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{TEXTS.register}</h1>
          <p className="text-gray-600">Создайте новый аккаунт</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label={TEXTS.firstName}
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              error={errors.first_name}
              required
            />

            <Input
              label={TEXTS.lastName}
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              error={errors.last_name}
              required
            />

            <Input
              label={TEXTS.email}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label={TEXTS.phone}
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              helperText="Не обязательно"
            />

            <Input
              label={TEXTS.password}
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              helperText="Минимум 8 символов"
              required
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              {TEXTS.register}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                {TEXTS.login}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
