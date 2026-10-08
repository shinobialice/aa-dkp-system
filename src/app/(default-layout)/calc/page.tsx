import { getMyCalculatorPlayer } from "@/actions/getCalculatorPlayer";
import Calculator from "@/widgets/calculator";

export default async function CalculatorPage() {
  const viewer = await getMyCalculatorPlayer();
  return <Calculator viewer={viewer} share={null} />;
}
