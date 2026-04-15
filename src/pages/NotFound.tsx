import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden
      bg-gradient-to-br from-background via-orange-50 to-background">

      {/* 🔥 Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-orange-300/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-md w-full">

        {/* Title */}
        <h1 className="text-6xl font-extrabold mb-4 text-primary">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Page Not Found 😕
        </h2>

        {/* Image */}
        <div className="flex justify-center my-6">
          <img
            src="/images/error/404.svg"
            alt="404"
            className="w-60 dark:hidden"
          />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="w-60 hidden dark:block"
          />
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          Go Back Home
        </Link>

        {/* Footer */}
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sheher-e-Hyderabad
        </p>

      </div>
    </div>
  );
}