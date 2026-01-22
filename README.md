# ˗ˏˋ ★ ˎˊ˗ BLUR  ------------------ FRONTEND DESCRIPTION ˗ˏˋ ★ ˎˊ˗ 

## VIDEO 
[Watch the DEMO :)](https://www.youtube.com/watch?v=LeeKC-RVJzI&t=2s)

A high-fidelity frontend interface designed for a real-time computer vision application. This project serves as both the immersive marketing landing page and the control layer for a YOLOv8-based video segmentation engine.

The application prioritizes visual immersion and performance, utilizing custom WebGL fluid simulations, hardware-accelerated animations, and a unified state management system to transition users from the landing page to the live camera feed without page reloads.

## OVERVIEW

This repository contains the client-side logic and UI architecture. The interface communicates with a local Python backend via REST API to trigger video processing states and manage virtual camera streams.


### FUNCTIONALITY

* **Unified Single-Page Architecture:** A custom layout engine that conditionally renders the marketing sections or the operational `CameraInterface` based on user intent, maintaining high performance without routing overhead.
* **Real-time Control Interface:** Direct manipulation of video processing modes (Blur, Segmentation, Color Replacement).
* **Interactive Fluid Simulation:** A background visualizer based on stable fluids (Navier-Stokes equations), implemented via raw WebGL/Three.js custom shaders.
* **Scroll-Driven UX:** Dynamic navigation that adapts transparency and styling based on scroll position, utilizing Intersection Observers for active section tracking.

## TECHNICAL STACK

* **Framework:** React 18
* **Graphics & Shaders:** Three.js, GLSL (Custom Fragment/Vertex Shaders)
* **Animation:** Framer Motion (Scroll transforms, presence detection), GSAP
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (Context-free local state optimization)

## COMPONENT ARCHITECTURE


### LAYOUT ENGINE (`App.js`)
The root component acts as the central state controller. It bypasses traditional routing to provide an instant switch between the "Landing Mode" and "App Mode" (`CameraInterface`).
* **Scroll Spy:** Implements `IntersectionObserver` to track active viewports and update navigation indicators dynamically.
* **Dynamic Navbar:** A header component that morphs from a floating, bordered capsule to a full-width transparent navigation bar based on scroll threshold.
* **Modal Management:** Handles global overlays for "About Us", video previews, and support widgets.

### LIQUID ETHER (WebGL Simulation)
Located in `components/LiquidEther.js`.
A complex visual implementation of fluid dynamics. Unlike standard video loops, this component solves advection, divergence, and pressure equations in real-time on the GPU.
* **Technique:** Ping-pong frame buffer objects (FBOs) for calculating physics steps.
* **Interaction:** Mouse/Touch input exerts force on the velocity field, creating interactive turbulence.

### KINETIC FOOTER (`Section4.js`)
A highly interactive footer section that utilizes `framer-motion` to interpolate background colors based on scroll progress (shifting from dark to light themes).
* **Features:** Includes a custom `BlurText` reveal animation and a modal-based video player integration.
* **Newsletter Integration:** UI components for subscription and donation processing with hover-state micro-interactions.

### FLOWING MENU (`Section3.js`)
A visual navigation component designed for high-impact imagery.
* **Implementation:** Displays a marquee-style list where hovering over items reveals associated imagery in a fluid motion, utilizing standard CSS and React state logic.

## SETUP

### Requirements
- **Python 3.11** (Strictly required)
- **Node.js** (Latest LTS recommended)

### Quick Start (Recommended)
1.  Clone the repository:
    ```bash
    git clone https://github.com/Jaromek/blurBackground-InzynieriaOprogramowania.git
    ```
2.  Run the easy start script:
    - **Windows**: Double-click `run.bat` or run:
      ```powershell
      .\run.bat
      ```

This script will automatically:
- Check for Python 3.11 and Node.js.
- Install necessary Python dependencies (including `pyvirtualcam`).
- Install frontend dependencies (`npm install`).
- Launch both Backend and Frontend servers.

### Manual Setup
If you prefer to run things manually:

1.  **Backend**:
    ```bash
    cd backend
    py -3.11 -m pip install -r requirements.txt
    py -3.11 server.py
    ```

2.  **Frontend**:
    ```bash
    cd blr
    npm install
    npm start
    ```

## PROJECT STRUCTURE

```text
root/
├── backend/             # Python Flask Server (Logic & Processing)
├── blr/                 # React Frontend (UI & Compositor)
├── Camera/              # Camera handling logic
├── run.bat              # One-click startup script
├── start_with_obs.ps1   # PowerShell startup logic
└── README.md            # Documentation
```
