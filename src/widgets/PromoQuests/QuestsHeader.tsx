type Props = {
  title: string;
  status: string;
  goal: number;
};

export default function QuestsHeader({ title, status, goal }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {status} · неделя с четверга по среду · цель — {goal} баллов · время
        московское
      </p>
    </div>
  );
}
