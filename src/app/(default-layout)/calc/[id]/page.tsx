import { notFound } from "next/navigation";
import { getCalculatorShare } from "@/actions/calculatorShare";
import { getMyCalculatorPlayer } from "@/actions/getCalculatorPlayer";
import Calculator from "@/widgets/calculator";

export default async function SharedCalculatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [share, viewer] = await Promise.all([
    getCalculatorShare(id),
    getMyCalculatorPlayer(),
  ]);
  if (!share) notFound();

  return <Calculator key={id} viewer={viewer} share={share} />;
}
