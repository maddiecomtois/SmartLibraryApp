# SmartLibraryApp

### To Run the project: 

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
ionic build
ionic cap copy
ionic cap sync
```

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