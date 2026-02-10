import { QRCodeCanvas } from 'qrcode.react';

interface VIPCardProps {
  nombre: string;
  logo: string | null;
  background?: string | null;
}

export default function VIPCard({ nombre, logo, background }: VIPCardProps) {
  const backgroundImage = background
    ? `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(26,26,26,0.7) 50%, rgba(0,0,0,0.7) 100%), url(${background})`
    : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
  return (
    <div
      style={{
        width: '204px',
        height: '323px',
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '3px solid #D4AF37',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Rubik Maps', system-ui, sans-serif",
        fontWeight: 700,
      }}
    >
      {logo && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div
          style={{
            color: '#D4AF37',
            fontWeight: 'bold',
            fontSize: '13px',
            letterSpacing: '1px',
            marginBottom: '5px',
          }}
        >
          VIP FALLAS 2026
        </div>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            margin: '8px 0',
          }}
        />
      </div>

      <div
        style={{
          textAlign: 'center',
          marginBottom: '8px',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            lineHeight: '1.3',
            padding: '0 8px',
          }}
        >
          {nombre.toUpperCase()}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div
          style={{
            background: 'white',
            padding: '5px',
            display: 'inline-block',
            borderRadius: '4px',
          }}
        >
          <QRCodeCanvas value={nombre} size={70} level="H" includeMargin={false} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            marginBottom: '8px',
          }}
        />
        <div
          style={{
            color: '#D4AF37',
            fontSize: '9px',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
        >
          FALLA ALEMANIA
        </div>
        <div
          style={{
            color: '#D4AF37',
            fontSize: '9px',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
        >
          EL BACHILLER
        </div>
      </div>
    </div>
  );
}
