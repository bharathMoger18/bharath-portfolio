import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

export interface QrCodeProps {
  /** Text to encode, e.g. the live site URL. */
  value: string;
  /** Accessible name, e.g. "QR code linking to portfolio.bharathops.online". */
  label: string;
  /** Rendered size in px. Default 96. */
  size?: number;
}

const QUIET_ZONE = 2; // modules of white border around the code

/** Renders a QR code as one SVG path. No images, no network, no markup injection. */
export default function QrCode({ value, label, size = 96 }: QrCodeProps) {
  const { path, dim } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < count; r += 1) {
      for (let c = 0; c < count; c += 1) {
        if (qr.isDark(r, c)) d += `M${c + QUIET_ZONE} ${r + QUIET_ZONE}h1v1h-1z`;
      }
    }
    return { path: d, dim: count + QUIET_ZONE * 2 };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${dim} ${dim}`}
      shapeRendering="crispEdges"
    >
      <rect width={dim} height={dim} fill="var(--color-white-soft)" />
      <path d={path} fill="var(--color-charcoal)" />
    </svg>
  );
}
