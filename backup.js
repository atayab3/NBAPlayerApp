let apiEndpoint = "https://www.balldontlie.io/api/v1/players";
var curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS


var statTitles = ["Points", "Rebounds", "Assists", "Field Goal %", "3-Point Field Goal Percentage"];//, "Steals", "Blocks", "FG%", "3Pt FG%" 
var statVars = ["pts", "reb", "ast", "fg_pct", "fg3_pct"];

var dataArr = [] ; // 2D Array for chart data
var yearlyPts = []; // the specific stat per year that feeds the 2D Array
var urlArray = []; // all the urls to fetchALL promise shit

var statTitle ;
var PlayerName; 


          //
          // Define your database
         
var db = new Dexie("stats_database");
	db.version(1).stores({
		stats: '++entry, playerID, year, points, rebounds, assists, fgPercent, threePercent'
     });
          
// Put some data into it
//      db.friends.put({name: "Nicolas", shoeSize: 8}).then (function(){
              

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
				var searchResultSize = json.meta["total_count"];
		 		 
		 
				 if (searchResultSize == 1){// if that player exists
					 playerName = json.data[0]["first_name"] + " " + json.data[0]["last_name"]
					 playerID = json.data[0]["id"];
					 urlArray = getUrls(playerID, curSeason);
					 
					 fetchData(urlArray).then (responses => {//PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 
						
					 dataArr= getAnnualStats(responses, stringStat);
						
						dataArr = dataArr.reverse();
						console.log("IN IF STATEMENT -- array of Data is:");
						console.log(dataArr);
						 
						 // go to next screen
						document.querySelector("#searchScreen").style.display = "none";
						document.querySelector("#buttonsScreen").style.display = "block";
						 
						google.charts.load('current', {'packages':['corechart']});
						google.charts.setOnLoadCallback(drawChart );
						

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
					 // do a different search with the name before or aftr the space - 
					 // using datalist
					
				 }
		 
		 
				 else{ // 	if json is more than one, give user a list of options
					 console.log("Multiple players with this name exist, further action required");	
					
				 }
		 
		})
}



getAnnualStats  = (respondent, stringStat ) =>{//PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 
	var numUndefined = 0; // if surpasses 2 stop tracking data
	var tempArr = [];
	var  dataTwoDArray = [];
	dataTwoDArray.push(['Year', 'Points']);

// 	IDEA: USE boolean to indicate if previous was not undefined
// 	If previous was not undefined and not the current but next one is then stop adding to array

	for(var x = 0; x < respondent.length; x++){
// 		if(numUndefined == 2){ // does this even work????
// 			break;
// 		}
		if(respondent[x].data[0] == undefined){ // Kevin Durant test case// does this even work????
			console.log("undefined found at year " + x);

// 			IDEA adding 2 then going back one, another variable to stop after going back once
			continue;
		}
		else{

// 			console.log(respondent[x].data[0]);
			var curYear = respondent[x].data[0]["season"];
			var curYearString = curYear.toString();
			var curStat = respondent[x].data[0][ stringStat ];
			
			 
			tempArr = [curYearString, curStat];
			console.log(tempArr);
			dataTwoDArray.unshift(tempArr);
		}
		
	}
	console.log("testing 123");
	console.log(dataTwoDArray);
	return dataTwoDArray;
	
} 
















// returns array of URLS with a specific player(ID) from the current season all the way to 2011
getUrls = (playerId, curSeason ) =>{
	var newApi; 
	var i =0;
	var urlArr = [];
	for(i = curSeason ; i >= 2000; i--){
		newApi = "https://www.balldontlie.io/api/v1/season_averages/" 
			+ "?season=" + i
			+ "&player_ids[]=" + playerId ;
		urlArr.unshift(newApi);
	}
	console.log("url array");
	console.log(urlArr);
	return urlArr;
}

//Function from Hayes // using Promise.All to fetch multiple requests
//pass in all apiEndpoints to fetches the data for all - still kind of confused by this
fetchData = (urlsArr) => { //PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 
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
      

drawChart = ()=> {
		console.log("in drawChart");
	console.log(dataArr);
        var data = google.visualization.arrayToDataTable(dataArr);
// 		console.log("In draw chart, data is:");
// 		console.log(data);
        var options = {
          title: playerName + " " + statTitle + " Per Game over the Seasons",
//           curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }


// buttons to bring up different graphs
clickedBtn = () =>{
		document.getElementById("reb").addEventListener("click",  (e)=> {
					statTitle = statTitles[1];
					createDataChart(statVars[1]); 
		})
		document.getElementById("ast").addEventListener("click",  (e)=> {
					statTitle = statTitles[2];
					createDataChart(statVars[2]); 
		})
		document.getElementById("fg-percent").addEventListener("click",  (e)=> {
					statTitle = statTitles[3];
					createDataChart(statVars[3]); 
		})
		document.getElementById("fg3-percent").addEventListener("click",  (e)=> {
					statTitle = statTitles[4];
					createDataChart(statVars[4]); 
		})
	
}




document.querySelector("#infoScreen").style.display = "block";
document.querySelector("#searchScreen").style.display = "none";
document.querySelector("#buttonsScreen").style.display = "none";

// Screen Transitions
document.getElementById("goSearch").addEventListener("click",  (e)=> {  

	document.querySelector("#infoScreen").style.display =  "none";
	document.querySelector("#searchScreen").style.display = "block";


} )

document.getElementById("findPlayer").addEventListener("click",  (e)=> {
	statTitle = statTitles[0];
	createDataChart(statVars[0]); 
					
			
		})
clickedBtn();