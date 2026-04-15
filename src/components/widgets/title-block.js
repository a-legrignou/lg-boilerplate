export default function TitleBlock({ title, subtitle }) {
  return (
    <div className="mb-4">
      {subtitle && <span className="text-xs font-medium tracking-[0.14em] uppercase text-gold">{subtitle}</span>}
      {title && <h3 className="font-serif text-2xl mt-1 text-t0">{title}</h3>}
    </div>
  );
}
