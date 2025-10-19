## Movie Database API
Project Overview
This project implements two separate Web APIs using Node.js/Express and PostgreSQL:

Auth API - Authentication, user management, and admin functionality
Movie Dataset API - Movie data management with API key access control

Both APIs are documented using Swagger and tested with Postman.

## Alpha Sprint Contribution

#### Buruk
I went over everything after everyone was done with their section to do some verification which included 
recreating ER diagram and adding SQL script and i also wrote the readme and turned everything in.
#### Cai 
Discussion in Group Meetings, wrote out the document describing the Web API functionality
#### Victor
Discussion in Group Meetings , ERD Draft
#### Brittney 
Initial Movies API setup
Added database connection pool (pg) in src/db/pool.ts,
Implemented movies service (listMovies, getMovie, stats) with filtering by year, title, genre,
Created movies routes (GET /api/movies, /api/movies/:id, /api/movies/stats),
Integrated movies routes into app.ts,
Added TypeScript types for API arguments and responses,
Project structure aligned with service/controller/routes pattern
#### Abdullahi 
worked on swagger yaml documentation


### Alpha Sprint Meetings
Buruk was not able to meet on thursday due to having class but everyone else was able to and got everything set up 
while buruk met with briteney on friday to get caught upo on everything and while everyone did their section the 
discord was active with plenty of clarifying questions and updates.

### Alpha Sprint Comments
A bit confused on the functionality of code.

## Beta Sprint Contribution

#### Buruk
Looked at adding additional routes for the next sprint
#### Cai
Fixed routes not connecting properly, added in the route for getting random movies. Updated documentation for 
movies routes and preliminary postman test. 
#### Victor
N/A 
#### Brittney 
Created render(our official version) and neon web server instances, connected database to render/neon, 
created some files (seedMovies.ts) and updated some files. Created some basic routes.
#### Abdullahi
Made fixes to .env to allow us to run the project on a local file in addition to the web server. 
This allows us to run postman tests. Rewrote postman tests so that they run properly.


### Beta Sprint Meetings
Group meeting of Buruk, Brittney, and Cai on Wednesday. We went over the code examples for the individual work to 
better understand what the requirements were for. We tried to get a second follow-up meeting for other members on 
Thursday, but unfortunately availability did not work out.  We ultimately left the work delegation and planning for 
discord. Activity was a little low for most of the week but most member were fairly active in the last few days. 

### Beta Sprint Comments
Some difficulty planning the sprint as we were only able to actually start about halfway through the week. 
It might be useful for the sprint descriptions to be published a little earlier so we have more time to plan. 