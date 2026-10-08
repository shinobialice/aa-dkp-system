import { useState, type FormEvent } from "react";
import {
  getCalculatorShare,
  type CalculatorShare,
} from "@/actions/calculatorShare";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/shared/ui";
import {
  fromSnapshot,
  shareIdFromLink,
  snapshotDetails,
} from "./buildSnapshot";
import type { CalculatorBuild } from "./calculatorModel";
import type { BuildSide } from "./useCalculator";

type Props = {
  side: BuildSide | null;
  onClose: () => void;
  onPick: (side: BuildSide, build: CalculatorBuild) => void;
};

const TITLES: Record<BuildSide, string> = {
  doll: "Кукла по ссылке",
  target: "Сравнить со сборкой по ссылке",
};

export default function OpenLinkDialog({ side, onClose, onPick }: Props) {
  const [link, setLink] = useState("");
  const [share, setShare] = useState<CalculatorShare | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  if (!side) return null;

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setLink("");
    setShare(null);
    setErrorText(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = shareIdFromLink(link);
    setShare(null);
    if (!id) {
      setErrorText("Это не похоже на ссылку на сборку");
      return;
    }
    setLoading(true);
    try {
      const found = await getCalculatorShare(id);
      setShare(found);
      setErrorText(found ? null : "Сборка по этой ссылке не найдена");
    } catch (error) {
      setErrorText(errorMessage(error, "Не удалось открыть ссылку"));
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (build: CalculatorBuild) => {
    onPick(side, build);
    handleOpenChange(false);
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{TITLES[side]}</DialogTitle>
          <DialogDescription>
            Вставьте ссылку на сборку, которой с вами поделились
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="nofearhub.com/calc/…"
            aria-label="Ссылка на сборку"
            autoFocus
          />
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isLoading || !link.trim()}
          >
            {isLoading ? "Открываем…" : "Открыть"}
          </Button>
        </form>
        {errorText && <p className="text-sm text-destructive">{errorText}</p>}
        {share && <ShareBuilds share={share} onPick={handlePick} />}
      </DialogContent>
    </Dialog>
  );
}

type ShareBuildsProps = {
  share: CalculatorShare;
  onPick: (build: CalculatorBuild) => void;
};

function ShareBuilds({ share, onPick }: ShareBuildsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        Сборка от {share.authorName}. Какую взять
      </span>
      {share.snapshot.builds.map((snapshot, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto cursor-pointer flex-col items-start gap-0.5 py-2.5"
          onClick={() => onPick(fromSnapshot(snapshot, share.owners))}
        >
          <span>{snapshot.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {snapshotDetails(snapshot)}
          </span>
        </Button>
      ))}
    </div>
  );
}
