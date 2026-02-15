// Форматирование цены
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} ₸`;
};

// Форматирование даты
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-KZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Форматирование даты и времени
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-KZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Форматирование времени
export const formatTime = (timeString: string): string => {
  return timeString.slice(0, 5); // "HH:MM"
};

// Форматирование телефона
export const formatPhone = (phone: string): string => {
  // Простое форматирование для казахстанских номеров
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
};

// Сокращение текста
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Получить инициалы
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// ✅ ДОБАВИЛ: Безопасное форматирование рейтинга
export const formatRating = (rating: string | number | undefined | null): string => {
  if (rating === undefined || rating === null || rating === '') return '0.0';
  
  const numRating = typeof rating === 'number' 
    ? rating 
    : parseFloat(String(rating));
  
  return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
};