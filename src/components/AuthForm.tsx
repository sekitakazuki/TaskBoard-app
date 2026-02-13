/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "login" | "signup";

export function AuthForm() {
    const [ mode,setMode ] = useState<Mode>("login");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            if (mode == "signup") {
                const {error} = await supabase.auth.signUp({email,password});
                if(error) throw error;
                setMessage("サインアップ完了。メール確認が必要な設定の場合は受信箱を確認してください。");
            } else {
                const {error} = await supabase.auth.signInWithPassword({email,password});
                if(error) throw error;
                setMessage("ログイン成功。");
            }
            
        } catch (err: any) {
            setMessage(err?.message ?? "認証に失敗しました。");
        } finally {
            setLoading(false);
        }
        };

        return (<div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h1 className="text-xl font-semibold mb-4 text-white">TaskBoard</h1> {/* タイトル修正 */}
            <div className="flex gap-2 mb-4">
                <button
                    className={`flex-1 px-3 py-2 rounded-lg text-sm border text-white ${ // flex-1 と text-white 追加
                        mode == "login" ? "bg-slate-800 border-slate-700" : "border-slate-800"
                    }`}
                    onClick = {()=> setMode("login")}
                    type="button"
                    >
                    ログイン
                </button>
                <button
                    className={`flex-1 px-3 py-2 rounded-lg text-sm border text-white ${ // flex-1 と text-white 追加
                        mode == "signup" ? "bg-slate-800 border-slate-700" :"border-slate-800"
                    }`}
                    onClick = {() => setMode("signup")}
                    type="button"
                    >サインアップ</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm text-slate-300">Email</label> {/* block 追加 */}
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none" // text-white 追加
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-300">Password</label> {/* block 追加 */}
                    <input
                        className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none" // text-white 追加
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="*******"
                        type="password"
                        autoComplete={mode == "signup" ? "new-password" : "current-password"}
                        required
                    />
                </div>
                
                <button
                    className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-60 transition-colors" // text-white, font-medium 追加
                    disabled={loading || !email || !password}
                    >
                        {loading ? "処理中..." : mode == "signup" ? "サインアップ" : "ログイン"}
                    </button>

                    {message && <p className="text-sm text-slate-300 mt-2">{message}</p>}
            </form>
        </div>
        );
    }