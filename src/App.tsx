import './App.css'
import { useEffect,useState} from "react";
import type {Session} from "@supabase/supabase-js";
import { supabase } from"./lib/supabase";
import { LoginPage } from "./pages/LoginPage";
import {TasksPage} from "./pages/TasksPage"; 


export default function App() {
  const [session,setSession] = useState<Session | null>(null);
  const [booting,setBooting] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data}) => {
      setSession(data.session ?? null);
      setBooting(false);
    });

    const { data:sub } = supabase.auth.onAuthStateChange((_event,newSession) => {
      setSession(newSession);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  },[]);

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        起動中...
      </div>
    );
  }

  return session ? <TasksPage userId ={session.user.id} /> : <LoginPage />;
}

