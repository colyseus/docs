The core value of Colyseus is to make multiplayer game development simpler and accessible. 

Making multiplayer games is usually tricky because your **gameplay** must take the multiple delays into account (the other clients sending data to the server, and the server sending data back to all clients). It's the art of faking something that has already happened is actually happening as the current player sees and plays the game.

### Authoritative game server

Colyseus is an authoritative server. This means mostly every action from the client should be validated on the server first, and then sent back to the clients. The server should take care of all data involved in your game, such as positioning, speeds, collisions, etc.

## FAQ

> How would I send the users data then visually represent them?

Sending `x` / `y` positions from the client to the server is generally a bad idea. You'd want to send **actions** instead, and calculate the position change **in the server**. The updated position will be available in the client when the patch message arrives.