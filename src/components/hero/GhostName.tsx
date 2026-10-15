/** Giant decorative name behind the hero, about 6% opacity. Hidden from assistive tech. */
export default function GhostName({ text }: { text: string }) {
  return (
    <div className="ghost-name" aria-hidden="true">
      {text}
    </div>
  );
}
