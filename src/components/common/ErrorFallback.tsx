interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  message = "Something went wrong.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg text-text-light-primary dark:text-text-dark-primary">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-100"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
