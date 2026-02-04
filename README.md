ASTRO-PROFESSIONAL ASTROLOGICAL ENGINE
=====================================

This is a high-precision astrology web application designed for both
traditional Hellenistic and modern Evolutionary astrological perspectives.

WHAT IS THIS?
-------------

Astro-Professional is a React-based application leveraging the Swiss Ephemeris
via WebAssembly for sub-arcsecond accuracy in planetary and house
calculations. It provides a dual-interface for different astrological
methodologies:

 - Hellenistic: Whole-sign houses, traditional 7 planets, essential dignities,
   sect status, and Arabic Parts (Fortune and Spirit).
 - Evolutionary: Placidus houses, inclusion of outer planets, and Pluto
   polarity analysis.

The system includes a custom SVG rendering engine for the chart wheel,
complete with interactive tooltips and dynamic aspect line animations.

PREREQUISITES
-------------

To build the environment, you will need:

 - Node.js (v18 or higher recommended)
 - npm or yarn
 - A modern browser with WebAssembly (WASM) support

BUILDING AND RUNNING
--------------------

To initialize the development environment:

    npm install

To run the development server:

    npm run dev

To execute the test suite (62+ tests covering engine and UI):

    npm test

To create a production-optimized build:

    npm run build

TECHNICAL SPECIFICATIONS
------------------------

 - Framework: React 19
 - Precision: Swiss Ephemeris (WASM)
 - Animation: Framer Motion
 - Styling: Custom CSS with Cosmic Dark Theme
 - Geocoding: Open-Meteo Integration

LEGAL
-----

The software is released under the MIT License. See the LICENSE file for
the full text.

The Swiss Ephemeris library is subject to its own licensing (AGPL-3.0).

CONTRIBUTIONS
-------------

Standard pull-request workflow applies. Bug reports and feature suggestions
are welcome via GitHub issues.
