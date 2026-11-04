import { cancel, registerClips } from '@bestie/core';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { challengePack, revealId } from '@/content/hostChallenge';
import { challengeScore, initialChallenge, lockGuess, nextQuestion } from '@/game/hostChallenge';
import { BigCard, Body, Button, Card, Chip, H1, H2, HostLine, Label, Row, Screen, useHost } from '@/ui/kit';
import { colors, fonts } from '@/ui/theme';

export default function Hosts() {
 const [pack]=useState(challengePack);
 const [started,setStarted]=useState(false);
 const [state,setState]=useState(initialChallenge);
 const [selected,setSelected]=useState<number|null>(null);
 const [exit,setExit]=useState(false);
 const q=pack.questions[state.index];
 const score=challengeScore(state,pack.questions);
 const clip=started && state.phase==='reveal' && !pack.demo ? revealId(q):null;
 useEffect(()=>{if(!pack.demo)registerClips(pack.questions.map(q=>({id:revealId(q),text:q.reveal,asset:q.asset})));return ()=>cancel();},[pack]);
 useHost(clip);
 const leave=()=>{cancel();router.replace('/');};
 const advance=()=>{cancel();setSelected(null);setState(s=>nextQuestion(s,pack.questions.length));};
 if(!started) return <Screen>
   <Label>THE HOST CHALLENGE</Label><H1>{'Your room.\nTheir challenge.'}</H1>
   <Image source={require('../assets/mess-around-cover.jpeg')} resizeMode="contain" style={{width:180,height:180,borderRadius:20,alignSelf:'center'}} accessibilityLabel="Hannah and Lamorne, The Mess Around"/>
   <H2>Play against Hannah & Lamorne</H2>
   <Body>You’re one team. Agree on an answer and lock it in. Get it right: your team scores. Get it wrong: the hosts score. Best of five wins.</Body>
   <Card tint={colors.goldSoft}><Label>{pack.demo?'SAMPLE ROUND · NOT HOST ANSWERS':'RECORDED HOST ROUND'}</Label><Body>{pack.demo?'Try the format with five sample puzzles. These are not Hannah or Lamorne’s answers, stories, or recordings. Their real round will unlock when approved recordings are added.':'Guess their answers, then hear the real reveal. No live connection or microphone needed.'}</Body></Card>
   <Button title={pack.demo?'Try the sample round →':'Take on the hosts →'} onPress={()=>setStarted(true)}/>
   <Body muted>One phone · Solo or as a group · No names needed</Body><Button title="Back to games" kind="ghost" onPress={leave}/>
 </Screen>;
 return <Screen>
   <Row><View style={{flex:1}}><Label>{pack.demo?'SAMPLE HOST CHALLENGE':'HANNAH + LAMORNE VS YOU'}</Label></View><Button title="Exit" kind="ghost" onPress={()=>setExit(true)}/></Row>
   {exit?<Card tint={colors.goldSoft}><H2>Leave this round?</H2><Body>This challenge’s scores will reset. Your other game is unchanged.</Body><Button title="Keep playing" onPress={()=>setExit(false)}/><Button title="Leave round" kind="ghost" onPress={leave}/></Card>:null}
   <Row><Card style={{flex:1}}><Label>YOUR TEAM</Label><Text style={{fontFamily:fonts.bold,fontSize:40,color:colors.accent}}>{score.group}</Text></Card><Card style={{flex:1}}><Label>{pack.demo?'DEMO HOSTS':'THE HOSTS'}</Label><Text style={{fontFamily:fonts.bold,fontSize:40,color:colors.ink}}>{score.hosts}</Text></Card></Row>
   {state.phase==='finished'?<>
    <H1>{score.group>score.hosts?'You took the round!':'The hosts take this one.'}</H1>
    <Body>{`${score.group}–${score.hosts}. ${pack.demo?'Sample round complete. Next: the real hosts’ answers.':'Five questions. One very opinionated room.'}`}</Body>
    <Card><Label>YOUR ROUND</Label>{pack.questions.map((item,i)=><Body key={item.id} style={{marginTop:8}}>{`${i+1}. ${state.guesses[i]===item.answer?'Correct':'Missed'} · ${item.options[item.answer]}`}</Body>)}</Card>
    <Button title={pack.demo?'Replay the same sample':'Play this pack again'} onPress={()=>{cancel();setState(initialChallenge());setSelected(null);}}/><Button title="Back to games" kind="secondary" onPress={leave}/>
   </>:<>
    <Label>{`QUESTION ${state.index+1} / ${pack.questions.length} · ${pack.demo?'DEMO':q.host.toUpperCase()}`}</Label>
    <BigCard label={pack.demo?'SAMPLE PUZZLE':`${q.host.toUpperCase()} CHALLENGES YOU`}>{q.question}</BigCard>
    {state.phase==='guess'?<>
      <Body muted>Talk it over. Choose one answer for your team.</Body>
      <View style={{gap:10}}>{q.options.map((option,i)=><Chip key={option} label={`${String.fromCharCode(65+i)}. ${option}`} selected={selected===i} onPress={()=>setSelected(i)}/>)}</View>
      <Button title="Lock in our answer" disabled={selected===null} onPress={()=>{if(selected!==null)setState(s=>lockGuess(s,selected,pack.questions));}}/>
    </>:<>
      <Card tint={state.guesses[state.index]===q.answer?colors.goodSoft:colors.coralSoft}>
        <Label>{state.guesses[state.index]===q.answer?'YOUR TEAM +1':'HOSTS +1'}</Label><H2>{q.options[q.answer]}</H2>
        <Body muted>{`You chose: ${q.options[state.guesses[state.index]]}`}</Body>
      </Card>
      {pack.demo?<Card><Label>SAMPLE EXPLANATION · NO HOST AUDIO</Label><Body>{q.reveal}</Body></Card>:clip?<HostLine clipId={clip}/>:null}
      <Button title={state.index===pack.questions.length-1?'See the final score':'Next challenge →'} onPress={advance}/>
    </>}
   </>}
 </Screen>;
}
