let apiEndpoint = "https://www.balldontlie.io/api/v1/players";
var curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS

var statTitles = ["Points", "Rebounds", "Assists", "Field Goal %", "3-Point Field Goal Percentage"];//, "Steals", "Blocks", "FG%", "3Pt FG%" 
var statVars = ["points", "rebounds", "assists", "fgPercent", "threePercent"];

var dataArr = [] ; // 2D Array for chart data
var yearlyPts = []; // the specific stat per year that feeds the 2D Array
var urlArray = []; // all the urls to fetchALL promise shit

var statTitle ;
var PlayerName; 
var playerPosition; 
var playerTeam; 


          // Define your database
         
var db ;
// = new Dexie("stats_database");
// 	db.version(1).stores({
// 		stats: '++entry, playerID, year, points, rebounds, assists, fgPercent, threePercent'
//      });
          



createPlayerInfoBox = ()=>{
	let nameElement = document.createElement('h1');
	nameElement.textContent = playerName ;
	document.getElementById("playerInfo").appendChild(nameElement);
}

//Searches for name with underscore
// creates URLs for each api endpoint year, up til 2000
// returns 2D array of years - points 
// uses that to make a line chart for the statistic
createDataChart = (stringStat)=>{
	 let pName = document.getElementById("text-field-hero-input").value;
	 
	 var playerID;
	// remove the space between first and last name and put underscore for search purposes
	 pName = spaceRemover(pName); 
	 
	 let nbaApi = apiEndpoint + "/?search=" + pName;
	
	 fetch(nbaApi)
		.then(response => {return response.json()   } ) 
		.then(  json => {
				 console.log("addam");
				 console.log(json);
				var searchResultSize = json.meta["total_count"];
		 		 
				 if (searchResultSize == 1){// if that player exists
					 document.getElementById("findPlayer").disabled = true;
					 playerName = json.data[0]["first_name"] + " " + json.data[0]["last_name"];
					 playerTeam = json.data[0]["team"]["full_name"];
					 playerPosition = json.data[0]["position"];
// 					 createPlayerInfoBox();
// 					 
// 					 
					 playerID = json.data[0]["id"];
					 urlArray = getUrls(playerID, curSeason);
					 
					 fetchData(urlArray).then (responses => {//PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 
						
					//put info into the database
					createAnnualStatsDB(responses);
					
					dataArr = turnDBtoArray(stringStat);
				 
						 // go to next screen
						document.body.style.backgroundColor = "#436372";
						document.querySelector("#searchScreen").style.display = "none";
						document.querySelector("#buttonsScreen").style.display = "block";

					}  )
				 }//end if statement	 
				 else if(searchResultSize == 0){ //account for CASE that name/id does not exist	
					 // stay on search screen
					 document.querySelector("#searchScreen").style.display = "block";
						document.querySelector("#buttonsScreen").style.display = "none";
					let p1 = document.createElement("p");
					p1.textContent = "Whoops, player does not exist, check spelling";
					document.getElementById("addValuesHere").appendChild(p1);
					 // IDEAS: will handle this case later
					 // using datalist
				 }
		 
		 
				 else{ // 	if json is more than one, give user a list of options
					 console.log("Multiple players with this name exist, further action required");	
					
				 }
		})
}



createAnnualStatsDB  = (respondent ) =>{//PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 

// 	IDEA: OPTIMIZE LATER
	for(var x = 0; x < respondent.length; x++){
		if(respondent[x].data[0] == undefined){ 
			console.log("undefined found at year " + x);
			continue;
		}
		else{
// 			console.log(respondent[x].data[0]);
			db.stats.add({
				playerID: respondent[x].data[0]["player_id"],
				year: respondent[x].data[0]["season"],
				points: respondent[x].data[0]["pts"],
				rebounds: respondent[x].data[0]["reb"],
				assists: respondent[x].data[0]["ast"],
				fgPercent: respondent[x].data[0]["fg_pct"],
				threePercent: respondent[x].data[0]["fg3_pct"]				
			})
		} // end else	
	} // end for loop 
	
} 


