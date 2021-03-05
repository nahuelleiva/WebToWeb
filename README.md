# WebToWeb
Simple application made with Ionic, Angular, Electron and .NET Core

Steps to use the application:
* Download the code or clone the repository
* Once you have cloned/downloaded the repository execute ```npm install``` to install all the dependencies and packages
* Then execute ```ionic build``` for the first time, this will create the WWW folder in the project
* Then ```ionic build && npx cap copy``` it will build the needed files and then copy them into an "electron" folder in your project
* To run the project with electron just execute ```npx cap open electron```
* Otherwise just execute ```ionic serve -o``` to run the application with the Ionic framework, this will open your application in a new browser window.
