# CYBER-AGENT AI — Local 3D avatar edition

React + Vite dashboard with a locally rendered FBX avatar using Three.js and React Three Fiber. The dashboard layout, editor, terminal demo, file selection, chat and Git graph are preserved. No paid avatar service or API key is used.

## Add your model

1. Create the folder `public/models/`.
2. Copy your FBX model into it and name it `cyber-agent.fbx`.
3. If the FBX uses external textures, keep the texture files in the paths expected by the model or embed them into the FBX before exporting.
4. Run `npm install`, then `npm run dev`. Open the Vite URL printed in the terminal.

The viewer automatically scales and centers the model. Drag to rotate and use the mouse wheel/pinch to zoom. The model renders locally after the app dependencies and assets are installed, so it does not need an internet connection at runtime. The ONLINE indicator reflects the browser network connection; it disappears when the device goes offline.

## Voice and mouth animation

Enable Voice uses the browser's built-in speech synthesis, when supported. The model viewer animates compatible mouth/jaw morph targets during speech. Actual lip synchronization requires your FBX to contain mouth morph targets or a compatible facial rig; a model without those features cannot produce true lip sync automatically. Browser speech voices vary by device and may not be available offline.

## Notes

- The terminal is a safe simulated terminal; it does not execute arbitrary commands on the device.
- Chat replies are demonstration responses, not a connected hosted AI model.
- For offline use, install dependencies and load the app once while online, and keep the FBX and texture assets locally.
