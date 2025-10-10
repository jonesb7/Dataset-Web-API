# Functionality Plan

## Overview
Our Movies API provides access to a dataset of movies from the past 30 years.  
It holds basic information about the movies, including: 
 - The title of the movie
 - The original title of the movie
 - The release date
 - The runtime, in minutes
 - The genres of the movie
 - A paragraph overview of the movie
 - The budget of the movie, in dollars
 - The revenue made, in dollars
 - The studios involved in making the movie
 - The producers of the movie
 - The directors of the movie
 - The MPA rating
 - The respective countries each studio is located in
 - The movie collection it belongs to, if any
 - The name, character played, and profile of up to 10 different actors starring in the movie

It also provides access to various images on the web to the 
respective poster and backdrop images of the movie, as well as to the studio logos. 

## Basics of Obtaining Data
Our Movies API allows you to obtain a list of all the movies stored within the database, 
as well as all the different information stored about the movies.  

Further, once a movie title is identified, you can also obtain this other information 
relating to that movie, be it the release date or the MPA rating, 
simply by specifying the title of the movie and the information that is desired. 

## Additional Filters
Our Movies API also supports additional features that streamline searching and displaying movies. 

We have options for multiple filters, 
such as giving a more specific list of movie titles based off of a specified release year or genre. 
We also support partial title searching to help find movies off of only part of the title, 
so long as it is contained within the database. 

