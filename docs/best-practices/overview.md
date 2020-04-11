# Best practices with Colyseus

!!! Warning "Important"
    This section needs improvement and more examples! Each paragraph needs it's own page with thorough examples and better explanation.

- Keep your room classes as small as possible, without game logic.
- Keep your synchronizeable data structures as small as possible
    - Ideally, each class extending `Schema` should only have field definitions.
    - Custom getters and setters methods can be implemented, as long as you don't have game logic in them.
- Your game logic should be handled by other structures, such as:
    - See how to use the [Command Pattern](/best-practices/command-pattern/).
    - An Entity-Component System WE NEED ONE THAT WORKS WELL WITH COLYSEUS PLEASE HELP