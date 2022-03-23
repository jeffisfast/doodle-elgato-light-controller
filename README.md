Doodle's Elgato Light Controller
================================

(This is an Electron program to control Elgato Key Lights.  If you want a CLI version in Python please see [Elgato Light Control Center](https://github.com/jeffisfast/Elgato-Light-Controller)).

I'm really happy with my Elgato Key Light from an illumination perspective.  However, their control software has been glitchy for me.  When I first used the light the software worked most of the time, but over time it started having problems by only detecting the light intermittently.  

After internet searching I found:

1. Others have had the exact same experience.
2. Corsair’s technical support wasn’t particularly helpful or responsive.
3. Factory resetting the light didn’t help, in my case it made it worse.
4. Some internet threads think the issue is that the Key Light only uses 2.4 GHz Wi-Fi networks, and that newer Wi-Fi systems are trying to connect at 5.0 GHz. That wouldn’t explain why the light works sometimes, but I built a dedicated 2.4 GHz network to test this and it didn’t help.
5. Other internet threads think the issue is multicast being blocked on one’s home network.  It is true that this could explain the symptoms, but my network doesn’t block multicast and doesn’t explain the intermittent nature of the problem.

Diving in a bit deeper I discovered that my light:
1. Was staying connected to my network, even when the software couldn’t find it.
2. On port 9123 there was an API listener with a straightforward JSON interface.

So, I went ahead and created this program to accept all the typical commands for control of a single light.  

This was also my first attempt at building an [Electron](https://www.electronjs.org/) app.  Apologies, it is a bit rough and sloppy.  Lots of room for improvement.  I made it because after making a [CLI](https://github.com/jeffisfast/Elgato-Light-Controller) version of this tool, others asked for a GUI. 

Instructions
============

0. This isn't a program yuo can just download and run.  You need some basic programming knowledge to get it up and running.
1. You will need to install NodeJS on your machine.  
2. You need to install electron by using the command `npm install electron`
3. Download this code and use the command `npm run make` to have it compile the code.  Look in the newly created "out" directory for the binary.  
4. Optionally, use the command `npm run start` to just run the code without compiling it.  That might be easier when you're just starting out to make sure you like it.
5. The app only installs as a menubar (on Mac) or system tray (Linux / Windows) item.  It doesn't have an actual window that opens so look for Doodle's icon to use the program.
6. Once the program is running, click on the menu choice "IP Settings" and input your light's IP address.  I recommend giving your light a static IP address.
7. There is a global command shortcut of Alt-Command-J to toggle your light on and off.  That's my favorite feature.

Known Issues and Limitations
============================

1. I did all my development on an Apple iMac (M1 chipset).  Not sure how this will compile on other platforms... but it should work.
2. It can only control one light, if you have multiple you will need to modify the source or find a different tool.
3. Your light should have a static IP address that you input into the software.  

Next Steps
==========

1. There are lots of ways to improve this app.  Better graphics, better multi-platform support, multiple lights, automatically turn on/off based on criteria, etc.  
2. Let me know if you're using the app - future development will depend entirely on demand.
