import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [mode,setMode] = useState('signin');
  const router = useRouter();

  const handle = async (e) => {
    e.preventDefault();
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      router.push('/');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      alert('Check your email for confirmation (if required).');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>{mode === 'signin' ? 'Sign in' : 'Sign up'}</h3>
        <form onSubmit={handle}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{height:8}} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{height:12}} />
          <button className="btn" type="submit">{mode === 'signin' ? 'Sign in' : 'Sign up'}</button>
        </form>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Switch to Sign up' : 'Switch to Sign in'}</button>
        </div>
      </div>
    </div>
  );
}
