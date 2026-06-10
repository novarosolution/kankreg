const paths: Record<string, React.ReactNode> = {
  cow: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 14v-2m8 2v-2M6 10h12M9 6c0-1.5 1-2.5 3-2.5s3 1 3 2.5M7 18h10a2 2 0 002-2v-4a5 5 0 00-5-5H10a5 5 0 00-5 5v4a2 2 0 002 2z"
    />
  ),
  milk: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 4h6l1 14H8L9 4zm3 0V2m-4 6h8"
    />
  ),
  culture: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"
    />
  ),
  churn: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4c4 0 6 2 6 5s-2 5-6 7c-4-2-6-4-6-7s2-5 6-5zm0 0V2m0 14v2"
    />
  ),
  fire: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 3c2 3 1 5-1 7 2-1 4 0 5 2-1 4-4 6-7 6s-6-2-7-6c1-2 3-3 5-2-2-2-3-4-1-7z"
    />
  ),
  jar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 4h6v2l-1 14H10L9 6V4zm3-2v2m-5 6h10"
    />
  ),
  digest: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16M8 8h8M8 12h8M8 16h5" />
  ),
  protein: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10v10H7zM12 7v10M7 12h10" />
  ),
  vitamins: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4l2-4z" />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"
    />
  ),
  flame: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c1 2 0 4-2 5 1 2 2 4 0 6-2 2-4 1-6-1-2-3-1-5 1-7 1-1 2-2 3-2 2 1 3 3 3 5z" />
  ),
  aroma: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16c0-3 2-5 4-7s4-4 4-7M12 16c0-3 2-5 4-7" />
  ),
};

export default function ProcessIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      {paths[name] ?? paths.jar}
    </svg>
  );
}
