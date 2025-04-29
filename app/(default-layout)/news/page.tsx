"use client";

const newsData = [
  {
    title: "Распорядок дня",
    date: "2025-04-26",
    content:
      "Воскресенье: Прайм начинаем с 18:10. Фесаникс. Основной Прайм ПВП, Прайм может быть долгий бутылки чтобы пописять, с собой берём Забираем утро",
  },
  {
    title: "Важное объявление",
    date: "2025-04-20",
    content: "Поднимите ваш ебаный онлайн",
  },
  {
    title: "Выходные",
    date: "2025-04-24",
    content:
      "С 1 по 5 мая будут выходные от праймов. Вытащите онлайн свой на последние праймы перед чилом. Не превращайте то что на праймы ходят половина не от нашего состава. Нет желания рлить на прайме людьми которые хер пойми как реализуют команды.",
  },
];

export default function NewsPage() {
  return (
    <div className="flex min-h-screen bg-bgMain text-onBackground">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Новости</h1>
        <div className="space-y-6">
          {newsData.map((newsItem, index) => (
            <div
              key={index}
              className="bg-surface p-6 rounded-xl shadow-md hover:bg-primaryVariant/50 transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-primary mb-4">
                {newsItem.title}
              </h2>
              <p className="text-onSurface text-sm mb-2">{newsItem.date}</p>
              <p className="text-onSurface">{newsItem.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
