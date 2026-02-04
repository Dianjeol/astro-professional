# Project Specification: Professional Astrology Web App

## Overview
A text-based and visual astrology application designed to provide professional-grade readings in two distinct traditions: **Hellenistic** and **Evolutionary** Astrology. The app aims for a "premium" feel, competing with top-tier astrology sites, using high-precision data and beautiful, responsive design.

## Goals
1.  **High Precision:** Use the Swiss Ephemeris for astronomical calculations.
2.  **Dual Perspective:** Seamlessly switch between Hellenistic (Traditional) and Evolutionary (Modern) analysis.
3.  **Premium UX/UI:** "Wow" factor with animations, smooth transitions, and elegant typography.
4.  **Privacy Focus:** Client-side processing where possible.

## User Flow
1.  **Landing / Input:** User enters Name, Birth Date, Birth Time, and Location (City search).
2.  **Calculation:** Application calculates the natal chart data.
3.  **Dashboard/Reading:** User sees a split view or tabbed interface:
    *   **Tab A: Hellenistic:**
        *   Chart Wheel: Traditional style (cleaner, distinct bound markers).
        *   House System: Whole Sign (default).
        *   Focus: Traditional 7 planets, Essential Dignities, Sect (Day/Night), Bounds (Terms), Lots (Fortune/Spirit).
    *   **Tab B: Evolutionary:**
        *   Chart Wheel: Modern style (aspect lines highlighted).
        *   House System: Placidus (default).
        *   Focus: Outer planets (Pluto, Neptune, Uranus), Lunar Nodes (South/North Node axis), Soul's journey archetypes.

## Technical Stack Proposal
To achieve the "best web app" performance and quality:

### Core Framework
*   **Vite + React:** For a lightning-fast Single Page Application (SPA).
*   **Language:** TypeScript (for professional robustness and type safety).

### Astrology Logic (The "Engine")
*   **Ephemeris:** `swisseph-wasm` or `astrology-api`:
    *   *Recommendation:* **swisseph-js** (WebAssembly version of Swiss Ephemeris) for client-side, offline-capable, high-precision calculations without needing a backend server for every request.

### UI & Styling
*   **Styling:** Modern **Vanilla CSS** with CSS Variables for theming (e.g., switching color palettes between "Earth/Parchment" for Hellenistic and "Cosmic/Nebula" for Evolutionary).
*   **Touch:** Framer Motion (for animations and "wow" transitions).
*   **Icons:** Lucide React or similar clean SVG icons.

### Visualization
*   **Charts:** Custom **SVG** components. Most libraries are too generic. We will build a high-quality SVG chart renderer that supports both:
    *   Wheel styles (Classic vs Modern).
    *   Aspect lines (toggleable).
    *   House systems (Whole Sign vs Placidus).

### APIs
*   **Geocoding:** `Open-Meteo` Geocoding API (Free, requires no API key for basic usage) to convert "City Name" to Lat/Long.

## Detailed Features

### 1. Input Module
*   Smart autocomplete for cities.
*   Date/Time picker.
*   "Unknown time" toggle (adjusts reading to remove house-sensitive points).

### 2. Hellenistic Tab Features
*   **Planetary Condition:** Analysis of Exaltation, Domicile, Detriment, Fall.
*   **Sect Status:** Is it a Day or Night chart? Which planets are in sect?
*   **The Big Three:** Sun, Moon, Ascendant (Traditional Rulers).
*   **Bounds/Terms:** Display which bound each planet is in.

### 3. Evolutionary Tab Features
*   **Pluto & The Nodes:** Detailed breakdown of the Pluto polarity point and Nodal axis.
*   **Outer Planets:** Aspects to personal planets from Uranus/Neptune/Pluto.
*   **Archetypal Reading:** Psychological context of the chart.

## Development Phase 1 (MVP)
*   Setup Project Structure (Vite, TS).
*   Implement Ephemeris calculation (Sun, Moon, Planets, Angles).
*   Create Basic SVG Wheel.
*   Generate simple text readings for Sun/Moon/Asc.
