# IG Analyzer
A privacy-focused, client-side web application for analyzing Instagram follower connections.

![screenshot of app homepage](public/IG_Analyzer.png)

Unlike third-party applications that require account credentials and risk account suspension via API scraping, IG Analyzer processes official Instagram data exports locally within the user's browser. This ensures that no login information is shared and user data never leaves the device.

## Features

* **Client-Side Processing:** All data parsing occurs locally in the browser memory; no data is uploaded to any server.
* **Connection Analysis:** Identifies users who do not follow back, mutual connections, and fans.
* **Safety Filtering:** Includes a time-buffer filter to hide accounts followed within the last 30 days to prevent accidental unfollowing of new connections.
* **Heuristic Filtering:** Algorithms to detect and filter out likely business or commercial accounts from results.
* **Data Management:** Supports search functionality and CSV export for external analysis.

## Tech Stack

* React
* Vite
* Tailwind CSS
* Lucide React

## Disclaimer

This project is a third-party tool and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Meta or Instagram.
