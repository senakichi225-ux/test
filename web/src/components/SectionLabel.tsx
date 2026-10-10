/** セクションの小さなラベル＋見出し */
export function SectionHeading({
  label,
  title,
  id,
  as: Tag = "h2",
  className = "",
}: {
  label: string;
  title: string;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`space-y-5 ${className}`}>
      <p className="label">{label}</p>
      <Tag
        id={id}
        className={`font-serif font-light text-balance text-sumi ${
          Tag === "h1" ? "text-5xl leading-[1.05] sm:text-6xl lg:text-7xl" : "text-3xl leading-tight sm:text-4xl lg:text-5xl"
        }`}
      >
        {title}
      </Tag>
    </div>
  );
}
