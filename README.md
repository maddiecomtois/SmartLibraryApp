# SmartLibraryApp

### To Run the project on the Web: 
Download the Ionic CLI with NPM, and install packages using npm i
```
npm install -g @ionic/cli
npm i
```

Also install the **custom smart beacon plugin** incase it isn't downloaded with npm i:
```
npm i https://github.com/chaitu25/SmartBeaconPlugin.git
```

**You also need to add the ```smart-beacon-plugin``` folder into the ```node-modules/@ionic-native/``` folder of the project.**

Start the Ionic Server <br>
   ```
   ionic serve
   ```
The browser verison of the code should be available at ```http://localhost:8100```

### For deploying on mobile:  
- Stop any current sessions  
- Any changes made need to be built before updating mobile:
- If not using a simulator, the device might need to be plugged in to the computer  
- Certain permissions might need to be set up if using the camera etc.

```
ionic cap copy
ionic cap sync
ionic cap run android (then select device/emulator)
```

### To open code in IDE
Apple iOS:  
Install Xcode then run the following command
```
ionic cap open ios
```

Android:  
Install Android Studio then run the following command
```
ionic cap open android
```
