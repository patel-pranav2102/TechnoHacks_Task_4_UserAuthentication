import { useState } from "react";
import { register } from "./api";

export default function Register({ onRegister }){
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (form.username.length < 5) { setMsg("Username must be at least 5 characters long"); return; }
    if (form.password.length < 8) { setMsg("Password must be at least 8 characters long"); return; }
    if (!/(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password)) { setMsg("Password must contain at least one number and one symbol"); return; }
    const res = await register(form);
    if (res.user) { setMsg("Registered & logged in"); if(onRegister) onRegister(res.user); }
    else setMsg(res.message || "Error");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 p-8 bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-2xl shadow-xl border-2 border-teal-300">
      <input className="px-4 py-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-400 focus:border-teal-500 transition-all duration-200 placeholder:text-teal-400 bg-white" placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
      <input className="px-4 py-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-400 focus:border-teal-500 transition-all duration-200 placeholder:text-teal-400 bg-white" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input className="px-4 py-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-400 focus:border-teal-500 transition-all duration-200 placeholder:text-teal-400 bg-white" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button className="px-4 py-3 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:from-green-700 hover:via-teal-700 hover:to-cyan-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-2xl">Register</button>
      {msg && <div className="text-sm text-center font-medium text-teal-700 bg-teal-50 py-2 px-4 rounded-lg border border-teal-200">{msg}</div>}
    </form>
  );
}
