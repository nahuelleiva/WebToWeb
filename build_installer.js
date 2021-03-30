// ./build_installer.js

// 1. Importar módulos
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Definir directorio de entrada y salida.
// Importante: los directorios deben ser absolutos, no relativos, p. Ej.
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
const APP_DIR = path.resolve(__dirname, './release-builds/SidesysApp-win32-ia32');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, './windows_installer');

// 3. Instancia de MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configurar metadatos
    description: 'Esta es una apliación de Sidesys SRL en Electron',
    exe: 'SidesysApp',
    name: 'Sidesys Videocall App',
    manufacturer: 'Sidesys SRL',
    version: '1.0.0',
    appIconPath: './src/assets/icon/favicon.ico',

    // Configurar la interfaz de usuario del instalador
    ui: {
        chooseDirectory: true
    },
});

// 4. Cree un archivo de plantilla .wxs
msiCreator.create().then(function(){

    // Paso 5: compile la plantilla en un archivo .msi
    msiCreator.compile();
});