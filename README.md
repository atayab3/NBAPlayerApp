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
    Link to NY Times API: https://developer.nytimes.com/docs/articlesearch-product/1/overview
    
Visualizations:

    I used Google Charts to form a line chart with the data fetch from the balldontlie statistics api. The x-axis is the year and the y-axis is the stat the user has chosen to view. 
    Line Chart link: https://developers.google.com/chart/interactive/docs/gallery/linechart

IndexedDB:

    I used Dexie to store the fetched data regarding individual player statistics into a backend database. This helps because fetching over and over in order to view different stats of the same player resutls in a Too Many Requests Error. I also delete and create a new Dexie DB whenever a new player is searched for.
    Link: https://dexie.org/    
    TO DO :  I plan on deleting the DB less so that I can compare the graphed stats of multiple players.

Hardware Feature (Microphone):

    I utilized the Web Speech API for speech recognition so that users do not have to type the name of the player if they are unaware of the spelling. 
    The link tutorial that I followed and learned from is: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
    
    However, the spoken input only fills up the text field where the player name goes if it is contained in a list I created of most popular NBA players. I generated the datalist by putting NBA Legends from the early 2000s as well the top 100 players of the 2020 season according to Sports Illustrated.
    SI Link to article: https://www.si.com/nba/2019/09/12/top-100-nba-players-2020

Service Worker: 
   
    We learned about using Service Workers in a lecture by Professor David Hayes on 04/08/2020, in which the following tutorial was discussed: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

Web App Manifest:

    Learned about creating Web App Manifest at: https://developer.mozilla.org/en-US/docs/Web/Manifest



Overview of ball.js code: 

    Takes in user input and replaces any spaces with an underscore so that it can be searchable with the ball dont lie API.
    Creates the url/API endpoint and calls
    getUrls()  returns array of URLS with a specific player(ID) from the 1996 all the way to 2020 and then call
    fetchData() which uses Promise.all to fetch multiple requests from the urlsArray and then call
    For every request that does not return undefined add player info and stats to DataBase, then call
    turnDBtoArray() which default is called and uses the DB to make an 2D array and chart for years and points.
    If another button for a different stat is clicked then turnDBtoArray() is clicked but now generates a different graph


    Sections for News Searches and NYTIMES API
    
    If Search Again is clicked the DB are deleted and re-enable the find Player button as well as clear the text field where players names were.
    
    
TO DO LIST (for Summer Months) : 
    
    Fix image view on demo-cards.
    Ask user for permissions regarding Microphone
    Visualize mic turning off and on with green and red colors
    getting clearNews function to work 
    Find a secondary way to improve dataList names because it only includes 120 of the most pop players ATM .
//Searches for name with underscore
// creates URLs for each api endpoint year, up til 2000
// returns 2D array of years - points 
// uses that to make a line chart for the statistic
    
    
    
    
    
    
    
    
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
