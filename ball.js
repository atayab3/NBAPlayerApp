// 		I KNOW I CAN DO THIS

let apiEndpoint = "https://www.balldontlie.io/api/v1/players";

var curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS

var playerID;
var desiredStats = ["pts", "reb", "ast"];// need buttons linked to options - pts, rebs, assts, fg%, 3pt%, 

var dataArr = [] ;
// The second element will depend on which button is clicked, points is the default
dataArr.push(["Year", "Points"]);
console.log(dataArr);
var yearlyPts = [];
//finding ID from whatever string/player name user enters and presses click

document.getElementById("findPlayer").addEventListener("click",  (e)=> {
				createDataArr();
 
 })



createDataArr = ()=>{
	 let pName = document.getElementById("text-field-hero-input").value;
	
	// remove the space between first and last name and put underscore for search purposes
	 pName = spaceRemover(pName); 
	 
	 let nbaApi = apiEndpoint + "/?search=" + pName;
	 console.log(nbaApi);
	 fetch(nbaApi)
		.then(response => {
		return response.json()   
		} ) 
		.then(  json => {
				console.log(json);
				var searchResultSize = json.meta["total_count"];
				 if (searchResultSize == 1){// if that player exists
					 
					 
					 yearlyPts = getAnnualStats(json.data[0]["id"], curSeason, yearlyPts);
					 console.log("Here" + yearlyPts);
					 
					 transferData(yearlyPts, dataArr, curSeason);

					 
				 }
				 else if(searchResultSize == 0){// need to account for CASE that name/id does not exist
					 console.log("Whoops, player does not exist");
					 // do a different search with the name before or aftr the space - 
					 // make a different space function for that 
					 // then ask did u mean???  and these players names
				 }
				 else{
					 console.log("Multiple players with this name exist, further action required");
					 // 	if json is more than one, give user a list of options
				 }
				 
				 
		})
	
}



function spaceRemover(pName){
	if( pName.includes(" ") == true ){
		var newName = pName.replace(" ", "_");
	}
	console.log(newName);

	return newName;
}


getStats = (playerID, curSeason, yearlyPts) => {
	var returnable;
	let newApi = "https://www.balldontlie.io/api/v1/season_averages/" 
			+ "?season=" + curSeason
			+ "&player_ids[]=" + playerID ;
// 	console.log(newApi);
	fetch(newApi)
		.then(response => {  return response.json() } ) 
		.then(  json => {
		returnable =  json.data[0]["pts"];
		yearlyPts.push(returnable);
// 		console.log("returnable is " + returnable);
// 		return returnable;
		})
	
}

getAnnualStats = (playerID, curSeason, yearlyPts) =>{
	// gonna returns an array of whatever stats you want, for know using pts
// 	var annualPts;
	
	var tempX ;
	for(var i = curSeason; i > 2011; i--){
		getStats(playerID, i, yearlyPts)
	}
	
	console.log(yearlyPts);
	console.log("yearlyPts length is " + yearlyPts["length"] );
	return yearlyPts;
}

transferData = (yearlyPts, dataArr, curSeason) =>{
	// I really like this function, but if the overall app is too slow will do the shorter way of creating 2d array
	var i = 0 ;
	curSeason = 2019;
	tempArr = [];
	var yearString;
	console.log(yearlyPts.length + "# length");
	for (i = 0 ; i < yearlyPts.length; ++i ){
			console.log("Enters the loop")
			yearString = curSeason.toString();
			tempArr = [yearString, yearlyPts[i]];
			dataArr.push(tempArr);
			curSeason = curSeason - 1;
	}
	console.log(dataArr);
	return dataArr;
	
}
	//"https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=1&player_ids[]=2";
	
//ok from my understand use the name and player api to find the ID
//then use the ID to get statistics and parameters are specified 
//
//IDEASStat Comparer
//Or single player line graphs to show progression, should x axis be age or be season?
	//"https://www.balldontlie.io/api/v1/season_averages?player_ids[]=237";
	
	//ATLANTA HAWKS//"https://www.balldontlie.io/api/v1/teams/1";
	
	//"https://www.balldontlie.io/api/v1/players?search=davis?search=anthony";

	 
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(
		[
          ['Year', 'Points'],
          ["2004",  1000],
          ["2005",  1170],
          ["2006",  660],
          ["2007",  1030]
        ]
		);

        var options = {
          title: 'Stats per Season',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
