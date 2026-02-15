// Тексты приложения (Русский язык)
export const TEXTS = {
  // Навигация
  home: 'Главная',
  restaurants: 'Рестораны',
  orders: 'Заказы',
  reservations: 'Бронирования',
  profile: 'Профиль',
  cart: 'Корзина',
  support: 'Поддержка',
  
  // Auth
  login: 'Войти',
  register: 'Регистрация',
  logout: 'Выйти',
  email: 'Email',
  password: 'Пароль',
  firstName: 'Имя',
  lastName: 'Фамилия',
  phone: 'Телефон',
  
  // Заказ
  addToCart: 'Добавить в корзину',
  checkout: 'Оформить заказ',
  placeOrder: 'Подтвердить заказ',
  orderNumber: 'Номер заказа',
  myOrders: 'Мои заказы',
  orderDetails: 'Детали заказа',
  
  // Статусы заказов
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждён',
  PREPARING: 'Готовится',
  READY: 'Готов',
  OUT_FOR_DELIVERY: 'В пути',
  DELIVERED: 'Доставлен',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
  
  // Типы заказов
  DELIVERY: 'Доставка',
  TAKEOUT: 'Самовывоз',
  DINE_IN: 'В ресторане',
  
  // Общее
  search: 'Поиск',
  filter: 'Фильтр',
  sort: 'Сортировка',
  apply: 'Применить',
  cancel: 'Отмена',
  save: 'Сохранить',
  delete: 'Удалить',
  edit: 'Редактировать',
  loading: 'Загрузка...',
  noResults: 'Ничего не найдено',
  
  // Корзина
  emptyCart: 'Корзина пуста',
  subtotal: 'Подытог',
  delivery: 'Доставка',
  tax: 'Налог',
  discount: 'Скидка',
  total: 'Итого',
  promoCode: 'Промокод',
  applyPromo: 'Применить промокод',
  
  // Ресторан
  viewMenu: 'Посмотреть меню',
  rating: 'Рейтинг',
  reviews: 'отзывов',
  deliveryAvailable: 'Доставка доступна',
  takeoutAvailable: 'Самовывоз доступен',
  reservationAvailable: 'Бронирование доступно',
  
  // Бронирование
  makeReservation: 'Забронировать столик',
  reservationDate: 'Дата',
  reservationTime: 'Время',
  guestCount: 'Количество гостей',
  specialRequests: 'Особые пожелания',
  
  // Ошибки
  required: 'Обязательное поле',
  invalidEmail: 'Неверный email',
  minLength: 'Минимум {n} символов',
  error: 'Ошибка',
  success: 'Успешно',
  somethingWentWrong: 'Что-то пошло не так',
  
  // Кнопки
  submit: 'Отправить',
  close: 'Закрыть',
  back: 'Назад',
  next: 'Далее',
  confirm: 'Подтвердить',
  
  // Поддержка
  createTicket: 'Создать тикет',
  myTickets: 'Мои тикеты',
  ticketSubject: 'Тема',
  ticketDescription: 'Описание',
  ticketStatus: 'Статус',
  ticketPriority: 'Приоритет',
};

// Статусы заказов
export const ORDER_STATUSES = {
  PENDING: { label: TEXTS.PENDING, color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: TEXTS.CONFIRMED, color: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: TEXTS.PREPARING, color: 'bg-purple-100 text-purple-800' },
  READY: { label: TEXTS.READY, color: 'bg-green-100 text-green-800' },
  OUT_FOR_DELIVERY: { label: TEXTS.OUT_FOR_DELIVERY, color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: TEXTS.DELIVERED, color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: TEXTS.COMPLETED, color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: TEXTS.CANCELLED, color: 'bg-red-100 text-red-800' },
} as const;

// Приоритеты тикетов
export const TICKET_PRIORITIES = {
  LOW: { label: 'Низкий', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Средний', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'Высокий', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Срочный', color: 'bg-red-100 text-red-800' },
} as const;

// Статусы тикетов
export const TICKET_STATUSES = {
  OPEN: { label: 'Открыт', color: 'bg-green-100 text-green-800' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-blue-100 text-blue-800' },
  RESOLVED: { label: 'Решён', color: 'bg-purple-100 text-purple-800' },
  CLOSED: { label: 'Закрыт', color: 'bg-gray-100 text-gray-800' },
} as const;

// Методы оплаты
export const PAYMENT_METHODS = {
  CARD: 'Карта',
  CASH: 'Наличные',
  WALLET: 'Электронный кошелёк',
} as const;

// Категории кухни
export const CUISINE_TYPES = [
  'Казахская',
  'Русская',
  'Итальянская',
  'Японская',
  'Китайская',
  'Американская',
  'Фастфуд',
  'Европейская',
  'Азиатская',
  'Средиземноморская',
  'Вегетарианская',
  'Другая',
];
