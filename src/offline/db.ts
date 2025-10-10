import { openDB, IDBDatabase } from "idb";
import { data } from "react-router-dom";

type DBSchema = {

    tasks:{key:string; value:any};
    outbox:{key:string; value:any};
    meta:{key:string; value:any};
}

let dbp: Promise<IDBDatabase<DBSchema>>;

export function db(){
    if(!dbp){
        dbp = openDB<DBSchema>("todo-pwa", 1){
            upgrade(d){
                d.createObjectStore("tasks", {keyPath:"_id"});
                d.createObjectStore("tasks", {keyPath:"_id"});
                d.createObjectStore("tasks", {keyPath:"_id"});
            }
        }
    }
    return dbp;
}

//Taraeas cache local

export async function cacheTasks(list:any) {
    const tx = (await db()).transaction("tasks", "readwrite");
    const store = tx.ObjectStore("tasks");

    //limpia y repuebla
    await store.clear()
    for(const t of list) await store.put(t);
    await tx.done;
}
export async function putTasjLocal(tasks:any) {
    await (await db()).put("tasks", tasks);
}
export async function getAllTaskLocal() {
    return (await (await db()).getAll("tasks")) || []
}
export async function removeTaskLocal(id:string) {
    await (await db()).delete("tasks",id);
}

export type OutboxOp = 
    {id:string; op: "create"; clieneteId:string; data:any; ts:number;}
    {id:string; op: "update"; serverId?:string; clienteId?:string; data:any; ts:number;}
    {id:string; op: "delete"; serverId?:string; clienteId?:string; ts:number;}
    

    export async function queue(op:OutboxOp) {
        await(await db()).put("outbox",op);
    }
    export async function getOutbox() {
        return (await( await db()).getAll("outbox")) || [];
    }

    export async function clearOutbox() {
        const tx = (await db()).transaction("outbox","readwrite");
        await tx.store.clear()
        await tx.done;
    }

    //mapeo de id clñiente a id servidor 

    export async function setMapping(clienteId:string, serverId:string ) {
        await (await db()).put("meta",{key:clienteId,serverId,serverId});
    }
    export async function getMapping(clienteId:string) {
        return (await (await db()).get("meta",clienteId))?.serverId as string | undefined;
    }