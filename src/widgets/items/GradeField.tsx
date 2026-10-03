import {
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function GradeField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Рамка редкости</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GRADE_OPTIONS.map((grade) => {
            const color = getSealGradeColor(grade);
            return (
              <SelectItem key={grade} value={String(grade)}>
                <span style={color ? { color } : undefined}>
                  {grade} — {getSealGradeLabel(grade)}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
