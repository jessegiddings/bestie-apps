import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { NIGHT_ORDER, type GameId } from '@/game/night';
import { useParty } from '@/state/store';
import { Body, Button, Card, Chip, Label, Row, Screen } from '@/ui/kit';
import { GameArt, GAME_LOOK } from '@/ui/GameArt';
import { colors, fonts } from '@/ui/theme';

export default function Home() {
 const st=useParty(); const muted=useVoice(s=>s.muted);
 const [count,setCount]=useState(Math.max(3,st.players.length));
 const [replace,setReplace]=useState<{game?:GameId}|null>(null);
 const active=st.night && st.night.phase!=='crowned';
 const begin=(game?:GameId)=>{st.quickStart(count,game);setReplace(null);router.push('/night');};
 const go=(game?:GameId)=>active?setReplace({game}):begin(game);
 return <Screen>
  <Row><View style={{flex:1}}><Label color={colors.ink}>A LITTLE CHAOS. GREAT COMPANY.</Label></View><Pressable accessibilityRole="switch" accessibilityLabel="Host sound" accessibilityState={{checked:!muted}} onPress={()=>setMuted(!muted)} style={{minHeight:44,justifyContent:'center'}}><Text style={{fontFamily:fonts.bold,color:colors.accent,fontSize:11}}>{muted?'SOUND OFF':'SOUND ON'}</Text></Pressable></Row>
  <View style={{gap:14}}>
   <Text accessibilityRole="header" style={{fontFamily:fonts.bold,fontSize:58,lineHeight:56,letterSpacing:-3,color:colors.ink}}>THE MESS<Text style={{color:colors.accent}}>{'\nAROUND.'}</Text></Text>
   <Row><View style={{backgroundColor:colors.lime,borderRadius:20,paddingHorizontal:12,paddingVertical:8,transform:[{rotate:'-2deg'}]}}><Text style={{fontFamily:fonts.bold,fontSize:11,color:colors.ink}}>WITH HANNAH + LAMORNE</Text></View></Row>
   <Body muted>One phone. Your favorite people. Absolutely no dignity required.</Body>
  </View>
  {active?<Button title="Continue playing →" onPress={()=>router.push('/night')}/>:null}
  <View style={{backgroundColor:colors.ink,borderRadius:24,padding:20,gap:16}}>
   <Row><View style={{flex:1,gap:4}}><Label color="#FFD85B">QUICK PLAY</Label><Text style={{fontFamily:fonts.bold,fontSize:20,color:'white'}}>How many of you?</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Fewer players" disabled={count<=3} onPress={()=>setCount(count-1)} style={{padding:12}}><Text style={{color:count<=3?'#81766D':'white',fontSize:26}}>−</Text></Pressable><Text accessibilityLiveRegion="polite" style={{color:'white',fontFamily:fonts.bold,fontSize:28}}>{count}</Text><Pressable accessibilityRole="button" accessibilityLabel="More players" disabled={count>=10} onPress={()=>setCount(count+1)} style={{padding:12}}><Text style={{color:count>=10?'#81766D':'white',fontSize:26}}>+</Text></Pressable></Row>
   <Pressable accessibilityRole="button" onPress={()=>go('point-blank')} style={({pressed})=>({backgroundColor:colors.lime,borderRadius:16,padding:18,opacity:pressed?.8:1})}><Text style={{fontFamily:fonts.bold,fontSize:18,color:colors.ink,textAlign:'center'}}>Let’s mess around  →</Text></Pressable>
   <Text style={{color:'#D8CEC4',fontFamily:fonts.body,fontSize:12,textAlign:'center'}}>Starts with Point Blank · No names needed</Text>
  </View>
  {replace?<Card tint={colors.goldSoft}><Body>Start fresh? This replaces your current scores.</Body><Button title="Start fresh" onPress={()=>begin(replace.game)}/><Button title="Keep playing" kind="ghost" onPress={()=>setReplace(null)}/></Card>:null}
  <Row><View style={{flex:1}}><Label>FIVE WAYS TO MAKE A SCENE</Label></View><Pressable accessibilityRole="button" onPress={()=>router.push('/players')} style={{paddingVertical:12}}><Text style={{fontFamily:fonts.bold,color:colors.accent,fontSize:12}}>Add names ↗</Text></Pressable></Row>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{NIGHT_ORDER.map((g,i)=><Pressable key={g} accessibilityRole="button" accessibilityLabel={`Play ${GAME_LOOK[g].short.replace('\n',' ')}`} onPress={()=>go(g)} style={({pressed})=>({width:i===4?'100%':'48%',flexGrow:1,backgroundColor:GAME_LOOK[g].color,borderRadius:22,padding:18,minHeight:i===4?140:230,opacity:pressed?.8:1,overflow:'hidden'})}>
    <View style={{flexDirection:i===4?'row':'column',alignItems:i===4?'center':'flex-start',gap:8}}><View style={{flex:1,gap:8}}><Text style={{fontFamily:fonts.bold,fontSize:10,color:colors.ink}}>0{i+1} / {i===0?'START HERE':'PLAY'}</Text><Text style={{fontFamily:fonts.bold,fontSize:27,lineHeight:29,letterSpacing:-1,color:colors.ink}}>{GAME_LOOK[g].short}</Text></View><View style={{alignSelf:'flex-end'}}><GameArt game={g} size={94}/></View></View>
   </Pressable>)}</View>
  <Button title="Play all five · The full mess →" kind="secondary" onPress={()=>go()}/>
  <Row><View style={{flex:1,gap:4}}><Label>YOUR CROWD</Label><Body muted style={{fontSize:12}}>Family is free. Friends gets cheekier.</Body></View></Row>
  <Row><Chip label="Family" selected={st.deck==='family'} onPress={()=>st.setDeck('family')}/><Chip label={st.isVip()?'Friends':'Friends · VIP'} selected={st.deck==='friends'} onPress={()=>st.isVip()?st.setDeck('friends'):router.push('/premium')}/></Row>
  <Body muted style={{fontSize:11,textAlign:'center'}}>HOST RECORDINGS COMING SOON · SCRIPT PREVIEW</Body>
 </Screen>;
}
