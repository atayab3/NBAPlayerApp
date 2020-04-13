// The second element will depend on which button is clicked, points is the default





let apiEndpoint = "https://www.balldontlie.io/api/v1/players";
var curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS

var dataArr = [] ; // 2D Array for chart data
 // doesn't have to be Points, will have buttons that choose the stat
var yearlyPts = []; // the specific stat per year that feeds the 2D Array
var urlArray = []; // all the urls to fetchALL promise shit



document.getElementById("findPlayer").addEventListener("click",  (e)=> {
				createDataArr();
				console.log("array of Data is:");
				console.log(dataArr);
				console.log("checking first element");
				console.log(dataArr[0]);
				console.log("checking 2nd elemesnt");
				console.log(dataArr[1]);
				console.log(dataArr);
				
	
	
	// Need to disable button or go to next screen
	//document.getElementById('save').setAttribute('mydata','myData'); 
 })

createDataArr = ()=>{
	 let pName = document.getElementById("text-field-hero-input").value;
	 var playerID;
	// remove the space between first and last name and put underscore for search purposes
	 pName = spaceRemover(pName); 
	 
	 let nbaApi = apiEndpoint + "/?search=" + pName;
	
	 fetch(nbaApi)
		.then(response => {return response.json()   } ) 
		.then(  json => {
// 				console.log(json);
				var searchResultSize = json.meta["total_count"];
				 if (searchResultSize == 1){// if that player exists
					 
					 playerID = json.data[0]["id"];
					 urlArray = getUrls(playerID, curSeason);
// 					 console.log(urlArray); // all the urls for api Endpoints
					 
					 
					 fetchData(urlArray).then (responses => {
						
// 						console.log("the array of responses",responses);
					    dataArr= seeIfTakeInResponses(responses);
						
						 dataArr = dataArr.reverse();
						 console.log("IN IF STATEMENT -- array of Data is:");
						console.log(dataArr);
						console.log("checking first element");
						console.log(dataArr[0]);
						console.log("IN IF STATEMENT -- checking 2nd elemesnt");
						console.log(dataArr[1]);
						 google.charts.load('current', {'packages':['corechart']});
						google.charts.setOnLoadCallback(drawChart );
// 						 console.log(dataArr);
// 						  let p1 = document.createElement("p");
// 						  p1.textContent = dataArr;
// 						  document.getElementById("arrayHere").appendChild(p1);

					})
 
// 					 transferData(yearlyPts, dataArr, curSeason);

				 }
				 else if(searchResultSize == 0){// need to account for CASE that name/id does not exist
					 console.log("Whoops, player does not exist");
					 // do a different search with the name before or aftr the space - 
					 // make a different space function for that 
					 // then ask did u mean???  and these players names
				 }
				 else{ // 	if json is more than one, give user a list of options
					 console.log("Multiple players with this name exist, further action required");					
				 }
		})
}

seeIfTakeInResponses = (respondent) =>{
	var tempArr = [];
	var  dataTwoDArray = [];
	dataTwoDArray.push(['Year', 'Points']);
	console.log("inside helper function");
// 	console.log(respondent.length);
	for(var x = 0; x < respondent.length; x++){		
		var curYear = respondent[x].data[0]["season"];
		var curYearString = curYear.toString();
		var curStat = respondent[x].data[0]["pts"];
		tempArr = [curYearString, curStat];
		dataTwoDArray.unshift(tempArr);
		
	}
	return dataTwoDArray;
	
} 

// transferData = (yearlyPts, dataArr, curSeason) =>{
// 	// I really like this function, but if the overall app is too slow will do the shorter way of creating 2d array
// 	var i = 0 ;
// 	curSeason = 2019;
// 	tempArr = [];
// 	var yearString;
// 	console.log(yearlyPts.length + "# length");
// 	for (i = 0 ; i < yearlyPts.length; ++i ){
// 			console.log("Enters the loop")
// 			yearString = curSeason.toString();
// 			tempArr = [yearString, yearlyPts[i]];
// 			dataArr.push(tempArr);
// 			curSeason = curSeason - 1;
// 	}
// 	console.log(dataArr);
// 	return dataArr;
	
// }



getUrls = (playerId, curSeason ) =>{
	var newApi; 
	var i =0;
	var urlArr = [];
	for(i = curSeason ; i > 2010; i--){
		newApi = "https://www.balldontlie.io/api/v1/season_averages/" 
			+ "?season=" + i
			+ "&player_ids[]=" + playerId ;
		urlArr.unshift(newApi);
	}
	return urlArr;
}

//Function from Hayes
fetchData = (urlsArr) => {
  const allRequests = urlsArr.map(url => 
    fetch(url).then(response => response.json())
  );
  return Promise.all(allRequests);
};
        
spaceRemover = (pName) =>{
	if( pName.includes(" ") == true ){
		var newName = pName.replace(" ", "_");
	}
	console.log(newName);

	return newName;
}

// const hideViews = () => {
//       document.querySelectorAll(div) {//.forEach( (item) => {
//         item.style.display = "none";
//       }
    
// getStats = (playerID, curSeason, tempArr) => {
// 	var returnable;
// 	let newApi = "https://www.balldontlie.io/api/v1/season_averages/" 
// 			+ "?season=" + curSeason
// 			+ "&player_ids[]=" + playerID ;
// // 	console.log(newApi);
// 	fetch(newApi)
// 		.then(response => {  return response.json() } ) 
	
// 		.then(  json => {
// 		returnable =  json.data[0]["pts"];
		
// 		tempArr.push(returnable);
// // 		console.log("returnable is " + returnable);
// 		})

// }

// getAnnualStats = (playerID, curSeason) =>{
// 	// gonna returns an array of whatever stats you want, for know using pts
// // 	var annualPts;
// 	let tempArr = []; // let defines blck scope var
// 	var tempX ;
// 	for(var i = curSeason; i > 2011; i--){
// 		getStats(playerID, i, tempArr)
// 	}//need to wait till all have been retreived 
// 	asynchronous 
// 	console.log(tempArr);
// 	console.log("tempArr length is " + tempArr["length"] );
// 	return tempArr;
// }



	//"https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=1&player_ids[]=2";
	
//ok from my understand use the name and player api to find the ID
//then use the ID to get statistics and parameters are specified 
//
//IDEASStat Comparer
//Or single player line graphs to show progression, should x axis be age or be season?
	//"https://www.balldontlie.io/api/v1/season_averages?player_ids[]=237";
	
	//ATLANTA HAWKS//"https://www.balldontlie.io/api/v1/teams/1";
	
	//"https://www.balldontlie.io/api/v1/players?search=davis?search=anthony";

	 
      



      drawChart = ()=> {
        var data = google.visualization.arrayToDataTable(dataArr);
		console.log("In draw chart, data is:");
		console.log(data);
        var options = {
          title: 'Stats per Season',
//           curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }