# Tripistry

Tripistry is a travel package platform that allows travellers to browse and compare travel packages from different agencies. The system helps users explore destinations, flights, accommodation, tourist attractions and restaurants while also allowing them to book packages and leave comments about their experience.

Travel agencies can create, manage and showcase their own travel packages. Agencies can also create group trips for travellers who want to travel with others but do not have enough companions. The platform separates traveller and agency functionality so that each user type has its own interface, permissions and database interactions.

## Features

- Traveller and agency user roles
- Browse travel destinations and packages
- Compare packages from different agencies
- Book travel packages
- Comment on agency experiences
- Agency package creation and management analytics 
- Group trip support
- Web interface built with HTML, PHP, CSS and JavaScript
- Backend functionality using PHP
- Relational database integration

## Technologies Used

- HTML
- CSS
- JavaScript
- PHP
- MySQL
- REST API's

## Project Purpose

This project was developed as part of a practical assignment to design and implement a web based travel package marketplace. The main goal was to work with multiple data sources, design a relational database, build a server side API and create a frontend interface that can query and manipulate the database.

## Running Locally

Run this project through XAMPP/Apache, not by opening the PHP files directly.

1. Put the project in your XAMPP `htdocs` folder, preferably:

```text
htdocs/COS-221-PA5/Travel-Agency-Package-Marketplace
```

2. Start Apache and MySQL.

3. Import the database file:

```text
backend/tripistry_dataV7.sql
```

It creates the database `tripistry_data`.

4. Open the site:

```text
http://localhost/COS-221-PA5/Travel-Agency-Package-Marketplace/frontend/IndexPage/index.php
```

Note: if the agency side cannot connect to MySQL, check `backend/Agency_code/config.php`. It currently uses port `3307`; change it to the default MySQL port if needed.
