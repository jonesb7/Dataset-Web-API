# Functionality Plan

## Overview
Our Movies API provides access to a dataset of movies from the past 30 years.  
It is designed to demonstrate core REST API concepts with database integration.

## Features Implemented
- **List Movies**:  
  Endpoint: `GET /api/movies`  
  Supports filters:
    - `year`: filter by release year
    - `title`: partial title search
    - `genre`: filter by genre  
      Also supports pagination with `page` and `pageSize`.

- **Movie Details**:  
  Endpoint: `GET /api/movies/:id`  
  Fetches a single movie by its ID.

- **Statistics**:  
  Endpoint: `GET /api/movies/stats?by=year|genre`  
  Aggregates counts of movies by release year or by genre.

## Future Enhancements
- Add support for more filters (runtime, vote_average).
- Add POST/PUT/DELETE endpoints for creating or updating movies.
- Deploy to a public host so others can query the API.
