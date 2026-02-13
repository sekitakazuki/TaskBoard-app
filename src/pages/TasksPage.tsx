/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect,useMemo,useState } from "react";
import {supabase} from "../lib/supabase";
import  type { Task,TaskUpdate,TaskInsert } from "../types/task";
import { TaskForm } from "../components/TaskForm";
import { TaskItem } from "../components/TaskItem";

type Props = { userId : string };

export function TasksPage({userId} : Props) {
    const [tasks,setTasks] = useState<Task[]>([]);
    const [loading,setLoading] =useState(true);
    const [errorMsg,setErrorMsg] = useState<string | null>(null);

    const count = useMemo(() => tasks.length, [tasks]);

    const fetchTasks = async () => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const { data,error } = await supabase
                .from("tasks")
                .select("*")
                .order("created_at", {ascending :false});

                if (error) throw error;
                setTasks((data ?? []) as Task[]);
        } catch (err:any) {
            setErrorMsg(err?.message ?? "一覧取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const createTask = async (payload:TaskInsert) => {
        setErrorMsg(null);
        const row = {...payload,user_id:userId};
        const { error } = await supabase.from("tasks").insert(row);
        if (error) {
            setErrorMsg(error.message);
            return;
        }
        await fetchTasks();
    };

    const updateTask = async (id: string,patch:TaskUpdate) => {
        setErrorMsg(null);
        const {error} = await supabase.from("tasks").update(patch).eq("id",id);
        if (error) {
            setErrorMsg(error.message);
            return;
        }
        await fetchTasks();
    };

    const deleteTask = async(id:string) => {
        setErrorMsg(null);
        const {error} = await supabase.from("tasks").delete().eq("id",id);
        if (error) {
            setErrorMsg(error.message);
            return;
        }
        await fetchTasks();
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="sticky top-0 bg-slate-950/80 backdrop-blur border-b border-slate-900">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">TaskBoard</h1>
                        <p className="text-xs text-slate-300">tasks: {count}</p>
                    </div>
                    <button 
                        className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900"
                        onClick={logout}
                        >
                            ログアウト
                        </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
                <TaskForm onCreate={createTask} />

                {errorMsg && (
                    <div className="p-4 rounded-xl border border-rose-900 bg-rose-950/40 text-rose-200">
                        {errorMsg}
                    </div>
                )}

                {loading ? (
                    <div className="text-slate-300">読み込み中...</div>
                ) : tasks.length === 0 ?(
                    <div className="text-slate-300">タスクがありません。追加してください。</div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {tasks.map((t) => (
                            <TaskItem key = {t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}