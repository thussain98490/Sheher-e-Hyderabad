export default function LoadingScreen({
  label = 'Loading...',
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      
      {/* Logo / Website Name */}
      <h1 className="mb-6 text-2xl font-semibold tracking-wide text-primary">
        Sheher-E-Hyderabad
      </h1>

      {/* Simple Loader */}
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />

      {/* Loading Text */}
      <p className="mt-4 text-sm text-muted-foreground">
        {label}
      </p>
    </div>
  );
}