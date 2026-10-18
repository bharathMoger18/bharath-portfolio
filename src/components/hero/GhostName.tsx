/**
 * Giant decorative name behind the hero, about 6% opacity. The text is CSS
 * generated content (see .ghost-name::before), so it is not in the DOM text:
 * it cannot be read, selected or searched, and contrast checkers skip it.
 */
export default function GhostName({ text }: { text: string }) {
  return <div className="ghost-name" aria-hidden="true" data-text={text} />;
}