turnDBtoArray = (stringStat) =>{
		console.log(stringStat);
		var tempArr = [];
		var TwoDArr = [];
	
		TwoDArr.push(['Year', stringStat]);
		console.log("inside turnDBtoArray function ");
		var curYear ;// = respondent[x].data[0]["season"];
		var curYearString;// = curYear.toString();
		var newArr;
		db.stats.toArray()
		.then( (arr)=> {
			for(var i = 0 ; i < arr.length; ++i){
				console.log("get done to business");
				curYear = arr[i]["year"];
				curYearString = curYear.toString();
				
				tempArr = [curYearString, arr[i][stringStat] ]; // need to put String Stat here
				TwoDArr.push(tempArr);

				
			}
				console.log(TwoDArr);
				dataArr = TwoDArr;
				google.charts.load('current', {'packages':['corechart']});
				google.charts.setOnLoadCallback(drawChart ); 
	} )
	return TwoDArr; 
}

// retrieveDBInfo = () => {
// 	// Let us open our database
// 	let x ;
// db.stats.get(1, function (firstYear) {
// 	x = firstYear.points
//     console.log("Points with id 1: " + firstYear.points);
// });
// 	console.log("what is x in retrieveDBInfo");
// 	console.log(x);
// }

// returns array of URLS with a specific player(ID) from the current season all the way to 2011
getUrls = (playerId, curSeason ) =>{
	var newApi; 
	var i =0;
	var urlArr = [];
	for(i = curSeason ; i >= 1996; i--){
		newApi = "https://www.balldontlie.io/api/v1/season_averages/" 
			+ "?season=" + i
			+ "&player_ids[]=" + playerId ;
		urlArr.unshift(newApi);
	}
// 	console.log("url array");
// 	console.log(urlArr);
	return urlArr;
}

//Function from Hayes // using Promise.All to fetch multiple requests
//pass in all apiEndpoints to fetches the data for all - still kind of confused by this
fetchData = (urlsArr) => { //PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP repeated FETCHING 
  const allRequests = urlsArr.map(url => 
								  
    fetch(url).then(response => response.json())
								  
  );
  return Promise.all(allRequests);
};
        

//spaceRemover takes in user inputted string and makes it searchable within API Endpoint
spaceRemover = (pName) =>{
	if( pName.includes(" ") == true ){
		var newName = pName.replace(" ", "_");
	}
	return newName;   //console.log(newName);
}
      
let topPlayers = ["Andrew Wiggins", "Terrence Ross", "DeAndre Jordan", "Jarrett Allen", "Kyle Kuzma", "Joe Harris",
					"Dejounte Murray", "Bam Adebayo", "Spencer Dinwiddie", "Derrick White", "Zach LaVine", "Danny Green",
					"Jonas Valančiūnas", "Jeff Teague", "Dwight Howard", "Andre Iguodala", "Brandon Ingram", "Al-Farouq Aminu", "Jaren Jackson Jr.", 
					"Marcus Smart", "Patrick Beverley", "Serge Ibaka", "Julius Randle", "Jusuf Nurkić", "Montrezl Harrell",
					"Domantas Sabonis", "Lauri Markkanen", "P.J. Tucker", "Ricky Rubio", "Harrison Barnes", "Josh Richardson",
					"Thaddeus Young", "Caris LeVert", "Jaylen Brown", "JJ Redick", "Brook Lopez", "Joe Ingles", "Robert Covington",
					 "Eric Gordon", "Trae Young", "Malcolm Brogdon", "Ray Allen", "Paul Pierce", "Rajon Rondo", 
					 "Aaron Gordon", "Gordon Hayward", "Klay Thompson", "Chris Bosh", "Otto Porter", "Clint Capela", "Derrick Favors",
					 "Buddy Hield", "Lou Williams", "Bojan Bogdanović","John Collins", "Danilo Gallinari",
					 "Tobias Harris", "Gary Harris", "Myles Turner", "Eric Bledsoe", "Nikola Vucevic", "D'Angelo Russell",
					"Paul Millsap", "Marc Gasol", "Pau Gasol", "Kevin Love", "Steven Adams", "Victor Oladipo", "Jamal Murray", 
					"Kristaps Porzingis", "Andre Drummond", "Jayson Tatum",  "Devin Booker", "De'Aaron Fox", "CJ McCollum",
					 "DeMar DeRozan", "Luka Dončić", "Donovan Mitchell","Tony Parker", "Manu Ginobili", "Kyle Lowry","Khris Middleton", "Mike Conley",
					 "Jrue Holiday", "Pascal Siakam", "Ben Simmons", "Bradley Beal", "Chris Paul", "Kemba Walker", "John Wall", "DeMarcus Cousins",
					"Blake Griffin", "Al Horford", "Draymond Green", "Yao Ming", "Carmelo Anthony", "LaMarcus Aldridge", "Kyrie Irving","Rudy Gobert","Karl-Anthony Towns","Russell Westbrook",
					 "Jimmy Butler", "Damian Lillard", "Paul George", "Nikola Jokic", "Tracy McGrady","Joel Embiid", "Kevin Garnett", "Jason Kidd", "Steven Nash",
				     "Tim Duncan", "Allen Iverson",  "Dwyane Wade",  "Vince Carter", "Dirk Nowitzki", "Shaquille O'Neal", "Kobe Bryant",  "Anthony Davis","James Harden",
					"Stephen Curry", "Kevin Durant", "LeBron James", "Kawhi Leonard", "Giannis Antetokounmpo"]
