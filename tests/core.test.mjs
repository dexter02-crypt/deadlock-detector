import test from "node:test";import assert from "node:assert/strict";
import {validateGraph,findCycle,analyze,waitForGraph} from "../src/core.js";
const dead={processes:["P1","P2"],resources:["R1","R2"],edges:[{type:"assignment",from:"R1",to:"P1"},{type:"request",from:"P1",to:"R2"},{type:"assignment",from:"R2",to:"P2"},{type:"request",from:"P2",to:"R1"}]};
test("cycle is detected and closes on itself",()=>{const c=findCycle(dead);assert.ok(c);assert.equal(c[0],c.at(-1))});
test("safe graph has no cycle",()=>assert.equal(findCycle({processes:["P1"],resources:["R1"],edges:[{type:"request",from:"P1",to:"R1"}]}),null));
test("analysis flag agrees with cycle",()=>assert.equal(analyze(dead).deadlocked,true));
test("wait-for graph maps requester to current owner",()=>assert.deepEqual(waitForGraph(dead).sort(),[["P1","P2"],["P2","P1"]]));
test("validator returns independent structures",()=>{const v=validateGraph(dead);v.edges[0].from="X";assert.equal(dead.edges[0].from,"R1")});
test("invalid edge direction rejected",()=>assert.throws(()=>validateGraph({processes:["P1"],resources:["R1"],edges:[{type:"request",from:"R1",to:"P1"}]})));
