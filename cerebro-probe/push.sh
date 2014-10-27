curl -X POST \
  -H "X-Parse-Application-Id: GFkfk3rwmiBmuXWrA39xq8h7Phvc9ThUSLGc97c5" \
  -H "X-Parse-REST-API-Key: wVY5GAaYK1yL2W95gY5QVWLSxMUQYsDRQALQzXtG" \
  -H "Content-Type: application/json" \
  -d '{
        "channels": ["default"],
        "data": {
          "type":"Activate"
        }
      }' \
  https://api.parse.com/1/push 
#"expiration_time": "2014-10-31T20:37:28Z",