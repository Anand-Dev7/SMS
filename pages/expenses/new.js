import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function NewExpense() {
  const router = useRouter();
  const { month_id } = router.query;
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const add = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Sign in first');
    const payload = { user_id: user.id, month_id: month_id, category, amount: Number(amount), notes };
    const { error } = await supabase.from('expenses').insert(payload);
    if (error) return alert(error.message);
    router.back();
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Add Expense</h2>
        <Link href="/"><a className="btn">Home</a></Link>
      </div>

      <div className="card">
        <input className="input" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <div style={{height:8}} />
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <div style={{height:8}} />
        <input className="input" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        <div style={{height:12}} />
        <button className="btn" onClick={add}>Save</button>
      </div>
    </div>
  );
}
