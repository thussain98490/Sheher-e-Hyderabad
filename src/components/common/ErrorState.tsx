import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  description,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" />
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="mx-auto max-w-2xl text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
