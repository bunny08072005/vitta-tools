import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

export default function ActionItems({ actions }) {
  const getIcon = (p) => p === 'critical' ? <AlertTriangle size={18}/> : p === 'important' ? <AlertCircle size={18}/> : <Lightbulb size={18}/>;
  const getColor = (p) => p === 'critical' ? {bg:'var(--red-soft)',c:'var(--red)'} : p === 'important' ? {bg:'var(--amber-soft)',c:'var(--amber)'} : {bg:'var(--green-soft)',c:'var(--green)'};
  const getLabel = (p) => p === 'critical' ? 'Critical' : p === 'important' ? 'Important' : 'Optimize';

  return (
    <div className="ai-actions glass-card" id="action-items" style={{padding:28}}>
      <h3 style={{fontSize:'1.1rem',marginBottom:4}}>Action Plan</h3>
      <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:20}}>Prioritized steps to improve your financial health</p>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {actions.map((a,i) => {
          const col = getColor(a.priority);
          return (
            <div key={i} style={{padding:16,background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--border-color)',borderLeft:`3px solid ${col.c}`}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{width:36,height:36,minWidth:36,borderRadius:'var(--radius-sm)',display:'flex',alignItems:'center',justifyContent:'center',background:col.bg,color:col.c}}>{getIcon(a.priority)}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
                    <h4 style={{fontSize:'0.9rem'}}>{a.title}</h4>
                    <span style={{fontSize:'0.65rem',padding:'2px 8px',borderRadius:'var(--radius-full)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',background:col.bg,color:col.c}}>{getLabel(a.priority)}</span>
                  </div>
                  <p style={{fontSize:'0.8rem',color:'var(--text-muted)',lineHeight:1.5}}>{a.description}</p>
                </div>
              </div>
              {a.link && <Link to={a.link} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:'0.8rem',color:'var(--accent-glow)',marginTop:8,marginLeft:48,textDecoration:'none',fontWeight:500}}>Use Calculator <ArrowRight size={14}/></Link>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
