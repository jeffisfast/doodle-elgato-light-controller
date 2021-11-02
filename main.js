// My first electron app - be gentle!  
// This is a replacement for Elgato's Control Center since it was unreliable for me
// Lots of things can be improved.  Please fork and update as you see fit.
// By Jeff Tarr - November 1, 2021

const {app, Tray, Menu, BrowserWindow, globalShortcut, Notification} = require('electron');
const path = require('path');
const tray_iconPath = path.join(__dirname, 'assets/doodle.png');
const about_iconPath = path.join(__dirname, 'assets/aboutIcon.png');
const NOTIFICATION_TITLE = 'Doodle: Bark Bark';
const openAboutWindow = require('about-window').default;
const settings = require('electron-app-settings');
const prompt = require('electron-prompt');

let trayIcon = null;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var light_data = {
  "numberOfLights": 1,
  "lights": [
    {
      "on": false,
      "brightness": 23,     
      "temperature": 293
    }
  ]
}

function showNotification (NOTIFICATION_BODY) {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, icon: about_iconPath, closeButtonText: 'ACK' }).show();
}

function put_to_light() {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://"+settings.get('light.ip')+":9123/elgato/lights", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
       console.log(xhr.responseText);
    }};
  xhr.send(JSON.stringify(light_data));
  render_normal_menu();
}

function getLightTimeout(evt) {
  console.log("Get request timeout!");
  showNotification('Your light cannot be reached. Check it\'s IP address.');
};

function getLightFailed(evt) {
  console.log("Get request failed!");
  showNotification('Your light cannot be reached. Check it\'s IP address.');
}

function get_Light_Status() {
  var req = new XMLHttpRequest();
  req.timeout = 1000;
  req.ontimeout = function () {
    console.log('Request timed out!');
    getLightTimeout();
  }
  req.responseType = 'json';
  req.addEventListener("error", getLightFailed);
  req.addEventListener("timeout", getLightTimeout);
  req.open("GET", "http://"+settings.get('light.ip')+":9123/elgato/lights", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.onload = function () {
    if (req.readyState === 4 && req.status == "200") {
      json = JSON.parse(req.responseText);
      light_data.lights[0].on = json.lights[0].on;
      light_data.lights[0].brightness = json.lights[0].brightness;
      light_data.lights[0].temperature = json.lights[0].temperature;

      console.log(json.lights[0].on);
      console.log(json.lights[0].brightness);
      console.log(json.lights[0].temperature);
      render_normal_menu(); 
    }};
  req.send();
}

function toggle_light() {
  light_data.lights[0].on = ! light_data.lights[0].on;  
  put_to_light();
}

function show_settings_window() {
  let input_ip = '192.168.1.200';
  if (settings.has('light.ip')) {
    input_ip = settings.get('light.ip');
  } 
  prompt({
    title: 'Enter Light\'s IP Address',
    label: 'IP Address:',
    value: input_ip,
    type: 'input'
  })
  .then((r) => {
    if (r === null) {
      console.log('user cancelled');
    } else {
      console.log('result', r);
      settings.set('light', { ip: r });
    }
  })
}


function render_normal_menu() {
  var light_status_text;

  if (light_data.lights[0].on) {
    light_status_text = 'Turn light off';
  } else {
    light_status_text = 'Turn light on';
  }

  var contextMenu = Menu.buildFromTemplate([
    {
      label: light_status_text,
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+J' : 'Alt+Shift+J',
      click: function() { toggle_light(); }
    },
    {
      label: 'Brightness (' + light_data.lights[0].brightness + ')',
      submenu: [
        { 
          label: "Increase",
          click: function () {
            light_data.lights[0].brightness = light_data.lights[0].brightness + 1;
            if (light_data.lights[0].brightness > 100) {
              light_data.lights[0].brightness = 100;
            }
            put_to_light();
          }
       },
        { 
          label: "Decrease",
          click: function () {
            light_data.lights[0].brightness = light_data.lights[0].brightness - 1;
            if (light_data.lights[0].brightness < 0) {
              light_data.lights[0].brightness = 0;
            }
            put_to_light();
          }
        },
        {
          label: "Brightest!",
          click: function () {
            light_data.lights[0].brightness = 100;
            put_to_light();
          }        
        },
        {
          label: "Dimmest!",
          click: function () {
            light_data.lights[0].brightness = 1;
            put_to_light();
          }      
        },
        {
          label: "Doodle\'s Fav",
          click: function () {
            light_data.lights[0].brightness = 23;
            put_to_light();
          }      
        }           
      ]
    },
    {
      label: 'Temperature (' + light_data.lights[0].temperature + ')',
      submenu: [
        { 
          label: "Warmer",
          click: function () {
            light_data.lights[0].temperature = light_data.lights[0].temperature + 1;
            if (light_data.lights[0].temperature > 344) {
              light_data.lights[0].temperature = 344;
            }
            put_to_light();
          }
       },
        { 
          label: "Cooler",
          click: function () {
            light_data.lights[0].temperature = light_data.lights[0].temperature - 10;
            if (light_data.lights[0].temperature < 149) {
              light_data.lights[0].temperature = 149;
            }
            put_to_light();
          }
        },
        {
          label: "Warmest!",
          click: function () {
            light_data.lights[0].temperature = 344;
            put_to_light();
          }        
        },
        {
          label: "Coldest!",
          click: function () {
            light_data.lights[0].temperature = 149;
            put_to_light();
          }      
        },
        {
          label: "Doodle\'s Fav",
          click: function () {
            light_data.lights[0].temperature = 293;
            put_to_light();
          }      
        }           
      ]      
    },
    {
      type: 'separator'
    },
    {
      label: 'IP Address',
      click: () => show_settings_window()
    },
    {
      label: 'About Doodle',
      click: () =>
          openAboutWindow({
              icon_path: about_iconPath,
              product_name: "Doodle's Elgato Light Controller",
              description: "Doodle didn't like it that Elgato's Control Center app was unreliable and the light would be left on overnight so her owner put this together. Did you guess that Doodle is a Maltese and Shihtzu mix?",
              copyright: 'Copyright (c) 2021 Future Junction LLC',
              bug_report_url: 'mailto:doodle@junction.com',
              use_version_info: false
          }),
  },
    { label: 'Quit',
      role: 'quit'
    }
  ]);
  trayIcon.setToolTip("Doodle's Elgato Light Controller");
  trayIcon.setContextMenu(contextMenu);
}

function normal_loop() {
  get_Light_Status();
  setInterval(get_Light_Status, 5000);  // RE-READ LIGHT SETTINGS EVERY FIVE SECONDS, CHANGE AS YOU SEE FIT
}

app.on('window-all-closed', e => e.preventDefault() );
app.on('ready', function(){
  trayIcon = new Tray(tray_iconPath);
  globalShortcut.register('Alt+CommandOrControl+J', () => {
    console.log('Doodle loves global shortcuts!');
    toggle_light();
  });
  if (!settings.has('light.ip')) {
    showNotification('Please set an IP address of your Elgato Key Light.');
  }
  normal_loop();
  });
