export function validateGraph(graph){
 if(!graph||!Array.isArray(graph.processes)||!Array.isArray(graph.resources)||!Array.isArray(graph.edges))throw new Error("graph");
 const P=new Set(graph.processes),R=new Set(graph.resources);
 if(P.size!==graph.processes.length||R.size!==graph.resources.length||[...P].some(x=>R.has(x)))throw new Error("names");
 for(const e of graph.edges){if(!e||!["request","assignment"].includes(e.type))throw new Error("edge");if(e.type==="request"&&(!P.has(e.from)||!R.has(e.to)))throw new Error("request");if(e.type==="assignment"&&(!R.has(e.from)||!P.has(e.to)))throw new Error("assignment")}
 return {processes:[...graph.processes],resources:[...graph.resources],edges:graph.edges.map(e=>({...e}))}
}
export function adjacency(graph){graph=validateGraph(graph);const a=new Map([...graph.processes,...graph.resources].map(x=>[x,[]]));for(const e of graph.edges)a.get(e.from).push(e.to);for(const v of a.values())v.sort();return a}
export function findCycle(graph){
 const a=adjacency(graph),state=new Map(),stack=[],index=new Map();
 function dfs(v){state.set(v,1);index.set(v,stack.length);stack.push(v);for(const w of a.get(v)){if(state.get(w)===1){return [...stack.slice(index.get(w)),w]}if(!state.get(w)){const c=dfs(w);if(c)return c}}stack.pop();index.delete(v);state.set(v,2);return null}
 for(const v of a.keys()){if(!state.get(v)){const c=dfs(v);if(c)return c}}return null
}
export function analyze(graph){const cycle=findCycle(graph);return {deadlocked:!!cycle,cycle}}
export function waitForGraph(graph){graph=validateGraph(graph);const owner=new Map();for(const e of graph.edges)if(e.type==="assignment")owner.set(e.from,e.to);const edges=[];for(const e of graph.edges)if(e.type==="request"&&owner.has(e.to))edges.push([e.from,owner.get(e.to)]);return edges}
