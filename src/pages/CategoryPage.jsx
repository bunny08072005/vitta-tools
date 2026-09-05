import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCategoryById, getCalculatorsByCategory } from '../data/calculators';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);
  const calcs = getCalculatorsByCategory(categoryId);

  if (!category) return <div className="calc-page"><div className="container"><h2>Category not found</h2></div></div>;

  return (
    <div className="calc-page">
      <div className="container">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={18} /> Home
        </Link>

        <div className="animate-fade-in" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: `${category.color}1a`, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: category.color }}>
              <category.icon size={26} strokeWidth={1.75} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{category.name}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{category.description}</p>
            </div>
          </div>
        </div>

        <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {calcs.map(calc => (
            <Link to={`/calculator/${calc.slug}`} key={calc.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 24, textDecoration: 'none' }}>
              <div style={{ width: 48, height: 48, minWidth: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)', color: 'var(--accent-glow)' }}>
                <calc.icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: 4 }}>{calc.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{calc.description}</p>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)', minWidth: 16 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
