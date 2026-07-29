import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-primary mt-8 mb-3">{children}</h2>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold mt-4 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed">{children}</p>;
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5 pl-1">{children}</ul>;
}

function Item({ children }: { children: React.ReactNode }) {
  return <li className="text-sm leading-relaxed">{children}</li>;
}

function CriteriaRow({
  label,
  value,
  enabled,
}: {
  label: string;
  value?: string;
  enabled: boolean;
}) {
  return (
    <tr>
      <td className="p-2 border">{label}</td>
      <td className="p-2 border text-center whitespace-nowrap">
        {value ?? "—"}
      </td>
      <td className="p-2 border text-center">
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "Включено" : "Выключено"}
        </Badge>
      </td>
    </tr>
  );
}

function EligibilityCriteriaTable({
  settings,
}: {
  settings: SalaryEligibilitySettings;
}) {
  return (
    <Card className="lg:sticky lg:top-4 h-fit">
      <CardHeader>
        <CardTitle className="text-base">Действующие критерии допуска</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border text-left">Критерий</th>
              <th className="p-2 border">Порог</th>
              <th className="p-2 border">Статус</th>
            </tr>
          </thead>
          <tbody>
            <CriteriaRow
              label="Посещение праймов"
              value={`> ${settings.primeThresholdPercent}%`}
              enabled={settings.primeEnabled}
            />
            <CriteriaRow
              label="Учёт баллов"
              value={`> ${settings.pointsThresholdPercent}%`}
              enabled={settings.pointsEnabled}
            />
            <CriteriaRow
              label="Тег ДВ (обход порогов выше)"
              enabled={settings.dvBypassEnabled}
            />
            <CriteriaRow
              label="Проходной ГС"
              value="по формуле, см. п. 1.2"
              enabled={settings.gsEnabled}
            />
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3">
          Критерии может менять глава гильдии в любой момент (см. п. 1.3.3).
        </p>
      </CardContent>
    </Card>
  );
}

