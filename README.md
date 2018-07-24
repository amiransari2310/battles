# battles
battles API - Assighnment

GET URL:


/list:

URI: http://localhost:3000/list

Description: API to get list of locations

Response Strcture: [String]

Authentication Token Required: true


/count:

URI: http://localhost:3000/count

Description: API to get total count of battles

Response Strcture: {"count": Number}

Authentication Token Required: true


/search:

URI: http://localhost:3000/search

Description: API to search battles

Response Strcture: [{
    "name": String,
    "year": Number,
    "battle_number": Number,
    "attacker_king": String,
    "defender_king": String,
    "attacker_1": String,
    "attacker_2": String,
    "attacker_3": String,
    "attacker_4": String,
    "defender_1": String,
    "defender_2": String,
    "defender_3": String,
    "defender_4": String,
    "attacker_outcome": String,
    "battle_type": String,
    "major_death": Number,
    "major_capture": Number,
    "attacker_size": Number,
    "defender_size": Number,
    "attacker_commander": String,
    "defender_commander": String,
    "summer": Number,
    "location": String,
    "region": String,
    "note": String
}]

Authentication Token Required: true


/stats:

URI: http://localhost:3000/stats

Description: API to get statistics of battles

Response Strcture: 

{
    "most_Active": {
        "attacker_king": String,
        "defender_king": String,
        "region": String,
        "name": String
    },
    "attacker_outcome": {
        "win": Number,
        "loss": Number
    },
    "battle_type": [String],
    "defender_Size": {
        "average": Number,
        "min": Number,
        "max": Number
    }
}

Authentication Token Required: true



POST URL:


/register:


URI: http://localhost:3000/register

Description: API to register a user

Request Structure:
{
  "userName": String,
  "Password": String
}
Response Structure:

{
  "userName": String,
  "Password": String
}

Authentication Token Required: no


/login:


URI: http://localhost:3000/login

Description: API to login a user

Request Structure:
{
  "userName": String,
  "Password": String
}
Response Structure:
{
  "message": String,
  "token": String
}

Authentication Token Required: no
