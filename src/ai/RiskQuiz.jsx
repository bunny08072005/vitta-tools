import { useState } from 'react';

const questions = [
  { q: 'If your investments dropped 20% in a month, what would you do?', options: [
    { text: 'Sell everything immediately', score: 1 },
    { text: 'Sell some to reduce risk', score: 2 },
    { text: 'Hold and wait for recovery', score: 3 },
    { text: 'Invest more at lower prices', score: 4 },
  ]},
  { q: 'How long can you stay invested without needing the money?', options: [
    { text: 'Less than 2 years', score: 1 },
    { text: '2-5 years', score: 2 },
    { text: '5-10 years', score: 3 },
    { text: 'More than 10 years', score: 4 },
  ]},
  { q: 'How stable is your current income?', options: [
    { text: 'Irregular / freelance', score: 1 },
    { text: 'Somewhat stable with some risk', score: 2 },
    { text: 'Stable salaried job', score: 3 },
    { text: 'Very stable with multiple income sources', score: 4 },
  ]},
  { q: 'What matters more to you?', options: [
    { text: 'Protecting my money from any loss', score: 1 },
    { text: 'Steady growth with minimal risk', score: 2 },
    { text: 'Good growth, okay with some risk', score: 3 },
    { text: 'Maximum growth, comfortable with high risk', score: 4 },
  ]},
  { q: 'Have you invested in stock markets before?', options: [
    { text: 'Never', score: 1 },
    { text: 'A little, through mutual funds', score: 2 },
    { text: 'Yes, regularly in MFs and some stocks', score: 3 },
    { text: 'Yes, actively in stocks, F&O, etc.', score: 4 },
  ]},
];

export default function RiskQuiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      const total = newAnswers.reduce((s, a) => s + a, 0);
      const avg = total / questions.length;
      const profile = avg <= 1.5 ? 'conservative' : avg <= 2.8 ? 'moderate' : 'aggressive';
      onComplete(profile);
    }
  };

  const q = questions[current];

  return (
    <div className="risk-quiz">
      <div style={{marginBottom:16,display:'flex',gap:4}}>
        {questions.map((_,i) => (
          <div key={i} style={{flex:1,height:4,borderRadius:2,background: i < current ? 'var(--green)' : i === current ? 'var(--accent-primary)' : 'var(--bg-elevated)'}} />
        ))}
      </div>
      <p style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:8}}>Question {current + 1} of {questions.length}</p>
      <h4 style={{fontSize:'1.05rem',marginBottom:20,lineHeight:1.4}}>{q.q}</h4>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt.score)} className="btn btn-secondary" style={{justifyContent:'flex-start',textAlign:'left',padding:'14px 20px'}}>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
