import { Link } from 'react-router-dom';
import './CategoryTile.css';

interface CategoryTileProps {
  title: string;
  imageSrc: string;
  link: string;
  lines?: number;
}

export default function CategoryTile({ title, imageSrc, link, lines }: CategoryTileProps) {
  return (
    <Link to={link} className="cat-tile">
      <div className="cat-img">
        <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <h3>{title}</h3>
      {lines && <span>{lines.toLocaleString()} lines</span>}
    </Link>
  );
}
