import {
  SEAL_GRADES,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import FieldLabel from "./FieldLabel";
import type { FieldProps } from "./fieldProps";

export default function QualityField({ draft, options, onChange }: FieldProps) {
  const grades =
    options.fixedGrade === null
      ? SEAL_GRADES
      : SEAL_GRADES.filter((grade) => grade.grade === options.fixedGrade);

  return (
    <div className="space-y-1.5">
      <FieldLabel>Качество</FieldLabel>
      <Select
        value={String(draft.grade)}
        onValueChange={(value) => onChange({ grade: Number(value) })}
      >
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder="Грейд" />
        </SelectTrigger>
        <SelectContent>
          {grades.map((grade) => {
            const color = getSealGradeColor(grade.grade);
            return (
              <SelectItem key={grade.grade} value={String(grade.grade)}>
                <span style={color ? { color } : undefined}>{grade.label}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
