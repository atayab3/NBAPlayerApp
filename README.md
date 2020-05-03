Coded by Adam Tayabali in April/May 2020 

This project was done as my Final Project for IT 202 (Mobile Web Application Development) during the Spring 2020 Semester. The requirements were as follows: 

    UI built using Material Components for the Web
  
    Retrieves data from at least two different endpoints;
  
  Includes a visualization (map, chart, or ?);
  
  Stores and retrieves data from the IndexedDB;
  
  Utilizes some hardware feature (sensor, camera, microphone, etc);
  
  Includes a Service Worker;-----Functions offline (due to cached assets);
  
  Installs on device (due to Web App Manifest)

Here are some details regarding how I programmed the many parts of this application.

Material Components: 

The main Material Components for the Web that I used included buttons, text fields, cards, and tab bars.

APIS:
To gain stats on various NBA Players - I utilized the BallDontLie Api, an open source project created by ynnadkrap (github username).

Link to info: https://www.balldontlie.io/#introduction

To get player mentions in the NY Times I used their Article Search API. I must stress that the use of this API was for NON-COMMERICAL USE ONLY as I did not profit nor intend to profit from the use of this API. 

Visualizations:

I used Google Charts to form a line chart with the data fetch from the balldontlie statistics api. The x-axis is the year and the y-axis is the stat the user has chosen to view. 

Line Chart link: https://developers.google.com/chart/interactive/docs/gallery/linechart








### Getting started
There are various things you can do to quickly and efficiently configure your Codio Box to your exact requirements. 

### GUI Applications and the Virtual Desktop 
The Virtual Desktop allows you auto develop GUI based applications using any programming language. You can install a Virtual Desktop in your Box. You can then start the desktop and view it within the Codio IDE or in a new browser tab.

[Virtual Desktop documentation](https://codio.com/docs/ide/boxes/installsw/gui/)


### Command line access and the Terminal window
All Codio Boxes provide sudo level privileges to the underlying Ubuntu server. This means you can install and configure any component you like. You access the terminal from the **Tools->Terminal** menu item.

### Debugger
The Codio IDE comes with a powerful visual debugger. Currently we support Python, Java, C, C++ and NodeJS. Other languages can be added on request.

[Debugger documentation](https://codio.com/docs/ide/features/debugging/)


### Content authoring and assessments
Codio comes with a very powerful content authoring tool, Codio Guides. Guides is also where you create all forms of auto-graded assessments. 

- [Guides documentation](https://codio.com/docs/content/authoring/overview/)
- [Assessments documentation](https://codio.com/docs/content/authoring/assessments/)

### Templating Box configurations and projects
Codio offers two very powerful templating options so you can create new projects from those templates with just a couple of clicks. **Stacks** allow you to create snapshots of the Box’s underlying software configuration. You can then create new projects from a Stack avoiding having to configure anew each time you start a new project. **Starter Packs** allow you to template an entire project, including workspace code.

- [Stacks documentation](https://codio.com/docs/project/stacks/)
- [Starter Packs documentation](https://codio.com/docs/project/packs/)

### Install software
You can always install software onto your Box using the command line. However, Codio offers a shortcut for commonly installed components that can be accessed from the **Tools->Install Software** menu.

We can easily add new items to the Install Software screen, so feel free to submit requests.

[Install Software documentation](https://codio.com/docs/ide/boxes/installsw/box-parts/)
