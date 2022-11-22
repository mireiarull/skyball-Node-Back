# ENDPOINTS

## PUBLIC ENDPOINTS [POST] /user/register -> Creates new user in the database

## [POST] /user/login -> Responds with a token when the user is in the database

## [GET] /games -> Responds with a list of games.

## ENDPOINTS WITH TOKEN [GET] /my-games -> Responds with a list of my games.

## [GET] /games/:id -> Responds with information of one game

## [GET] /games/filter/:filter -> Responds with a list of games that correspond with the filter recieved.

## ENDPOINTS WITH TOKEN [POST] /games/create -> Create a new game in the database.

## ENDPOINTS WITH TOKEN [DELETE] /games/delete/:id -> Deletes the game with the received id.

## ENDPOINTS WITH TOKEN [PATCH] /games/update/:id -> Updates the data of the game with the received id.
