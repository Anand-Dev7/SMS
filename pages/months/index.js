import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import useSWR from 'swr';

const fetcher = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase.from('months').select('*').eq('user_id', user.id).order('year', {ascending:false}).order('month', {ascending:false}).limit(24);
  if (error) throw error;
  return data;
};

export default function Months() {
  const { data: months, mutate } = useSWR('months', fetcher);
  const [salary, setSalary] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()+1);

  const addMonth = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Sign in first');
    const { data, error } = await supabase.from('months').upsert({
      user_id: user.id, year: Number(year), month: Number(month), salary: Number(salary), savings_start: 0
    }, { onConflict: ['user_id','year','month'] });
    if (error) return alert(error.message);
    setSalary('');
    mutate();
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Months</h2>
        <Link href="/"><a className="btn">Back</a></Link>
      </div>

      <div className="card">
        <h4>Add / Update Month</h4>
        <input className="input" placeholder="Salary" value={salary} onChange={e=>setSalary(e.target.value)} />
        <div style={{height:8}} />
        <div className="row">
          <input className="input" placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} />
          <input className="input" placeholder="Month (1-12)" value={month} onChange={e=>setMonth(e.target.value)} />
        </div>
        <div style={{height:8}} />
        <button className="btn" onClick={addMonth}>Save Month</button>
      </div>

      <div className="card">
        <h4>Your months</h4>
        {months?.length === 0 && <p className="small">No months yet</p>}
        <ul>
          {months?.map(m=>(
            <li key={m.id} className="small">
              {m.year}-{String(m.month).padStart(2,'0')} â Salary: {m.salary} â <Link href={`/months/${m.id}`}><a>Details</a></Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
