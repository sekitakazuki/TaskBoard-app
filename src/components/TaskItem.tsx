import { useState } from "react";
import  type { Task,TaskPriority,TaskStatus,TaskUpdate } from "../types/task";

type Props = {
    task: Task;
    onUpdate: (id:string,patch:TaskUpdate) => Promise<void>;
    onDelete: (id:string) => Promise<void>;
};

export function TaskItem({task, onUpdate, onDelete}: Props) {
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    // D を大文字に修正 (setDescription)
    const [description, setDescription] = useState(task.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);

    const [loading, setLoading] = useState(false);

    const save = async () => {
        setLoading(true);
        try {
            await onUpdate(task.id, {title, description, status, priority});
            setEditing(false);
        } finally {
            setLoading(false);
        }
    };

    const remove = async () => {
        if (!confirm("削除しますか？")) return;
        setLoading(true);
        try {
            await onDelete(task.id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    {/* editing が true の時にフォームを表示するように修正 */}
                    {editing ? (
                        <div className="space-y-2">
                            <input
                                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                >
                                    <option value="todo">Todo</option>
                                    <option value="doing">Doing</option>
                                    <option value="done">Done</option>
                                </select>
                                <select
                                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                >
                                    <option value="low">Low</option>
                                    <option value="mid">Mid</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        /* editing が false の時は情報を表示 */
                        <>
                            <h3 className="font-semibold break-words text-white">{task.title}</h3>
                            <p className="text-sm text-slate-300 mt-1 break-words">{task.description ?? ""}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-300">
                                    {task.status}
                                </span>
                                <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-300">
                                    {task.priority}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {/* 編集ボタンと保存ボタンの切り替え条件を修正 */}
                    {!editing ? (
                        <button
                            className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm text-white"
                            onClick={() => setEditing(true)}
                            disabled={loading}
                        >
                            編集
                        </button>
                    ) : (
                        <button
                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm text-white disabled:opacity-60"
                            onClick={save}
                            disabled={loading || !title}
                        >
                            保存
                        </button>
                    )}

                    <button
                        className="px-3 py-2 rounded-lg border border-rose-800 text-rose-200 hover:bg-rose-950 text-sm disabled:opacity-60"
                        onClick={remove}
                        disabled={loading}
                    >
                        削除
                    </button>
                    
                    {editing && (
                        <button
                            className="px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm text-white"
                            onClick={() => {
                                setEditing(false);
                                setTitle(task.title);
                                setDescription(task.description ?? "");
                                setStatus(task.status);
                                setPriority(task.priority);
                            }}
                            disabled={loading}
                        >
                            キャンセル
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}