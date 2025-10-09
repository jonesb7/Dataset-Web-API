# Web API Functionality Plan

Goal: Provide a REST API to explore movies released in the last 30 years.

Users:
- Students/instructors
- Anyone searching by year, title, or genre

Endpoints:
- GET /api/movies?page=1&pageSize=25
- GET /api/movies?year=2021
- GET /api/movies?title=ring
- GET /api/movies?genre=Horror
- GET /api/movies/{id}
- GET /api/movies/stats?by=year|genre
