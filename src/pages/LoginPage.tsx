import { AuthForm } from "../components/AuthForm";

export function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <AuthForm />
        </div>
    );
}