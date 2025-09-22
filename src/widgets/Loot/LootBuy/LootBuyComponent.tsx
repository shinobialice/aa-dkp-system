import { Card, CardContent } from "@/shared/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { getLootGrouped } from "@/actions/getLootGrouped";
import { PricesComponent } from "@/widgets/Loot/LootBuy/PricesComponent";

export default async function LootBuyComponent() {
  const lootByBoss = await getLootGrouped();

  const bossTabs = Object.keys(lootByBoss).filter((s) => s !== "Разное");
  const miscLoot = lootByBoss["Разное"] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Покупка Лута</h1>
        </header>
        <Card className="shadow-xl h-[800px]">
          <CardContent className="pt-6">
            <Tabs defaultValue={bossTabs[0]}>
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                {bossTabs.map((boss) => (
                  <TabsTrigger key={boss} value={boss}>
                    {boss}
                  </TabsTrigger>
                ))}
              </TabsList>

              {bossTabs.map((boss) => (
                <TabsContent key={boss} value={boss} className="mt-4">
                  <PricesComponent items={lootByBoss[boss]} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardContent>
          <PricesComponent items={miscLoot} />
          {miscLoot.some(
            (i) =>
              i.name.includes("Средоточие") && i.price === "Идут в комплекте",
          )}
        </CardContent>
      </Card>
    </div>
  );
}
