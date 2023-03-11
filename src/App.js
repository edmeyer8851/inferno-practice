import { useEffect, useState } from 'react';
import './App.css'
import styled from 'styled-components'
import  On_Mage from './images/On_Mage.png';
import  On_Melee from './images/On_Melee.png';
import  On_Range from './images/On_Range.png';
import  Off_Melee from './images/Off_Melee.png';
import  Off_Range from './images/Off_Range.png';
import  Off_Mage from './images/Off_Mage.png';
import Blob from './images/blob.png'
import Ranger from './images/ranger.png'
import { click } from '@testing-library/user-event/dist/click';
import { useInterval } from './useInterval';

function App() {

  const sound = "//daveceddia.com/freebies/react-metronome/click1.wav"
  const click1 = new Audio(sound)
  click1.volume = 0.1
  
  const [timer, setTimer] = useState(-2)
  const [started, setStarted] = useState(false)
  const [currentHP, setCurrentHP] = useState(99)
  const [currentPrayer, setCurrentPrayer] = useState("")
  const [blobAttackStyle, setBlobAttackStyle] = useState('range')
  const [blobDetecting, setBlobDetecting] = useState(false)
  const [blobBackground, setBlobBackground] = useState('transparent')
  const [rangerBackground, setRangerBackground] = useState('transparent')
  const [personalBest, setPersonalBest] = useState(0)
  const [metronomeMuted, setMetronomeMuted] = useState(false)
  const [hideBlobDetecting, setHideBlobDetecting] = useState(false)
  const [damageMessages, setDamageMessages] = useState([])


  const TICK_RATE = 600
  
  useInterval(() => {
    if (started){
      setTimer(timer => timer + 1)
    }
  }, TICK_RATE)

  useEffect(() => {
    if (started) {
      if (!metronomeMuted) playClick()
      setBlobDetecting(false)
      setBlobBackground('transparent')
      setRangerBackground('transparent')
      if (timer%4 === 0){
        rangerAttack()
      } 
      if (timer%6 === 0) {
        blobAttack()
      } 
      if (timer!=0 && timer%3 === 0 && timer%6 != 0){
        if (!hideBlobDetecting) setBlobDetecting(!blobDetecting)
        blobDetectPrayer()
      }
    }
  }, [timer])

  const handlePrayerCLick = e => {
    if (!currentPrayer || (currentPrayer && currentPrayer!==e.target.id)) {
      setCurrentPrayer(e.target.id)
    } else if (currentPrayer === e.target.id) {
      setCurrentPrayer('')
    }
  }

  const playClick = () => {
    click1.play()
  }

  const rangerAttack = () => {
    setRangerBackground('red')
    if (currentPrayer === 'range') return
    setCurrentHP(currentHP => currentHP - 10)
  }

  const blobAttack = () => {
    setBlobBackground('red')
    if (currentPrayer === blobAttackStyle) return
    setCurrentHP(currentHP => currentHP - 10)
  }

  const blobDetectPrayer = () => {
    switch (currentPrayer) {
      case 'mage':
        setBlobAttackStyle('range')
        break;
      case 'range':
        setBlobAttackStyle('mage')
        break;
      case '':
        setBlobAttackStyle('range')
        break;
    }
  }

  const setDefaults = () => {
    if (timer > personalBest) setPersonalBest(timer)
    setTimer(-2)
    setStarted(false)
    setCurrentPrayer('')
    setBlobAttackStyle('range')
    setBlobBackground('transparent')
    setRangerBackground('transparent')
    setBlobDetecting(false)
    setCurrentHP(99)
  }

  if (currentHP < 0) {
    if (timer > personalBest) {setPersonalBest(timer)}
    setDefaults()
  }
  
  return (
    <Container className="container">
      <h1>{`Current HP: ${currentHP}`}</h1>
      <MobsContainer>
        <MobContainer style={{backgroundColor: blobBackground}}>
          <p style={{visibility: blobDetecting ? '' : 'hidden'}}>Detecting prayer...</p>
          <img id='blob' src={Blob}></img>
        </MobContainer>
        <MobContainer style={{backgroundColor: rangerBackground}}>
          <img id='ranger' src={Ranger}></img>
        </MobContainer>
      </MobsContainer>
      <PrayerContainer>
        <img id='mage' 
          src={currentPrayer === 'mage' ? On_Mage : Off_Mage} 
          alt='mage'
          onClick={handlePrayerCLick}
        ></img>
        <img id='range' 
          src={currentPrayer === 'range' ? On_Range : Off_Range}
          alt='range'
          onClick={handlePrayerCLick}
        ></img>
        <img id='melee' 
          src={currentPrayer === 'melee' ? On_Melee : Off_Melee}
          alt='melee'
          onClick={handlePrayerCLick}
        ></img>
      </PrayerContainer>
      <ButtonContainer>
        <StartButton id='button' onClick={() => setStarted(!started)}>{started ? "Pause" : "Start"}</StartButton>
        <ResetButton id='button' 
          onClick={setDefaults}>Reset</ResetButton>
      </ButtonContainer>
      <TextContainer>
        <p>{`Ticks Alive: ${timer}`}</p>
        <p>{`Personal Best: ${personalBest} ticks`}</p>
        <p>First attack from both is always on tick 0. Pray ranged before clicking start.</p>
      </TextContainer>
      <CheckboxContainer>
        <label htmlFor='muteMetronome'>Mute Metronome</label>
        <input id="muteMetonome" type='checkbox' checked={metronomeMuted} onChange={e => setMetronomeMuted(e.currentTarget.checked)}></input>
      </CheckboxContainer>
      <CheckboxContainer>
        <label htmlFor='hideBlobDetecting'>Hide Blob Detecting Prayer</label>
        <input id="hideBlobDetecting" type='checkbox' checked={hideBlobDetecting} onChange={e => setHideBlobDetecting(e.currentTarget.checked)}></input>
      </CheckboxContainer>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding-top: 50px;
    color: #ffff00;
    background: #414141;
`

const PrayerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  padding-top:25px;
  padding-bottom: 15px;
`
const MobsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 70px; 
`
const MobContainer = styled.div`
  background: red;
  width: fit-content
`

const ButtonContainer = styled.div`
  display:flex;
  margin-top:10px;
`

const StartButton = styled.button`
  background: black;
  border: none;
  height: 50px;
  border-radius: 25px;
  width: 100px;
  color: #ffff00;
  font-size: 20px;
`
const ResetButton = styled.button`
  background: black;
  margin-left: 10px;
  border: none;
  height: 50px;
  border-radius: 25px;
  width: 100px;
  color: #ffff00;
  font-size: 20px;
`

const TextContainer = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
  align-items: center;
`

const CheckboxContainer = styled.div`
  display: flex
`

export default App;
