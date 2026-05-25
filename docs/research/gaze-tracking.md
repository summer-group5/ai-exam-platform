# Gaze and Head Tracking Research Spike

**Objective:** Investigate browser-based tracking libraries (MediaPipe Face Landmarker vs. WebGazer.js) to evaluate technical feasibility for remote exam proctoring.

## Executive Summary
After local testing, exact screen-gaze tracking via consumer webcams is not production-ready for high-stakes exams. It generates too many false positives. **Recommendation:** Abandon exact X/Y screen tracking and use MediaPipe to track general Head Pose (Pitch, Yaw, Roll) to detect when a student physically turns away from the screen.

## Technical Comparison

| Feature | MediaPipe Face Landmarker | WebGazer.js |
| :--- | :--- | :--- |
| **Output Data** | 3D facial landmarks, head pose matrices, blendshapes | 2D X/Y screen coordinates |
| **Calibration** | None required (works instantly) | Tedious (requires clicking 10+ points) |
| **Lighting Tolerance** | High (maintains tracking in dim/backlit rooms) | Low (degrades rapidly in poor lighting) |
| **Posture Tolerance** | High (tracks at severe angles) | Zero (breaks if the user leans back) |
| **Stability** | Smooth, but may flicker if confidence drops | High continuous jitter |
| **Performance** | WebGL/GPU optimized (~60 FPS, low CPU) | CPU heavy (~15-20 FPS, high battery drain) |

## Key Findings

### 1. Does it detect face/gaze reliably?
* **WebGazer:** Unreliable for exams. The regression model breaks completely if the student adjusts their posture, leans back, or changes their lighting. The tracked X/Y coordinate is highly jittery, meaning a student looking at the edge of their screen might be falsely flagged as looking off-screen.

* **MediaPipe:** Highly reliable. The 3D mesh locks onto the face instantly and tolerates extreme angles. It will occasionally "flicker" if the AI confidence threshold drops due to motion blur or low light, meaning any cheating-detection logic must include a smoothing algorithm (e.g., ignore tracking drops under 2 seconds).

### 2. Is it usable during an exam?
Tracking exact gaze (WebGazer) is fundamentally incompatible with natural exam behavior. Students look away, stare into space to think, and shift in their seats. Relying on this will flood proctors with false positives. Tracking Head Pose (MediaPipe) is highly usable, as it accurately flags major infractions (e.g., turning 90 degrees to read a phone, or leaving the frame entirely).

### 3. Browser Permission Handling
Both rely on `navigator.mediaDevices.getUserMedia()`. The browser handles the exact UI overlay (e.g., "Allow this site to use your camera?"). If the user denies permission, the API promise rejects. **Crucial UX:** The application must display a pre-consent screen explaining *why* the camera is needed before invoking the browser prompt.

### 4. GDPR & Privacy Considerations
Implementing either library triggers strict GDPR requirements for biometric data processing:
* **Local Processing:** Both libraries run via WebAssembly (WASM) entirely in the browser. **No video frames need to be sent to a server.**
* **Data Minimization:** We should only transmit binary telemetry (e.g., `is_looking_away: true`) to the database, never the raw coordinate data or video feed.
* **Explicit Consent:** Students must provide unambiguous consent to automated tracking.
* **No Automated Failures:** Under GDPR Article 22, the system cannot automatically fail a student. It can only flag timestamps for a human proctor to review.

## Final Recommendation
**Proceed with MediaPipe Face Landmarker.** Implement a system that calculates Head Pose (Pitch/Yaw/Roll) to detect major head deviations. WebGazer and exact screen-coordinate tracking should be discarded from the project scope.