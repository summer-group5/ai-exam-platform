# Browser extensions detection research spike #25

# Overview

In online exams, one common concern is whether students can use browser extensions (like AI tools, screen sharing plugins, or auto-answer tools) to cheat.
I looked into this topic in detail to understand what is actually possible in a real browser environment when it comes to detecting or blocking these extensions. This document explains what I found in a simple and practical way.

1. Can a web app detect which extensions are installed?

The simple and honest answer of this question is No. 
A normal web application using JavaScript cannot see which extensions are installed in a user’s browser. This is mainly because modern browsers like Chrome, Firefox, and Edge are built with strong security and privacy protections. There is no API that allows a website to list installed extensions, and each extension runs in its own isolated environment so it cannot be accessed by web pages. In addition, websites are not allowed to interact with or inspect browser internals. This is an intentional design choice, since allowing websites to view installed extensions would create serious privacy risks for users.

Some developers have tried workarounds to detect extensions indirectly, for example by checking whether a specific extension is installed through its exposed resources. One common idea is to attempt loading a file from a known extension using its internal URL and then observing whether it succeeds or fails.

For example:
function detectExtension(extensionId, file) {
  const img = new Image();

  img.src = `chrome-extension://${extensionId}/${file}`;

  img.onload = () => {
    console.log("Extension detected");
  };

  img.onerror = () => {
    console.log("Extension not detected");
  };
}

However, in practice this approach is very limited and unreliable. It requires knowing the exact extension ID in advance, which is not realistic in real-world scenarios. Most extensions also do not expose any accessible files, and modern browsers often restrict or block this type of access for security reasons. Even when it works in some cases, it can be easily bypassed or broken by simple changes in the extension. Because of these limitations, this method is not suitable for real exam systems and cannot be relied on for detecting installed extensions.


2. Can a web app disable or block extensions?

No. A website has no control over browser extensions. Extensions run with higher privileges than normal web pages, which means they operate outside the reach of JavaScript running in the browser. Only the user, or the browser’s own settings, can enable or disable them. Because of this security design, JavaScript cannot block, modify, or override how extensions work. So if a student has an extension installed, the exam website cannot turn it off or interfere with it in any way.


3. Can Extensions Be Detected Indirectly?
It is only partially possible to detect extension-related activity, and even then it is not guaranteed. Since browser extensions cannot be accessed directly, the system can only observe their possible effects on the page or user behavior.
For example, unusual changes in the webpage structure, unexpected injected elements, copy or paste actions, frequent switching between tabs, or the user losing focus from the exam window can all be treated as potential signals.

Example: Detecting DOM changes:

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      console.log("Possible external modification detected");
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

These indicators do not clearly prove that an extension is being used, they only suggest that something unusual might be happening. There are also clear limitations, since not all extensions modify the page, some are designed to stay completely hidden, and normal user behavior can sometimes be incorrectly flagged. Because of this, the approach can be useful for monitoring, but it is not fully reliable for detection.



4. Can the System Flag Suspicious Activity?

Yes, this is considered the most practical approach. Instead of trying to directly detect browser extensions, which is not possible in a reliable way, the system focuses on monitoring user behavior and flagging anything that looks unusual during the exam. For example, it can track actions such as a user switching tabs multiple times, the browser window losing focus, copy and paste activity during restricted parts of the exam, or the user exiting fullscreen mode. These signals do not prove cheating, but they help identify suspicious behavior that may need further review.

Example: Focus detection:

window.addEventListener("blur", () => {
  console.log("User left the exam window");
});

window.addEventListener("focus", () => {
  console.log("User returned to the exam");
});

These signals can be combined into a risk score and used to flag users for review.


5. Alternative Solutions

Because browsers have strict security limitations, it is not really possible to fully control or detect extensions from a normal web application. For this reason, other approaches are commonly used in online exam systems.

5.1 Lockdown Browsers

Some exam platforms use special lockdown browsers such as Safe Exam Browser (SEB) and Respondus LockDown Browser. These tools are designed specifically for secure exams and provide much stronger control over the testing environment. They can help disable browser extensions, restrict navigation to other websites, prevent tab switching, and limit certain system-level features during the exam.

5.2 Proctoring

Another common approach is proctoring. This can include webcam monitoring, screen recording, and in some cases AI-based behavior analysis. The goal is not to control the browser itself, but to monitor the student during the exam and identify any suspicious activity.

5.3 Controlled Environment

Some systems also try to create a more controlled setup for exams. This may involve requiring a specific browser configuration, forcing fullscreen mode during the exam, and limiting actions such as copy and paste where possible. While these methods do not provide full control, they can reduce opportunities for cheating.


6. Recommendation

Based on the findings, trying to directly detect or block browser extensions is not practical in a real web application. The browser simply does not provide the level of access needed to do this reliably.

Recommended approach would be:

i. Track user behavior:
   a. Tab Switching
   b. Focus/blur events
   c. Copy/paste activity

ii. Use a risk scoring system:
   a. Combine multiple signals
   b. Flag suspicious sessions instead of blocking immediately

iii. For strict exams:
   a. Use a lockdown browser (like SEB)

iv. Combine with proctoring if needed:
   a. Webcam + screen monitoring



7. Conclusion

A web application cannot directly detect or disable browser extensions because of built-in browser security restrictions. These limitations are designed to protect user privacy and prevent websites from accessing sensitive browser information.

Because of this, the most practical approach is to focus on monitoring user behavior instead of trying to control extensions. The system can detect suspicious patterns, track unusual activity, and flag users for further review when needed. For high-stakes exams, using controlled environments provides a stronger level of security and reliability.



