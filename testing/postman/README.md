Movie Database API
Project Overview
This project implements two separate Web APIs using Node.js/Express and PostgreSQL:

Auth API - Authentication, user management, and admin functionality
Movie Dataset API - Movie data management with API key access control

Both APIs are documented using Swagger and tested with Postman.

Alpha Sprint Contribution

[Buruk] - I went over everything after everyone was done with their section to do some verification wich included recreating ER diagram and adding SQL script and i also wrote the readme and turned everything in.
[Cai] - Discussion in Group Meetings, wrote out the document describing the Web API functionality
[Victor] - Discussion in Group Meetings , ERD Draft
[Brittney] -  Initial Movies API setup
Added database connection pool (pg) in src/db/pool.ts,
Implemented movies service (listMovies, getMovie, stats) with filtering by year, title, genre,
Created movies routes (GET /api/movies, /api/movies/:id, /api/movies/stats),
Integrated movies routes into app.ts,
Added TypeScript types for API arguments and responses,
Project structure aligned with service/controller/routes pattern
[Abdullahi] -  worked on swagger yaml documentation


Alpha Sprint Meetings
Buruk was not able to meet on thursday due to having class but everyone else was able to and got everything set up while buruk met with briteney on friday to get caught upo on everything and while everyone did their section the discord was active with plenty of clarifying questions and updates.

Alpha Sprint Comments
A bit confused on the functionality of code.