# Research on browser plugins 

## Possibilities to detect if user is using browser plugins or extensions 

Chrome extension detection is possible on website applications when webpage sends specific URL requests that are using the extensions ID and attempt to access these extensions resources that are exposed for the internet and these resources are known as web- acessible resources. Web application can be used to fingerprint browser at lest google chrome and see what extensions the browser has in use. This only works with google extensions so if user uses another web browser it wont work.   

# Javasrcipt DOM tree surveilance

JavaScript can be used to observe DOM tree changes in web pages html structures and many ai assistants like google translate changes the text instantly and manipulates html structure so that if used it can be detected. 
Ai agents such as Claude agent that could be used to modify code in coding tasks can be detected by using DOM monitoring because the agent injects its footprint to html structure. 

This works on our project becouse customer wanted to know that is it possible to see what plugins are in use during exam and is it possible to get information about plugins being used during exam. With DOM observer (MutationObserver) we can detect in any browser if Ai assistants are being used during exam and we can detect exact time when they have been active. 

It is a fact still that we cant surely tell which extensions are installed on users machine.        


## links:

https://browserleaks.com/chrome#web-accessible-resources-detection

https://www.javascripttutorial.net/javascript-dom/javascript-mutationobserver/

https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/