import { Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Account() {
  return (
    <div className="container" style={{ padding: 'var(--section-padding-v) var(--gutter)', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Wrench size={48} color="var(--nitro-blue)" style={{ marginBottom: 'var(--space-6)' }} />
      <h1 className="text-hero" style={{ fontSize: 'var(--text-h2-size)' }}>Client Portal</h1>
      <p style={{ color: 'var(--steel-400)', maxWidth: '420px', margin: '0 auto var(--space-8)' }}>
        Our new account management and order tracking portal is currently being calibrated in the workshop. It will be online shortly.
      </p>
      <Link to="/shop" className="btn-primary">
        Return to Shop
      </Link>
    </div>
  );
}
