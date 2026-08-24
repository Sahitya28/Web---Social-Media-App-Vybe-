export default function Avatar({ src, username, className = "w-8 h-8 text-xs" }) {
  const initial = (username || "?").charAt(0).toUpperCase();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={username || "avatar"}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <span
      className={`${className} rounded-full bg-vybe-gradient flex items-center justify-center font-bold text-white shrink-0`}
    >
      {initial}
    </span>
  );
}
