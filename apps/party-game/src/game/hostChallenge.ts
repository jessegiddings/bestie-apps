import type { HostQuestion } from '@/content/hostChallenge';
export interface ChallengeState { index:number; phase:'guess'|'reveal'|'finished'; guesses:number[] }
export const initialChallenge = (): ChallengeState => ({index:0,phase:'guess',guesses:[]});
export function lockGuess(s:ChallengeState, guess:number, questions:readonly HostQuestion[]):ChallengeState {
 const q=questions[s.index];
 if(s.phase!=='guess'||!q||!Number.isInteger(guess)||guess<0||guess>=q.options.length) return s;
 return {...s,phase:'reveal',guesses:[...s.guesses,guess]};
}
export function nextQuestion(s:ChallengeState,total:number):ChallengeState {
 if(s.phase!=='reveal') return s;
 return s.index+1>=total?{...s,phase:'finished'}:{...s,index:s.index+1,phase:'guess'};
}
export function challengeScore(s:ChallengeState,questions:readonly HostQuestion[]) {
 const group=s.guesses.reduce((n,g,i)=>n+(g===questions[i]?.answer?1:0),0);
 return {group,hosts:s.guesses.length-group};
}
