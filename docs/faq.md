# Frequently Asked Questions

### How would I broadcast data from one client to others?

You usually don't do that. By using an authoritative game server, the clients generally send **actions** to the server, and the server **mutates** the state of the game session. After having the mutation, all clients will receive the latest state from the server in the next patch interval.

### Do I need client-prediction in my game? Does Colyseus help me with this?

Colyseus does not provide any client-prediction solution out of the box. Games such as [wilds.io](http://wilds.io/) and [crashracing.com](https://crashracing.com/) do not use any form of client-prediction. [`lerp`](http://gamestd.io/mathf/globals.html#lerp)ing user coordinates usually gives reasonable results.
