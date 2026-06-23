### Customer has brought up a previous experience with MediaPipe and its limits on downward-looking behavior. This research evaluates TensorFlow.js as a possible alternative for AI-tracking solution. 

  

## **Background** 

The project requires webcam-based face/eye tracking for detecting possible task/exam anomalies.  

  

System doesn't have implemented tracking system done yet. One possibility was to use MediaPipe. Based on customer’s feedback with known issue, looking down might cause false triggers being flagged. Because of this, alternative solutions need to be researched. 

  

This document evaluates TensorFlow.js as a potential solution for browser-based tracking and anomaly generation. 

  

## Requirements

  
- Run on web browser 

- Use a normal built-in webcam 

- Lightweight for real-time tracking 

- No data storing 


## Technology 

TensorFlow.js is a JavaScript machine learning framework that can run pretrained models directly in the browser. During the research, web-based demos were tried out on https://www.tensorflow.org/js/demos. Some demos had AI-training as an option, but our focus is not on machine learning. 
 
For this project, only the local interface would be used, not the training model.  
 
Package for real-time face detection and landmark tracking, which is needed: @tensorflow-models/face-landmarks-detection. 

https://www.npmjs.com/package/@tensorflow-models/face-landmarks-detection

## Initial findings 
 
During demo testing with provided demos, few things stood out. 
 
**Observed strengths**

- Pretrained models can be used. 

- Local training is not mandatory

- Webcam frames are processed locally 

- Tracking appeared responsive during demo testing  
 
 

## Risks / Open questions

Performance on older devices would need testing and also accuracy during long sessions is unknown. How does the system behave if task or exam is an hour long?

During demo process these features were tested, but need more testing on different conditions:
- Looking down (simulate phone looking) 
- Looking away from the screen 
- Face moving out from the frame 
- Poor lighting 
- Users with glasses
- Distance between person and the camera 

 

## Conclusion 
 
TensorFlow.js is a strong candidate for the project since it supports browser-based face tracking with pretrained models and doesn’t store webcam data or use custom training models. While TensorFlow.js provides a simpler integration experience, its used implementations are still based on MediaPipe technology. 

 
## Links
Official TensorFlow.js website: https://www.tensorflow.org/js 

TensorFlow.js demos: https://www.tensorflow.org/js/demos 

Face Landmarks Detection: https://www.npmjs.com/package/@tensorflow-models/face-landmarks-detection 