const PATHS = {
  plus: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  ),
  spinner: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4a8 8 0 0 1 8 8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12a8 8 0 0 1-8 8"
        opacity="0.4"
      />
    </>
  ),
  trash: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7"
      />
      <path strokeLinecap="round" d="M10 11v6M14 11v6" />
    </>
  ),
  note: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm11 0v3h3"
    />
  ),
};

export const Icon = ({ name, size = 20, strokeWidth = 1.75, className, title }) => {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
};
