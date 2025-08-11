import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import useSWR from 'swr';

const fetcher = async (path) => {
  const { data, error } = await supabase.from(path).select('*').order('year', {ascending:false}).order('month', {ascending:false}).limit(12);
  if (error) throw error;
  return data;
};

export default function Home() {
  const [user, setUser] = useState(null);
  const { data: months } = useSWR(user ? 'month_totals' : null, fetcher);

  useEffect(() => {
    const u = supabase.auth.getUser().then(r=>setUser(r.data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Salary Management (SMS)</h2>
        {user ? <button className="btn" onClick={signOut}>Sign out</button> : <Link href="/login"><a className="btn">Sign in</a></Link>}
      </div>

      {!user && (
        <div className="card">
          <h3>Welcome</h3>
          <p className="small">Sign in to track salary, expenses and carryover savings.</p>
        </div>
      )}

      {user && (
        <>
          <div className="card">
            <h3>Quick actions</h3>
            <div className="row">
              <Link href="/months"><a className="btn">Months</a></Link>
              <Link href="/expenses/new"><a className="btn">Add Expense</a></Link>
            </div>
          </div>

          <div className="card">
            <h3>Recent months</h3>
            {months?.length === 0 && <p className="small">No months yet.</p>}
            <ul>
              {months?.map(m=>(
                <li key={m.month_id} className="small">
                  {m.year}-{String(m.month).padStart(2,'0')} &nbsp; Salary: {m.salary} &nbsp; Expenses: {m.total_expenses} &nbsp; Savings end: {m.savings_end}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
