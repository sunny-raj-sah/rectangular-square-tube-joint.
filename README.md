# Rectangular/Square Tube Joint Visualization App

## Overview

This project is an interactive desktop application that allows users to create, visualize, and manipulate joints between rectangular or square tubes at various angles in a 3D workspace.

Built with React and Three.js, and packaged as a desktop app using Tauri.

## Features

- Choose tube type: Rectangular or Square.
- Define tube parameters: width, height, thickness, and length.
- Position, rotate, and connect tubes interactively.
- Snap rotations to standard angles (45°, 90°, 135°).
- Joint preview with visual highlights when tubes intersect.
- Switch between wireframe and solid visualization.
- Zoom, pan, and rotate workspace.
- Add multiple tubes to form a small assembly.
- Undo/redo support (planned).

## Setup and Usage

1. Clone the repository:  
   git clone https://github.com/sunny-raj-sah/rectangular-square-tube-joint..git
   cd rectangular-square-tube-joint

2. Install dependencies:

npm install

3. Start the development server:  
   npm run dev

4. Access the app in your browser at [http://localhost:5173](http://localhost:5173) (adjusted for Vite default port) or run the Tauri desktop dev mode:

npm run tauri:dev

## Build and Packaging

1. Build web assets:

npm run build

2. Build and package the Tauri desktop app:

cargo tauri build

3. Find the packaged executables and installers in:

4. Google Drive Download Link for the packaged executable:  
   [https://drive.google.com/file/d/1tGgGVE0abhpe5SfZ-KXt1PusOpvWkStj/view?usp=sharing](https://drive.google.com/file/d/1tGgGVE0abhpe5SfZ-KXt1PusOpvWkStj/view?usp=sharing)

5. Install the app by running the appropriate installer (`.msi` or `.exe`).

## GitHub Workflow (CI)

This project uses GitHub Actions for continuous integration to run basic checks on pushes and pull requests to the main branch. The workflow installs dependencies, runs the build, and performs linting.

---

## License

MIT

## Author

Sunny Raj Sah
