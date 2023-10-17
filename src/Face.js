import {useRef,useEffect} from 'react';
import './App.css';
import * as faceapi from 'face-api.js';

function Face(){
  const videoRef = useRef()
  const canvasRef = useRef()

  
  useEffect(()=>{
    const loadModels = ()=>{
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models")
    
          ]).then(()=>{
          startVideo()
        })
      }
// loadModels()
  },[])

  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true })
    .then((currentStream)=>{
      videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const handleVideoPlay = ()=>{
    setInterval(async()=>{
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()

        // console.log(detections);

        if(detections.length>0){
            // console.log(detections[0].landmarks.positions);
            const mouth = detections[0].landmarks.getMouth()
            console.log(mouth);
        }
      

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current,{
        width:720,
        height:560
      })

      const resized = faceapi.resizeResults(detections,{
         width:720,
        height:560
      })
    //   faceapi.draw.drawDetections(canvasRef.current,resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
    //   faceapi.draw.drawFaceExpressions(canvasRef.current,resized)


    },100)
  }

  return (
    <div>
    <h1>FAce Detection</h1>
      <div className='webCam'> 
      <video ref={videoRef} height={"560"} width={"720"} autoPlay muted onPlay={handleVideoPlay}></video>
      <canvas ref={canvasRef} className='canvasDraw' />
      </div>
      
    </div>
    )

}

export default Face;