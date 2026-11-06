import {challengePack, DEMO_QUESTIONS, validQuestion} from '@/content/hostChallenge';
import {challengeScore,initialChallenge,lockGuess,nextQuestion} from './hostChallenge';
it('uses clearly separate samples until five approved recordings exist',()=>{
 expect(challengePack().demo).toBe(true);
 const ready=DEMO_QUESTIONS.map(q=>({...q,approved:true,asset:1}));
 expect(challengePack(ready).demo).toBe(false);
 expect(challengePack(ready.slice(0,4)).demo).toBe(true);
 expect(challengePack(ready.map(q=>({...q,asset:null}))).demo).toBe(true);
 expect(challengePack(ready.map(q=>({...q,id:'duplicate'}))).demo).toBe(true);
});
it('validates answer bounds',()=>expect(validQuestion({...DEMO_QUESTIONS[0],answer:99})).toBe(false));
it('locks answers and scores each question once',()=>{
 const s=lockGuess(initialChallenge(),1,DEMO_QUESTIONS);
 expect(lockGuess(s,0,DEMO_QUESTIONS)).toBe(s);
 expect(challengeScore(s,DEMO_QUESTIONS)).toEqual({group:1,hosts:0});
 expect(lockGuess(initialChallenge(),-1,DEMO_QUESTIONS).phase).toBe('guess');
});
it('plays a full five-question round with a clear winner',()=>{
 let s=initialChallenge();
 DEMO_QUESTIONS.forEach((q,i)=>{s=lockGuess(s,i<3?q.answer:(q.answer+1)%q.options.length,DEMO_QUESTIONS);s=nextQuestion(s,5);});
 expect(s.phase).toBe('finished');expect(challengeScore(s,DEMO_QUESTIONS)).toEqual({group:3,hosts:2});
 expect(nextQuestion(s,5)).toBe(s);
});
