import { Task } from "@mui/icons-material";

export type TaskStatus = "todo" | "doing" | "done" ;
export type TaskPriority = "low" | "mid" | "high" ;

export type Task ={
    id: string;
    user_id:string;
    title:string;
    description: string| null;
    status: TaskStatus;
    priority: TaskPriority;
    created_at:string;
    updated_at:string;
};

export type TaskInsert = {
    title:string;
    description?: string;
    status:TaskStatus;
    priority:TaskPriority;
};

export type TaskUpdate = Partial<TaskInsert>;