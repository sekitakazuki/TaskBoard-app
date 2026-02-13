import { useState } from "react";
import type { TaskInsert,TaskPriority,TaskStatus } from "../types/task";

type Props = {
    onCreate: (data: TaskInsert) => Promise<void>;
};

const statusOptions: {value:TaskStatus;label:string} [] =[
    {value : "todo", label: "Todo"},
    {value :"doing", label: "Doing"},
    {value :"done", label: "Done"},
];

const priorityOptions: {value:TaskPriority;label:string} [] =[
    { value : "low", label:"Low"},
    { value : "mid", label:"Mid"},
    { value : "high", label:"High"},
];

export function TaskForm({onCreate} :Props) {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [status,setStatus] = useState<TaskStatus>("todo");
    const [priority, setPriority] = useState<TaskPriority>("mid");
    const [loading,setLoading] = useState(false);

    const submit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({ title,description,status,priority});
            setTitle("");
            setDescription("");
            setStatus("todo");
            setPriority("mid");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                    <label className="text-sm text-slate-300">タイトル</label>
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例: 見積もり作成"
                        />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-slate-300">詳細</label>
                    <textarea
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="例: ◯◯社向け、期限は金曜"
                        rows ={3}
                        />
                </div>

                <div>
                    <label className="text-sm text-slate-300">ステータス</label>
                    <select
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                            {statusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                </div>

                <div>
                    <label className="text-sm text-sllate-300">重要度</label>
                    <select
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        >
                            {priorityOptions.map((o) => (
                                <option key ={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                </div>
            </div>

            <button
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
                disabled={loading || !title}
                >
                    {loading ? "追加中..." : "タスク追加"}
                </button>
        </form>
    );
}