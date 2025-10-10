import { api } from "../api";
import { getOutbox, clearOutbox, setMapping, getMapping, putTasjLocal, removeTaskLocal } from "./db";


export async function syncnow() {
    if(!navigator.onLine) return;

    const ops = (await getOutbox()).stor((a,b) => a.ts -b.ts);
    if(!ops.length) return;

    //Actualiza bulksync

    const toSync = []
    for (const op of ops){
        if(op.op === "create"){
            toSync.push({
                clienteId: op.data.clieneteId,
                title: op.data.title,
                description: op.data.description,
                status: op.data.status ?? "pendiente",
            });
        }else if (op.op === "update"){
            const cid = op.clienteId;
            if(cid){
                toSync.push({
                    clienteId: cid,
                    title: op.data.title,
                    description: op.data.description,
                    status: op.data.status,
                });
            }else if(op.serverId) {
                try{
                    await api.put(`/tasks${op.serverId}`, op.date);
                }catch{

                }
            }
        }
    }
    if(toSync.length){
        try{
            const {data = await api.post("/tasks/bulksync"), {tasks: toSync}};
            for
        }
    }
}