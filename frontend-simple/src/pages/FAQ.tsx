import { FC, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Как забронировать столик?',
    answer: 'Перейдите в раздел "Бронирования", выберите ресторан, дату, время и количество гостей. После подтверждения вы получите уведомление на email.',
  },
  {
    question: 'Можно ли отменить бронирование?',
    answer: 'Да, вы можете отменить бронирование в разделе "Мои бронирования" до 2 часов до времени брони.',
  },
  {
    question: 'Как оформить заказ с доставкой?',
    answer: 'Выберите ресторан, добавьте блюда в корзину, укажите адрес доставки и оформите заказ. Оплата при получении или онлайн.',
  },
  {
    question: 'Есть ли минимальная сумма заказа?',
    answer: 'Минимальная сумма зак��за зависит от ресторана, обычно от 2000 ₸. Уточняйте в описании ресторана.',
  },
  {
    question: 'Как применить промокод?',
    answer: 'При оформлении заказа введите промокод в специальное поле. Скидка применится автоматически.',
  },
  {
    question: 'Как связаться с техподдержкой?',
    answer: 'Перейдите в раздел "Поддержка" и создайте тикет. Мы ответим в течение 24 часов.',
  },
  {
    question: 'Безопасна ли оплата онлайн?',
    answer: 'Да, мы используем защищённое соединение и не храним данные вашей карты. Все платежи проходят через безопасный шлюз.',
  },
  {
    question: 'Можно ли изменить заказ после оформления?',
    answer: 'Свяжитесь с рестораном по телефону в течение 5 минут после оформления. Номер указан в деталях заказа.',
  },
];

const FAQ: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4">
          Частые вопросы
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Ответы на самые популярные вопросы о нашем сервисе
        </p>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg pr-8">
                  {item.question}
                </span>
                <span className="text-2xl text-orange-500 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Контакты поддержки */}
        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Не нашли ответ?</h3>
          <p className="text-gray-700 mb-4">
            Свяжитесь с нашей службой поддержки
          </p>
          <a
            href="/support/create"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Создать тикет
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;