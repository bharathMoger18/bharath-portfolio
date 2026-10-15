import { defineLab } from './lab.ts';
import './Tokens.lab.css';

const COLORS = [
  ['ivory', '--color-ivory'],
  ['charcoal', '--color-charcoal'],
  ['sage', '--color-sage'],
  ['sand', '--color-sand'],
  ['green', '--color-green'],
  ['white-soft', '--color-white-soft'],
] as const;

const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;
const SPACES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default defineLab({
  id: 'tokens',
  title: 'Tokens (A)',
  note: 'Palette, type scale and spacing straight from tokens.css.',
  render: () => (
    <div className="tokens-lab">
      <ul role="list" className="tokens-lab__swatches">
        {COLORS.map(([name, variable]) => (
          <li key={name}>
            <span className="tokens-lab__swatch" style={{ background: `var(${variable})` }} />
            <span className="label">{name}</span>
          </li>
        ))}
      </ul>

      <div className="tokens-lab__type">
        {SIZES.map((size) => (
          <p key={size} style={{ fontSize: `var(--text-${size})` }}>
            <span className="label">text-{size}</span> Request path, <em>built</em>
          </p>
        ))}
      </div>

      <div>
        {SPACES.map((n) => (
          <div key={n} className="tokens-lab__space">
            <span className="label">space-{n}</span>
            <span className="tokens-lab__bar" style={{ width: `var(--space-${n})` }} />
          </div>
        ))}
      </div>
    </div>
  ),
});
