# DisasterResponse
## Instructions
1. Clone the repo onto your machine

2. Open the cloned repo in VS Code

3. Open the terminal in VS Code and type this line in:

> npm install
> This line will grab all the saved modules in the package.json and install the modules

4. Once all the modules are installed. Stay in VS Code terminal and type this line in:

> npx nodemon OR npm start
> This line should default to running nodemon on the server.js

5. Open this link in your browser:

> https://localhost:8000

6. Feel free to look around the webapp

7. To shut the server down, click onto the VS Code terminal and press:

> Ctrl+C

8. Press it twice to complete.
---
## Endpoints for the API
### Shelter Endpoints
1. GET http://localhost:8000/shelters/all
> Response is a JSON
2. GET http://localhost:8000/shelters/:id
> Example:
> http://localhost:8000/shelters/3
>
>>Reponse:
>> {
>> "id": 3,
>> "Name": "Greensboro",
>> "Latitude": 36.0726,
>> "Longitude": 79.7915,
>> "Maximum_Capacity": 150,
>> "Current_Capacity": 10
>> }
3. POST http://localhost:8000/shelters/createShelter
> Body: JSON
> Example:
>
>> {
>> "Name": "Greensboro",
>> "Latitude": 36.0726,
>> "Longitude": 79.7915,
>> "Maximum_Capacity": 150,
>> "Current_Capacity": 10
>> }
>
> Response is JSON