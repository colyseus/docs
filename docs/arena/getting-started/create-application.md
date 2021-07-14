# Your First Application

## Requirements

* [Sign-up](https://https://console.colyseus.io/register) for a Arena Cloud Account 
* Have a Colyseus server implemented using the latest npm template [Create A Colyseus Server](../colyseus/#creating-a-barebones-colyseus-server)

## Creating an Arena Application

### Create a new deployment

Your game or application can have many app deployments which are used to separate your environments (Dev, Staging, Prod) and/or regions (US East, EU West, AP South). Each app deployment has its own dedicated resources pool and works independently for all other deployments managed by your account. 

To get started create your first app deployment...

![New Application Button](../../images/create-new-app.jpg)

- After logging select **Create A New App** on the top right side of the dashboard.

- Fill in the application detail fields and select your *Plan* and *Region*

- If you have an **Arena Code** provided with your early access email enter it in the *Code* field.

![Sign-up Flow](../../images/create-app.jpg)

- Submit and wait for your application to be created

!!! NOTE
    New Application deployments can take up to 2 mins depending on region

### Your Application Dashboard

Select **Manage** on your newly created application to see your application overview console. From here you can see a snapshot of your application activity.

![Arena Application Management View](../../images/app-manage-details.jpg)

- **Current Usage:** Displays current CCU over your current Arena plan limits (if any)
- **Connection:** the URL and Ports that provide access to your application
- **API Key:** A unique reference identifier for your application that can be used to access the application deployment via the Arena Public API's
- **Arena Plan:** The current hosting plan your application is enrolled in.
- ***GIT Updated:*** Info from the most recent GIT update.
- ***GIT Msg:*** The check-in message for the most recent update.
- ***GIT Hash:*** Hash for the most recent update.
!!! NOTE
    Only ***GIT*** details are ***ONLY*** visible when using CI/CD GitSync Service (Provide for Powered Ascent and Up Arena Plans)

### Uploading your Application code

At the bottom left side of the Application dashboard select **Server Code** to access the integrated web IDE and Uploader. 

![Arena Application Management View](../../images/edit-server-code.jpg)

From this screen you can **CREATE**, **DELETE**, **UPLOAD** and **DEPLOY** code to your deployments game server fleet. Select **Upload** to open up the dialog, from here you can choose to upload a single file or upload a folder. 

![Arena Application Management View](../../images/upload-dialog.jpg)

!!! NOTE
    - Arena Applications **ONLY SUPPORTS** compiled Javascript code, if you are using TypeScript be sure to BUILD your code first and upload the content of the build folder.
    - If you used the ***NPM*** template to create your Colyseus server the ``` npm run build ``` command will compile and copy all required files into your output folder.