export default function GuildInfoContent({
  settings,
}: {
  settings: SalaryEligibilitySettings;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SectionTitle>1. Условия получения зарплаты</SectionTitle>

        <SubTitle>1.1 Испытательный срок</SubTitle>
        <List>
          <Item>
            1.1.1 Испытательный срок заканчивается 1-го числа следующего
            месяца после вступления, при вступлении до 20-го числа включительно.
          </Item>
          <Item>
            1.1.2 Испытательный срок продлевается на месяц при вступлении
            после 20-го числа.
          </Item>
          <Item>
            1.1.3 Испытательный срок может быть снят заранее или продлён по
            усмотрению главы гильдии.
          </Item>
        </List>

        <SubTitle>1.2 Прохождение по ГС</SubTitle>
        <P>
          Проходной ГС рассчитывается на основании среднего ГС гильдии,
          округлённого вниз до пятисот:
        </P>
        <List>
          <Item>тактики/барды/танцоры = средний ГС −2000</Item>
          <Item>хилы (дуалы/щит) = средний ГС</Item>
          <Item>лучники/милики/маги (дуалы/щит) = средний ГС +500</Item>
          <Item>хилы/лучники/милики/маги (двурук) = средний ГС −500</Item>
        </List>

        <SubTitle>1.3 Критерии выдачи зарплаты</SubTitle>
        <List>
          <Item>
            1.3.1 К критериям выдачи зарплаты относятся: процент посещения
            праймов; процент набранных баллов; имеющиеся персоналки.
          </Item>
          <Item>
            1.3.2 Таблица с действующими критериями находится на этой
            странице справа.
          </Item>
          <Item>
            1.3.3 Действующие критерии могут быть изменены в любой момент по
            усмотрению главы гильдии.
          </Item>
        </List>

        <SectionTitle>
          2. Зарплата рассчитывается на основании процента набранных баллов
          от максимально возможных и заработка гильдии за месяц
        </SectionTitle>
        <List>
          <Item>
            2.1 Баллы набираются за рб и АГЛ, помеченные как обязательные в
            таблице ниже.
          </Item>
          <Item>
            2.2 Количество баллов, выдаваемых за праймовые рб, указано в той
            же таблице в соответствующей колонке.
          </Item>
          <Item>2.3 За обязательные АГЛ всегда выдаётся по 1 баллу.</Item>
          <Item>
            2.4 За ПВП на праймовых рб количество выдаваемых баллов
            удваивается.
          </Item>
          <Item>
            2.5 За обязательные АГЛ выдаётся по дополнительному баллу за:
            пвп; прок; двойной прок.
          </Item>
        </List>

        <SectionTitle>3. Расчёт выдаваемой зарплаты</SectionTitle>
        <List>
          <Item>
            3.1 Зарплаты рассчитываются на основании 70% общего заработка
            гильдии за месяц, остальные 30% уходят в казну гильдии на
            различные необходимые расходы.
          </Item>
          <Item>
            3.2 При расчёте зарплаты учитываются бонус за время нахождения в
            гильдии, дополнительный индивидуальный бонус и количество
            полученных штрафов.
          </Item>
          <Item>
            3.3 Бонус за срок нахождения в гильдии рассчитывается как 10% за
            первое полугодие и по 5% за каждое последующее.
          </Item>
          <Item>
            3.4 Дополнительные индивидуальные бонусы присваиваются по
            усмотрению главы гильдии.
          </Item>
          <Item>
            3.5 Штрафы выставляются индивидуально по усмотрению главы
            гильдии и фиксированно по 3 штрафа за непрохождение по вкладу
            гильдии. Количество необходимого вклада озвучивается главой
            гильдии в начале месяца или при трансфере на новый сервер.
          </Item>
          <Item>
            3.6 Штрафы действуют по формуле — x^(e^(1.25)/2)/2, где x — число
            штрафов.
          </Item>
          <Item>
            3.7 Все бонусы и процент штрафа учитываются последовательно и
            влияют друг на друга.
          </Item>
        </List>

        <SectionTitle>
          4. Все предметы, получаемые за праймовых рб и АГЛ
        </SectionTitle>
        <P>
          Продаются внутри гильдии в соответствии с очередью на их покупку,
          если очередь на какой-либо предмет отсутствует, то он выставляется
          на аукцион.
        </P>
        <List>
          <Item>
            4.1 Глава гильдии распоряжается лутом на своё усмотрение. Весь
            лут праймовых рб, АГЛ, кошка, морф, марли скидывается главе
            гильдии.
          </Item>
          <Item>
            4.2 Определённые предметы не продаются ни внутри гильдии, ни на
            аукционе, а выдаются бесплатно по усмотрению главы гильдии, при
            условии что в этих предметах нуждаются или впредь будут
            нуждаться члены гильдии. Список точных таких предметов и
            очередь на их получение находятся на странице «Таблица раздачи
            лута».
          </Item>
          <Item>
            4.3 Внутри гильдии все предметы, получаемые за праймовые рб и
            АГЛ, продаются со скидкой ~30%.
          </Item>
          <Item>
            4.4 Все точные цены и очереди на покупку находятся на странице
            «Покупка лута».
          </Item>
          <Item>
            4.5 Встать в очередь на покупку может любой член гильдии, даже
            если не прошёл испытательный срок, обратившись к главе гильдии.
          </Item>
          <Item>
            4.6 Запрещается покупать что-либо у гильдии для перепродажи, в
            случае выяснения подобного могут последовать штрафы или
            исключение из гильдии.
          </Item>
        </List>

        <SectionTitle>
          5. Помощь от гильдии по сбору коллекций и вторых спеков
        </SectionTitle>
        <List>
          <Item>
            5.1 Гильдия бесплатно предоставляет двух последних питомцев для
            коллекции боевых питомцев.
          </Item>
          <Item>
            5.2 Гильдия бесплатно выдаёт глайдер с Кракена, если он остался
            последним для коллекции глайдеров, либо добавляет 50 000 голды
            на покупку одного из дорогих глайдеров, если один из них остался
            последним для коллекции. Также гильдия предоставляет помощь для
            т2-коллекций глайдеров/питомцев — можно выбрать только одну из
            коллекций, гильдия купит последние 2 глайдера/питомца для
            данной коллекции.
          </Item>
          <Item>
            5.3 Гильдия единожды добавляет от 50 000 до 100 000 голды на
            сборку спека тактика/барда/танцора.
          </Item>
        </List>

        <SectionTitle>6. Система авансов</SectionTitle>
        <List>
          <Item>
            6.1 Любой член гильдии при покупке предметов у гильдии может
            частично или полностью оплатить покупку за счёт своей зарплаты
            за текущий месяц.
          </Item>
          <Item>
            6.2 Глава гильдии может отказаться от выдачи аванса по своему
            усмотрению без объяснения причины отказа.
          </Item>
          <Item>
            6.3 Члены гильдии могут получить аванс голдой на руки, указав:
            <span className="block pl-4 mt-1">
              а) для чего хотите снять аванс;
              <br />
              б) сумму снятия аванса.
            </span>
            <span className="block mt-1">
              Далее всё как решит глава гильдии.
            </span>
          </Item>
        </List>
      </div>

      <EligibilityCriteriaTable settings={settings} />
    </div>
  );
}
