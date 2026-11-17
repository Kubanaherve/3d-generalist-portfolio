# 3D Generalist & Technical Artist Portfolio: Modeling, Rigging, Animation & Python Automation

[![Blender 4.0+](https://img.shields.io/badge/Blender-4.0%2B-orange?logo=blender)](https://www.blender.org/)
[![glTF 2.0 / GLB](https://img.shields.io/badge/Format-glTF%202.0%20%2F%20GLB-green)](https://www.khronos.org/gltf/)
[![Interactive 3D Demo](https://img.shields.io/badge/Demo-Interactive%203D%20Showcase-blue)](https://kubanaherve.github.io/3d-generalist-portfolio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

Publicly accessible production work samples and technical breakdowns demonstrating hard-surface modeling, mechanical & skeletal rigging, animation, and Blender Python (`bpy`/`bmesh`) pipeline automation by **Hervé Friend Kubana**.

**Interactive WebGL / 3D Viewer:** [https://kubanaherve.github.io/3d-generalist-portfolio/](https://kubanaherve.github.io/3d-generalist-portfolio/)  
*(100% public, interactive 360° rotation in browser, zero login or password required)*

---

## 🚀 Shipped Work Samples Breakdown

### 1. AeroScan Mark-IV Autonomous Drone
* **Role:** Lead 3D Rigging & Technical Artist
* **Client / Production:** AeroDynamics Industrial (2025–2026)
* **Category:** Rigged & Animated Mechanical Asset
* **Interactive 3D Asset:** [`models/aeroscan_mark4_drone.glb`](models/aeroscan_mark4_drone.glb)
* **What I Personally Did:**
  - Built full mechanical bone rig and control hierarchy from scratch in Blender 4.x.
  - Implemented IK solver constraints for landing gear shock absorption and dual-axis pitch/yaw limit rotation constraints for the optical sensor turret.
  - Configured procedural driver rotations for 4 independent high-RPM rotor heads and authored looping hover, scan, and gear-stow animations.
  - Baked clean normal and curvature maps using custom cage projections in Substance 3D Painter; zero bake skewing or tangent-space mismatch.

### 2. BioPulse Prime Medical Diagnostic Scanner
* **Role:** Senior Hard-Surface & Product Visualization Modeler
* **Client / Brand:** MedTech Hardware Systems (2025)
* **Category:** Textured Hard-Surface & Product Model
* **Interactive 3D Asset:** [`models/biopulse_prime_scanner.glb`](models/biopulse_prime_scanner.glb)
* **What I Personally Did:**
  - Precision SubD hard-surface modeling with weighted normals and non-destructive bevel modifier stacks.
  - Cleaned and retopologized raw CAD STEP data into 100% watertight quad-dominant topology with zero non-manifold boundaries or N-gons.
  - Authored custom PBR smart materials in Substance 3D Painter (multi-layer coated medical polymers, brushed anodized titanium, anti-reflective optical glass, and high-friction ergonomic rubber grips).
  - Delivered hero photorealistic assets for commercial product visualization and real-time WebGL interactive catalog.

### 3. Vanguard-EX Tactical Modular Mech
* **Role:** 3D Technical Artist & Real-Time Asset Generalist
* **Client / Project:** Apex Simulation / Unreal Engine 5 Real-Time Demo (2025)
* **Category:** Game-Ready Real-Time Asset & Skeletal Rig
* **Interactive 3D Asset:** [`models/vanguard_tactical_mech.glb`](models/vanguard_tactical_mech.glb)
* **What I Personally Did:**
  - Low-poly real-time skeletal asset (LOD0: 32,400 tris, LOD1: 14,200 tris, LOD2: 4,800 tris).
  - Two-bone IK leg solvers with custom foot-roll and toe-lift constraint drivers.
  - Mechanical bone constraints with automated hydraulic piston tracking via Blender `Track To` and `Locked Track` constraints.
  - Comprehensive weight painting across articulated mechanical joints ensuring zero stretching or volume collapse under extreme pose ranges.

### 4. ChronoPrecision Titan Luxury Horology
* **Role:** 3D Product Modeler, Material Specialist & Lighting Artist
* **Client / Brand:** Atelier Chrono Horology (2025–2026)
* **Category:** Commercial Product Viz & Configurator Catalog
* **Interactive 3D Asset:** [`models/chronoprecision_titan_watch.glb`](models/chronoprecision_titan_watch.glb)
* **What I Personally Did:**
  - Modeled CAD-accurate micro-mechanical watch movement assemblies, knurled crowns, sunray brushed dial, and embossed alligator leather strap.
  - Set up complex PBR shaders with thin-film optical dispersion and anisotropic metallic reflections.
  - Delivered optimized glTF 2.0 binaries for commercial web configurator deployment.

---

## 🛠️ Pipeline Automation Tooling

### Blender GLB Asset Validator & Batch Exporter (`bpy` / `bmesh`)
* **Repository:** [https://github.com/Kubanaherve/blender-glb-validator](https://github.com/Kubanaherve/blender-glb-validator)
* **Author:** Hervé Friend Kubana
* **Description:** Production add-on for Blender 4.0+ that validates mesh topology, transforms, and UV channels before batch exporting `.glb` assets for real-time game engines (Unreal Engine 5, Unity, WebGL).
* **Key Features:**
  - Flags unapplied scale (`scale != (1,1,1)`) and rotation (`rot != (0,0,0)`).
  - Topology auditing via `bmesh`: detects non-manifold edges and N-gons (`len(face.verts) > 4`).
  - Missing UV set detection.
  - Interactive N-panel UI with 1-click viewport selection to immediately zoom to flagged geometry.
  - One-click batch exporter writing isolated, cleanly formatted `.glb` files with automatic path resolution.

---

## 📄 License

This repository and its included models are distributed under the [MIT License](LICENSE). All assets are fully approved for public demonstration with zero NDA or unreleased IP encumbrances.
