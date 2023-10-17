import React, { useRef, useState } from 'react';
import hark from 'hark';
import getUserMedia from 'getusermedia';
function App() {
  const speechEventsRef = useRef(null);
  const averageDbRef = useRef(50);
  const dbArray = useRef([]);
  const intervalRef = useRef(null);
  const valueRef = useRef(null);
  let averageNotReachCount = 0;
  const [speaking, setSpeaking] = useState('');

const handleStart = ()=>{
 
getUserMedia(function(err, stream) {
    if (err) throw err
    
    const options = {
      interval: 50,
    };
    const speechEvents = hark(stream, options);
    speechEventsRef.current = speechEvents
  
    speechEvents.on('speaking', function() {
      setSpeaking('speaking')
      console.log('speaking');
    });
 
    speechEvents.on('stopped_speaking', function() {
      setSpeaking('stopped_speaking')
      console.log('stopped_speaking');
    });
    speechEvents.on('volume_change', function(value) {
      console.log(Math.abs(value));
      valueRef.current = Math.abs(value);
      if (averageDbRef.current < valueRef.current){
        console.log(valueRef.current,"notSpeaking");
        dbArray.current.push(valueRef.current)
      }
      else if (valueRef.current < (averageDbRef.current-30)) {
        console.log("speaking", valueRef.current);
      }
    })
    
    intervalRef.current = setInterval(function() {
      if(dbArray.current.length>0){
        averageNotReachCount = 0
        const sum = dbArray.current.reduce((accumulator, currentValue)=> accumulator + currentValue);
        averageDbRef.current = sum / dbArray.current.length;
        speechEventsRef.current.setThreshold(-(averageDbRef.current-30))
      }
      else if (averageNotReachCount==10){
        speechEventsRef.current.setThreshold(-(averageDbRef.current-30))
        averageDbRef.current = 0
      }
      else {
        averageNotReachCount = averageNotReachCount+1
      }
      dbArray.current = [];
    },1000)
  });
}

const handleStop = ()=>{
  clearInterval(intervalRef.current)
  speechEventsRef.current.stop()
  console.log('stoppped');
}
  // console.log(noise,1);
  return (
    <>
    <div>
      <button onClick={()=>{
        handleStart()
      }}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <div>
       <h1>{speaking}</h1> 
      </div>
    </div>
    </>
  );
}

export default App;


