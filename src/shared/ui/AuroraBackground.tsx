const sparkles = [
  'left-[6%] top-[9%] size-7',
  'left-[31%] top-[23%] size-3',
  'left-[74%] top-[26%] size-[22px]',
  'left-[91%] top-[13%] size-3.5',
  'left-[18%] top-[79%] size-[22px]',
  'left-[69%] top-[70%] size-3',
  'left-[92%] top-[84%] size-4',
]

export function AuroraBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(ellipse_at_center,#c3d88b_0%,#d2e3a6_30%,#e5efcc_58%,#f6f9ee_88%)]"
      aria-hidden="true"
    >
      {sparkles.map((position) => (
        <svg key={position} viewBox="0 0 24 24" className={`absolute fill-[#a9c463] ${position}`} focusable="false">
          <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
        </svg>
      ))}
    </div>
  )
}
