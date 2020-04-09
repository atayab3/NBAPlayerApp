// Once the user hits 'Find Player' use API of players with search filter
// 	need to find way to check json/array size
// 	if json returns 1 - player found so retrieve their ID
// 	if json is size 0 - not found
// 	if json is more than one, give user a list of options
	
// if json returns size 1 and we have the ID
// 	now we use the season averages data, starting with current year 2019, and subtract one 
// 	and if undefined means returns that means the  year before was their rookie season
	
	
// 	need buttons for options - pts, rebs, assts, fg%, 3pt%, 
// 	need to learn how to make a chart video of Hayes
// 		I KNOW I CAN DO THIS

let apiEndpoint = "https://www.balldontlie.io/api/v1/players";

var curSeason = 2019;
	///?search=lebron_james - UNDERSCORE WORKS

var playerID;
var desiredStats = ["pts", "reb", "ast"];
//finding ID from whatever string/player name user enters and presses click

document.getElementById("findPlayer").addEventListener("click",  (e)=> {
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
					 getAnnualStats(json.data[0]["id"], curSeason);// REPLACE THIS CALL 
				 }
				 
				
			    
				 // need to account for CASE that name/id does not exist
				 
		})
 
 })

function spaceRemover(pName){
	if( pName.includes(" ") == true ){
		var newName = pName.replace(" ", "_");
	}
	console.log(newName);

	return newName;
}




//working to get STATS FROM MULTIPLE SEASONS


function getStats(playerID, curSeason){
	var returnable;
let newApi = "https://www.balldontlie.io/api/v1/season_averages/" + "?season=" + curSeason
			+ "&player_ids[]=" + playerID ;
	console.log(newApi);
	fetch(newApi)
		.then(response => {
		return response.json()   
		} ) 
		.then(  json => {
			// MAKE A LOOP HERE THAT CONTINUES UNTIL !== undefined keep subtracting year, probably have 
			// 2005 as the lowpoint for now 
			// if json == UNDEFINED??
			console.log(json.data[0]["pts"]);
			returnable=  json.data[0]["pts"];
		})
	return returnable;
}

function getAnnualStats(playerID, curSeason){
	// gonna returns an array of whatever stats you want, for know using pts
	var yearlyPts = [];
	for(var i = curSeason; i > 2011; i--){
		yearlyPts.push(getStats(playerID, i));
	}
	console.log(yearlyPts);
	return yearlyPts;
// 	
}
	//"https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=1&player_ids[]=2";
	
//ok from my understand use the name and player api to find the ID
//then use the ID to get statistics and parameters are specified 
//
//IDEAS
//Stat Comparer
//Or single player line graphs to show progression, should x axis be age or be season?
	//"https://www.balldontlie.io/api/v1/season_averages?player_ids[]=237";
	
	//ATLANTA HAWKS//"https://www.balldontlie.io/api/v1/teams/1";
	
	//"https://www.balldontlie.io/api/v1/players?search=davis?search=anthony";

// GETTING FIRST 5 Player - doesnt work for getting BIG VALUES
// var i = 1;
// while(i < 5){
// 	
// 	i++;
// }



