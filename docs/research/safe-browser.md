# Research Spike: Safe Exam Browser (SEB)

**Date:** 9.6.2026

**Why:** Customer asked whether "Safe browser" could be used, whether it restricts system features, and whether it disables plugins.

---

## What is it?

Safe Exam Browser (SEB) is an open-source lockdown browser used by universities for online exams. It turns a student's computer into a temporary locked-down workstation - the student can only access the exam, nothing else on the machine - then restores everything when the exam ends.

It runs on Windows, macOS, and iOS. Students download and install it themselves, then open an encrypted config file (.seb) that the institution provides per exam.

Official site: https://safeexambrowser.org

---

### 1. Can it restrict features on the system?
Yes, extensively. This is an OS-level lockdown, not just a browser:
 
- Disables the Windows Security Screen options (Ctrl+Alt+Del → lock, switch user, task manager, shut down)
- Disables the Start Menu and the task switcher (Alt-Tab, Windows-Tab)
- Blocks application launching and task switching
- Disables copy/paste, screenshots, and screen recording
- Removes the URL bar, search field, and navigation controls
- Blocks right-click context menus and most keyboard shortcuts
- Can require a password to quit

### 2. Does it disable plugins?
Yes. Browser extensions are blocked by design - students can only access the exam interface, with no new tabs, bookmarks, or extensions. Web plugins (Flash, Java applets) are a separate setting and are disabled by default for security. So the answer to the customer's specific question is: yes, it blocks browser extensions.

### 3. Is it usable for our solution?
No. See below for why.

---

## Why it does not fit our project well

**Requires installation on the student's machine**
SEB is a desktop application that students must download and install before the exam. This adds a setup step that can fail (wrong OS version, IT restrictions on university computers, students forgetting to install it). Our platform is designed to work entirely in the browser with no installation required.

**Blocks the webcam access our monitoring needs** 
SEB's lockdown mode restricts browser APIs, which can interfere with MediaPipe's (if MediaPipe is our chosen solution) access to the webcam. Our monitoring relies on the browser having full access to the camera for head pose detection.

**No Linux support**
SEB runs on Windows, macOS, and iOS only. Programming students are likely to use Linux - this would block them from taking exams entirely.

**Overkill for our use case**
SEB is designed for high-stakes institutional exams with strict invigilation requirements. Our platform targets weekly programming assignments and course exams where the teacher makes the final call on any suspicious behaviour. The monitoring we need (tab switching, head pose) can be implemented in the browser without locking down the entire machine.


**Conclusion**
SEB solves the browser extension problem, but introduces too many constraints for our use case. 

---

## Recommendation

Don't use SEB for this project. 

SEB and our approach are solving the same problem in completely different ways - SEB prevents cheating by locking everything down, we detect and log it and let the teacher decide. The customer asked for the second one (event logs, timestamps, teacher review, visible warnings to students - CRD 4.6, 3.3), so SEB is just the wrong tool for what they want.

The Linux gap alone is an issue for a programming course platform. On top of that, the webcam conflict would break our monitoring, and we'd be asking students to install software just to get a worse version of what we're already building in the browser.


---

## Sources
- SEB official overview: https://safeexambrowser.org/about_overview_en.html
- SEB Windows User Manual https://www.safeexambrowser.org/windows/win_usermanual_v2.1.8_en.html
- SEB macOS User Manual https://safeexambrowser.org/macosx/mac_usermanual_en.html