console.log("Data List from https://www.si.com/nba/2019/09/12/top-100-nba-players-2020 and some NBA legends of the 2000s that I chose");

createSearchList = () => {
	
	for(var i = topPlayers.length-1 ; i >= 0; --i){
		let dataOption = document.createElement("option");
		dataOption.value = topPlayers[i];
		document.getElementById("browsers").appendChild(dataOption);
	}
	
	
}


drawChart = ()=> {
	
	console.log("in drawChart");
	console.log(dataArr);
	var vAxis2 ;
	 if(statTitle == "3-Point Field Goal Percentage" || statTitle == "Field Goal %" ){
			  vAxis2 = { minValue: 0, maxValue: 1 };
	}
	else if(statTitle == "Rebounds" || statTitle == "Assists" ){
			vAxis2 = { minValue: 0, maxValue: 20 };
	}
	else{
			 vAxis2 = { minValue: 0, maxValue: 40 };
	 }
        var data = google.visualization.arrayToDataTable(dataArr);

        var options = {
          title: playerName + " " + statTitle + " Per Game over the Seasons",
          legend: { position: 'bottom' },
		  vAxis: vAxis2,
		  pointSize: 5,
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
		
      }


// buttons to bring up different graphs
clickedBtn = () =>{
	
		document.getElementById("pts").addEventListener("click",  (e)=> {
					statTitle = statTitles[0];
					dataArr = turnDBtoArray("points");	
		})
		document.getElementById("reb").addEventListener("click",  (e)=> {
					statTitle = statTitles[1];
					dataArr = turnDBtoArray("rebounds");		
		})
		document.getElementById("ast").addEventListener("click",  (e)=> {
					statTitle = statTitles[2];
					dataArr = turnDBtoArray("assists");
		})
		document.getElementById("fg-percent").addEventListener("click",  (e)=> {
					statTitle = statTitles[3];
					dataArr = turnDBtoArray(statVars[3]);
		})
		document.getElementById("fg3-percent").addEventListener("click",  (e)=> {
					statTitle = statTitles[4];
					dataArr = turnDBtoArray(statVars[4]);
		})
	
}

//Initial Screen Displays -which are on and off
document.querySelector("#infoScreen").style.display = "block";
document.querySelector("#searchScreen").style.display = "none";
document.querySelector("#buttonsScreen").style.display = "none";

// Screen Transitions from Info Screen to Searching Screen
document.getElementById("goSearch").addEventListener("click",  (e)=> {  
			Dexie.delete('stats_database');
			createSearchList();
			document.querySelector("#infoScreen").style.display =  "none";
			document.querySelector("#searchScreen").style.display = "block";
	
} )

// Find Player Button creates graph 
document.getElementById("findPlayer").addEventListener("click",  (e)=> {
			console.log("Find Player button clicked");
			
			db = new Dexie("stats_database"); 
			db.version(1).stores({
				stats: '++entry, playerID, year, points, rebounds, assists, fgPercent, threePercent'
			 });
			statTitle = statTitles[0];
			createDataChart("points"); 					
		})



//Search Again Button 

document.getElementById("searchAgain").addEventListener("click",  (e)=> {
			console.log("search Again button clicked");
			Dexie.delete('stats_database');
			document.getElementById("findPlayer").disabled = false;
			document.body.style.backgroundColor = "#f6f6f2";
			
			document.getElementById("text-field-hero-input").value = "";
			document.querySelector("#buttonsScreen").style.display =  "none";
			document.querySelector("#searchScreen").style.display = "block";
		})

clickedBtn();