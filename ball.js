let apiEndpoint = "https://www.balldontlie.io/api/v1/players";
var curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS

var statTitles = ["Points", "Rebounds", "Assists", "Steals", "Blocks" ];

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
	
// 		let target = item.getAttribute("href");
// 	document.querySelector(target).style.display = "block";
// 	
				document.querySelector("#searchScreen").style.display = "none";
				document.querySelector("#buttonsScreen").style.display = "block";
	
	
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
				var searchResultSize = json.meta["total_count"];
				 if (searchResultSize == 1){// if that player exists
					 
					 playerID = json.data[0]["id"];
					 urlArray = getUrls(playerID, curSeason);
					 console.log("In Url Array");
					 console.log(urlArray); // all the urls for api Endpoints
					 
					 fetchData(urlArray).then (responses => {
						
					 dataArr= getAnnualStats(responses);
						
					dataArr = dataArr.reverse();
					console.log("IN IF STATEMENT -- array of Data is:");
					console.log(dataArr);
					console.log("checking first element");
					console.log(dataArr[0]);
					console.log("IN IF STATEMENT -- checking 2nd elemesnt");
					console.log(dataArr[1]);
					google.charts.load('current', {'packages':['corechart']});
					google.charts.setOnLoadCallback(drawChart );

					})
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

getAnnualStats  = (respondent) =>{
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

//Function from Hayes // using Promise.All to fetch multiple requests
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
	return newName;   //console.log(newName);
}


      

drawChart = ()=> {
        var data = google.visualization.arrayToDataTable(dataArr);
		console.log("In draw chart, data is:");
		console.log(data);
        var options = {
          title: statTitles[0] + 'per game over the Seasons',
//           curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }