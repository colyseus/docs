# Troubleshooting / Issues

## Server Launch Error
The following are the most commonly reported issues when deploying an application to Colyseus Arena.

### prelaunch-actions.sh - not found or bad variable name 
This error is typical caused by an issue in your `arena.env` or `arena.secret.env` file. To correct this error make sure you are using the correct format with no additional lines or whitespace between you variable and values. The file should look like the following.
```
NODE_ENV=production
ABC=123
TEST=banana
```
!!! NOTE   
    - These is no space between the **=** and the variable or value. 

### Cannot find module '@colyseus/core' 
Review the logs at the start of your serve and ensure NPM install completed. Missing modules, incompatible dependency may be the issue. 
!!! NOTE   
    - @colyseus/social is no longer supported and will cause the above issue if used on Arena. An improved login auth system is on the Colyseus roadmap for future release.

## Connectivity / Networking Errors

### Random Server Shutdowns / Disconnect when many players are connected
Colyseus provides great flexibility to developers to create authoritative server code. Depending on the complexity of your server code and how much simulation is done on the server you may see problems as your user base grows. By default Colyseus Arena deployments are set to a ratio of 100 CCUs per server. In practice however this number may be too small or too large depending on the game. If you are seeing the above issue open a support ticket and our team will reach out and work with you to find the right configuration to meet your games needs.
!!! NOTE   
    - Future dashboard updates will provide direct control over this value and other server setting.
