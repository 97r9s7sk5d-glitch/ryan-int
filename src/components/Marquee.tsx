const WORDS = ['Hand-painted', 'Shaker', 'Dovetailed oak', 'Antique brass', 'Walnut veneer', 'Marble-vein quartz', 'Made in Malton', 'Fitted by the makers'];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-line bg-coal py-6" aria-hidden>
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-14 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="display flex items-center gap-14 text-3xl italic text-ivory/70 sm:text-4xl">
            {w}
            <span className="text-brass">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
