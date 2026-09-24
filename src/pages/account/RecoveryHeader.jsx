import logo from '../../assets/brand/logo-floresia.webp';

export default function RecoveryHeader({ eyebrow, title, children }) {
  return (
    <header className="recovery-header">
      <img src={logo} alt="" className="recovery-logo" aria-hidden="true" />
      <p className="recovery-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </header>
  );
}
