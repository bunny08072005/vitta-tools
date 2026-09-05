import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoon({ title, description }) {
  return (
    <div className="calc-page">
      <div className="container">
        <div className="coming-soon animate-fade-in">
          <div className="coming-soon-icon">⏳</div>
          <span className="badge badge-amber">Coming Soon</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
