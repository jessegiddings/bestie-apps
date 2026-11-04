import { demoFor } from './demoVoices';
import type { Clip } from '@bestie/core';
export type Host = 'Hannah' | 'Lamorne';
export interface HostQuestion {
 id: string; host: Host; question: string; options: readonly string[];
 answer: number; reveal: string; approved: boolean; asset: Clip['asset'];
}
/** Only host-reviewed content belongs here. Never infer personal answers. */
export const RECORDED_QUESTIONS: readonly HostQuestion[] = [];
/** Mechanics-only sample puzzles. Not the hosts’ personal answers or words. */
export const DEMO_QUESTIONS: readonly HostQuestion[] = [
 {id:'demo-1',host:'Hannah',question:'You overtake the person in second place. What place are you in?',options:['First','Second','Third'],answer:1,reveal:'Second. You took their place; the person in first is still ahead.',approved:false,asset:null},
 {id:'demo-2',host:'Lamorne',question:'How many months have at least 28 days?',options:['One','Eleven','Twelve'],answer:2,reveal:'All twelve months have at least 28 days.',approved:false,asset:null},
 {id:'demo-3',host:'Hannah',question:'Which weighs more: a kilogram of feathers or a kilogram of bricks?',options:['Feathers','Bricks','They weigh the same'],answer:2,reveal:'They weigh the same. Both are one kilogram.',approved:false,asset:null},
 {id:'demo-4',host:'Lamorne',question:'Two parents each have four daughters. They are one family, and each daughter has one brother. How many children are there?',options:['Five','Eight','Ten'],answer:0,reveal:'Five children: four daughters and their one shared brother.',approved:false,asset:null},
 {id:'demo-5',host:'Hannah',question:'A farmer has 17 sheep. All but nine leave. How many remain?',options:['Eight','Nine','Seventeen'],answer:1,reveal:'Nine remain. “All but nine” means nine stayed.',approved:false,asset:null},
];
export function validQuestion(q: HostQuestion): boolean {
 return Boolean(q.id && q.question.trim() && q.reveal.trim()) && q.options.length >= 2 && q.options.every(o=>o.trim()) && new Set(q.options).size === q.options.length && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length;
}
export function challengePack(source: readonly HostQuestion[] = RECORDED_QUESTIONS) {
 const ids = new Set<string>();
 const ready = source.filter(q=>{if(!q.approved || q.asset == null || !validQuestion(q) || ids.has(q.id)) return false; ids.add(q.id); return true;});
 return ready.length >= 5 ? {demo:false,questions:ready.slice(0,5)} : {demo:true,questions:DEMO_QUESTIONS.map(q=>({...q, asset:demoFor(`challenge-${q.id}`)?.asset ?? null, reveal:demoFor(`challenge-${q.id}`)?.text ?? q.reveal}))};
}
export const revealId = (q: HostQuestion) => `challenge-${q.id}-${q.host.toLowerCase()}`;
