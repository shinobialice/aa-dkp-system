export type TreasuryGiveawaySyncItem = {
  treasuryName: string;
  giveawayName: string;
  profileName: string;
  profileType: string;
};

export const treasuryGiveawaySyncItems: TreasuryGiveawaySyncItem[] = [
  {
    treasuryName: "Глайдер «Крылья небесного стража»",
    giveawayName: "Авиара",
    profileName: "Авиара",
    profileType: "Глайдеры",
  },
  {
    treasuryName: "Глайдер «Рассекатель небес»",
    giveawayName: "Глайдер «Рассекатель небес»",
    profileName: "Глайдер «Рассекатель небес»",
    profileType: "Глайдеры",
  },
  {
    treasuryName: "Анд'хакар, Чернильная тьма",
    giveawayName: "Анд'хакар, Чернильная тьма",
    profileName: "Анд'хакар, Чернильная тьма",
    profileType: "Другое",
  },
  {
    treasuryName: "Ро'кана, Безумие морей",
    giveawayName: "Ро'кана, Безумие морей",
    profileName: "Ро'кана, Безумие морей",
    profileType: "Другое",
  },
];

export const treasuryNameByGiveawayName = new Map(
  treasuryGiveawaySyncItems.map((i) => [i.giveawayName, i.treasuryName]),
);
