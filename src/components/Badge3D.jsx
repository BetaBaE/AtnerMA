'use client';

export default function Badge3D({ variant = 'dark', className = '', style = {} }) {
  const styles = {
    dark: {
      background: 'transparent',
      color: '#ffcc00',
      border: '1.5px solid #ffcc00',
    },
    light: {
      background: '#ffcc00',
      color: '#ffffff',
      border: '1.5px solid #ffcc00',
    },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.22rem 0.65rem',
        borderRadius: '3px',
        fontSize: '0.65rem',
        fontWeight: 800,
        fontFamily: 'Barlow Condensed, sans-serif',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        lineHeight: 1,
        flexShrink: 0,
        ...styles[variant],
        ...style,
      }}
    >
      3D
    </span>
  );
}
