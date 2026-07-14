import type { ReactNode } from 'react';
import './USPCard.css';

interface USPCardProps {
  icon: ReactNode;
  title: string;
  body: string;
}

export default function USPCard({ icon, title, body }: USPCardProps) {
  return (
    <div className="usp">
      {icon}
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
