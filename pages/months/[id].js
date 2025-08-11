import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function MonthDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [month, setMonth] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(()=>{ if(!id) return;
    (async ()=>{
      const { data: m } = await supabase.from('months').select('*').eq('id', id).single();
      setMonth(m);
      const { data: e } = await supabase.from('expenses').select('*').eq('month_id', id).order('spent_at', {ascending:false});
      setExpenses(e || []);
    })();
  }, [id]);

  const computeSavingsEnd = () => {
    const total = (expenses || []).reduce((s,x)=>s+Number(x.amount),0);
    return Number(month?.salary || 0) + Number(month?.savings_start || 0) - total;
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Month detail</h2>
        <Link href="/months"><a className="btn">Back</a></Link>
      </div>

      {!month && <div className="card">Loading...</div>}
      {month && (
        <>
          <div className="card">
            <h3>{month.year}-{String(month.month).padStart(2,'0')}</h3>
            <p className="small">Salary: {month.salary}</p>
            <p className="small">Savings start: {month.savings_start}</p>
            <p className="small">Savings end (calculated): {computeSavingsEnd()}</p>
          </div>

          <div className="card">
            <h4>Expenses</h4>
            <ul>
              {expenses.map(e=>(
                <li key={e.id} className="small">{e.spent_at.substring(0,10)} — {e.category} — {e.amount} — {e.notes}</li>
              ))}
            </ul>
            <Link href={`/expenses/new?month_id=${id}`}><a className="btn">Add Expense</a></Link>
          </div>
        </>
      )}
    </div>
  );
}
