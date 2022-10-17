# Hide and Seek Tech Demo

!!! requirement "Requirements"
    - Node.js v14.0 or higher
    - Colyseus 0.14.20
    - Babylon.js Editor 4.4.0 or higher

The purpose of this technical demo is to show how to use Colyseus with the Babylon.js Editor. Following documentation covers installing and using the Colyseus client SDK as well as locally running a Colyseus server. The demo is designed to work with Colyseus version 0.14.20 and [Babylon.js Editor version 4.4.0](http://editor.babylonjs.com/).

**[Download demo](https://github.com/colyseus/babylonjs-hide-and-seek/archive/master.zip)** ([View source code](https://github.com/colyseus/babylonjs-hide-and-seek/))

![Screenshot](shooting-gallery/screenshot.png)

## Getting Started

### Installing & Launching a local server

You need to install and launch the server from the **provided Server directory** for this demo to function properly. Simply follow the instructions found underneath [“Running the server locally” in the Unity3d section of these docs](/getting-started/unity3d-client/#running-the-server-locally). 

### Colyseus Server Settings

All server settings are defined in `.env` files located here:

![Server Settings](common-images/scriptable-object.png)

If you are running a local server, the `local` settings should be sufficient. However if you wish to host a server you’ll need to change the **Colyseus Server Address** and **Colyseus Server Port** values accordingly. For example the remote settings used to connect to the public demo on Arena are included.
By default the editor will load server settings from the `local.env` file.

## Playing the Demo

There is only one scene and the editor should load it automatically when opening the workspace. You can click the "Play" button at the top left of the editor and that will open a player window. To create or join and existing room you can simply click the "Play!" button. An overlay displaying "Joining..." should appear and if successful it will disappear revealin the lobby UI. **If you cannot reach the lobby UI confirm your local server is working properly and check the editor logs for errors.**
By default a minimum of three players is required to start a match, but you can adjust that if desired as noted in the section below.

### Controls
Player movement: W, A, S, & D keys.

### Demo Gameplay Mechanics
- All players start near the center of the arena in front of the mausoleum
- Hiders have 3 seconds to scatter before the Seeker is able to seek
- A round of play lasts 60 seconds. Time left in the round is viewable in the top left corner of the screen
- Hiders win if one or more stay hidden at the end of the round
- The Seeker wins if they find all the Hiders within the countdown
- The Seeker cannot directly see the Hiders until they are captured
- There are various traps, that betray a Hider’s position to the Seeker, spread out over the arena
    - Mud puddles will cause you to leave a trail of muddy footprints for a short period of time
    - Spirits may be disturbed from their abodes
    - Bats may be startled from their resting places
- A Hider is captured when they are within the FOV of the Seeker or are too close to the Seeker in any direction within a unit or so
    - Current FOV is 60 degrees out for 7 units
- When captured a Hider cannot move
    - Denoted by a green glow with chains at the foot of the Hider
- A Hider that has been captured can be rescued by another Hider only one time before being permanently caught
    - To rescue a captured Hider a fellow Hider just needs to stand right next to them for one second

## Adjusting the Demo

As you play around with this demo, you may want to make some adjustments to better familiarize yourself with what is happening. Below, you’ll learn how to make these minor adjustments. Most adjustable values are defined in `gameConfig.ts` in the **Server** folder at `Server/src/gameConfig.ts`

### Player Movement

There are two values that affect player movement speed. The base player speed is defined by `playerMovementSpeed` and that applies to both the Hiders and the Seeker. The Seeker gets a speed boost defined by `seekerMovementBoost` and is set to `1.2` by default. Using that value the speed boost means the Seeker gets to move 1.2 as fast (or 20% faster) than the Hiders.

### Seeker's Vision

The Seeker's ability to capture Hiders is based on it's vision defined by it's field of view(FOV) and viewing distance. Both values are defined in the config as `seekerFOV` and `seekerCheckDistance` respectively.

### Rescuing Captured Hiders


