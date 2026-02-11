// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// Валидация телефона
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Валидация обязательного поля
export const isRequired = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

// Валидация минимальной длины
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Валидация максимальной длины
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};
