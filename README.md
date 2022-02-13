<p align="center">
  <img src="https://user-images.githubusercontent.com/67172682/147801833-bb70691f-79b9-4a7a-9d3b-e0ea592ce1d3.png" height=250>
</p>

<h1 align="center">KS-BOT - Your friendly KS ChatBot</h1>
<p align="center">
  <a href="https://github.com/KidsSMIT/KS-BOT#important-information">Important Information |</a>
  <a href="https://github.com/KidsSMIT/KS-BOT#important-changes">Important Changes |</a>
  <a href="https://github.com/KidsSMIT/KS-BOT#important-updates">Important Updates |</a>
  <a href="https://github.com/KidsSMIT/KS-BOT#changes-working-on">Changes Working On |</a>
  <a href="https://github.com/KidsSMIT/KS-BOT#credits">Credits</a>
</p>

## What is KS-BOT
KS-BOT is a AI-Powered Assitant for all Kids SMIT users, original developed by Kids SMIT Founder (Chidozie N.) to help him organize certain parts of his life.


# Important Information
### Getting Started with KS-BOT:
> Note: To be able to use KS-BOT, you will need a Kids SMIT users account
- First head over to [Kids SMIT](https://www.kidssmit.com/) and create an account if you do not already have one
- Next download the correct [release](https://github.com/KidsSMIT/KS-BOT/releases) for your system.
- Once the release is downloaded, the app should start up and you should then be able to log in
- Once log in, you can now begin to start talking to your personalized assitant.

### How to find out a command:
- To find out different commands, all you have to do is send "What can you do?", and it will give you a randomize command to use.

### Available Commands:
> Note: The sentence in quotations, is the actual command you will need to type
- "What can you do" - Gives a randomize command of what KS-BOT can actually do.
- "Tell me a joke" - Tells you a randomize joke from our jokes file.
- "Translate <word> to pig latin" - Translate a word to pig latin.
- "Translate <pig latin word> to english" -  Translates a pig latin word to english.
- "Hello" - Greets you back.
- "What is your name?" - Tells you its name and back story behind it.
- "Who is your creator?" - A short reponse about its creator.
- "Set an alarm for 8:40:00 AM" - To set an alram for 8:40:00 AM
- "What is the weather right now [ Optional: in < your desired location > ]" - Tells you the current weather in your timeZone as a whole that is if a locaiton is not specified. Side Note: We can not check the weather in your current location because we do not track user location.
- "What is the news today [ Optional: about < your desired topic >, ] [ Optional: in < your desired location > ]" - Tells you recent news about a topic, in your timeZone that is if your desired location is not specified. Side Note: You will need to put a "," once you are done talking about your desired topic, without the comma we will not be able to tell what your desired topic is about. You will also need to put "about" before you can start talking about a topic. IF A TOPIC IS NOT SPECIFIED "the world" WILL BECOME THE DEFAULT TOPIC
- "Smith" - To Activate your voice assitant SMITH
- < Say >"Switch to KS-BOT" - To Activate KS-BOT and deactivate SMITH, or you can click the center icon of smith, you can also deactivate SMITH by restarting the app.
# Important Changes
- Voice Assitant Called SMITH, it translates speech-to-text and then sends your text to server to be processed.
> - SMITH can only translate speech to text for english speakers
> - To switch to SMITH text "smith"
> - To switch back to KS-BOT, you can either say "Switch to KS-BOT", or click the center icon of smith, or you can restart the app, because KS-BOT is the default assitant
- KS-Bot can now more accurately search the web for the weather for your desired location.
- KS-Bot will now notify you on the client side when alarm is over, rather than just notifying you via email.
- KS-Bot can now track timezone, during message request.

# Important Updates
- "KS-Bot 1.7.0": This is a Batch release which main purpose was to fix the previous release error with node-fetch version. 
  > DO NOT DOWNLOAD KS-BOT 1.6.0
- "KS-Bot 1.5.0": Allows KS-Bot to notify you on the client side, when your timer is over
- "KS-Bot 1.4.0": Allows for server to be able to track your time zone for accurate timers.
- "KS-Bot 1.2.0": Added node-fetch to the packaging process of app, in turn fixing last release starting up error.
- "KS-Bot Official Release": First official release of KS-BOT, all it allows is back and forth communication between client and KS-BOT server

# Changes Working On
- A better way to scrape the web for user weather
- Adding of more commands and features for KS-BOT

# Credits
## Developers:
- @codingwithcn is the main developer of the KS-BOT project

## Modules:
### KS-BOT relies heavily on alot of modules so we would like to give thanks to the main ones like:

- [Electron](https://github.com/electron/electron) - Electron is the backend of the KS-BOT client, being that it handles the rendering process and the desktop application it self

- [Sqlite3](https://github.com/mapbox/node-sqlite3) - Used for the database operation being handled locally

- [Vosk-browser](https://github.com/ccoreilly/vosk-browser) - This module is highly important in KS-BOT speech-to-text translation, even more important because it works offline.
