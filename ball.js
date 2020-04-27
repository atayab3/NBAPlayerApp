let apiEndpoint = "https://www.balldontlie.io/api/v1/players";
let curSeason = 2019;	//?search=lebron_james - UNDERSCORE WORKS

var statTitles = ["Points", "Rebounds", "Assists", "Field Goal %", "3-Point Field Goal Percentage"];//, "Steals", "Blocks", "FG%", "3Pt FG%" 
var statVars = ["points", "rebounds", "assists", "fgPercent", "threePercent"];

var dataArr = [] ; // 2D Array for chart data
var yearlyPts = []; // the specific stat per year that feeds the 2D Array
var urlArray = []; // all the urls to fetchALL promise shit

var statTitle ;
var playerName; 
var playerPosition; 
var playerTeam; 


//Vars for news screen
let latestYear = 2020;
let earliestYear = 2010;

let firstName ;
let lastName  ;
      
// Define your database         
var db ;

createPlayerInfoBox = (pName)=>{
	if(document.getElementById("playerInfo").querySelector('h1') != undefined){
		let child = document.getElementById("playerInfo").childNodes[0]; 
		document.getElementById("playerInfo").removeChild(child);
	}
	let nameElement = document.createElement('h1');
	console.log("making player box" + pName);
	nameElement.textContent = pName ;
	nameElement.style.textAlign = "center";
	
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
// 				 console.log("addam");
				 console.log(json);
				var searchResultSize = json.meta["total_count"];
		 		 
				 if (searchResultSize == 1){// if that player exists
					 document.getElementById("findPlayer").disabled = true;
					 firstName = json.data[0]["first_name"]; 
					 lastName = json.data[0]["last_name"];
					 playerName = json.data[0]["first_name"] + " " + json.data[0]["last_name"];
					 createPlayerInfoBox(playerName);
					 
					 playerTeam = json.data[0]["team"]["full_name"];
					 playerPosition = json.data[0]["position"];
 					 
					 playerID = json.data[0]["id"];
					 urlArray = getUrls(playerID, curSeason);
					 
					 fetchData(urlArray).then (responses => {//PLACES I MIGHT BE ABLE TO USE INDEXED DB TO STOP FETCHING 
						
					//put info into the database
					createAnnualStatsDB(responses);
					
					dataArr = turnDBtoArray(stringStat);
						 // go to next screen
						document.body.style.backgroundColor = "#436372";
						document.querySelector("#searchScreen").style.display = "none";
						document.querySelector("#thirdScreen").style.display = "block";
						document.querySelector("#buttonsScreen").style.display = "block";
						 document.querySelector("#newsScreen").style.display = "none";
						 
 

					}  )
				 }//end if statement	 
				 else if(searchResultSize == 0){ //account for CASE that name/id does not exist	
					 // stay on search screen
					 document.querySelector("#searchScreen").style.display = "block";
						document.querySelector("#thirdScreen").style.display = "none";
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
// 			console.log("undefined found at year " + x);
			continue;
		}
		else{
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
		var tempArr = [];
		var TwoDArr = [];
	
		TwoDArr.push(['Year', stringStat]);
		var curYear ;// = respondent[x].data[0]["season"];
		var curYearString;// = curYear.toString();
		var newArr;
		db.stats.toArray()
		.then( (arr)=> {
			for(var i = 0 ; i < arr.length; ++i){
				curYear = arr[i]["year"];
				curYearString = curYear.toString();
				
				tempArr = [curYearString, arr[i][stringStat] ]; // need to put String Stat here
				TwoDArr.push(tempArr);
				
			}
				console.log(TwoDArr);
				dataArr = TwoDArr;
				google.charts.load('current', {'packages':['corechart']});
				google.charts.setOnLoadCallback(drawChart ); 
	}  )
	return TwoDArr; 
}

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
					"Jonas Valanciunas", "Jeff Teague", "Dwight Howard", "Andre Iguodala", "Brandon Ingram", "Al-Farouq Aminu", "Jaren Jackson Jr.", 
					"Marcus Smart", "Patrick Beverley", "Serge Ibaka", "Julius Randle", "Jusuf Nurkic", "Montrezl Harrell",
					"Domantas Sabonis", "Lauri Markkanen", "P.J. Tucker", "Ricky Rubio", "Harrison Barnes", "Josh Richardson",
					"Thaddeus Young", "Caris LeVert", "Jaylen Brown", "JJ Redick", "Brook Lopez", "Joe Ingles", "Robert Covington",
					 "Eric Gordon", "Trae Young", "Malcolm Brogdon", "Ray Allen", "Paul Pierce", "Rajon Rondo", 
					 "Aaron Gordon", "Gordon Hayward", "Klay Thompson", "Chris Bosh", "Otto Porter", "Clint Capela", "Derrick Favors",
					 "Buddy Hield", "Lou Williams", "Bojan Bogdanović","John Collins", "Danilo Gallinari",
					 "Tobias Harris", "Gary Harris", "Myles Turner", "Eric Bledsoe", "Nikola Vucevic", "D'Angelo Russell",
					"Paul Millsap", "Marc Gasol", "Pau Gasol", "Kevin Love", "Steven Adams", "Victor Oladipo", "Jamal Murray", 
					"Kristaps Porzingis", "Andre Drummond", "Jayson Tatum",  "Devin Booker", "De'Aaron Fox", "CJ McCollum",
					 "DeMar DeRozan", "Luka Doncic", "Donovan Mitchell","Tony Parker", "Manu Ginobili", "Kyle Lowry","Khris Middleton", "Mike Conley",
					 "Jrue Holiday", "Pascal Siakam", "Ben Simmons", "Bradley Beal", "Chris Paul", "Kemba Walker", "John Wall", "DeMarcus Cousins",
					"Blake Griffin", "Al Horford", "Draymond Green", "Yao Ming", "Carmelo Anthony", "LaMarcus Aldridge", "Kyrie Irving","Rudy Gobert","Karl-Anthony Towns","Russell Westbrook",
					 "Jimmy Butler", "Damian Lillard", "Paul George", "Nikola Jokic", "Tracy McGrady","Joel Embiid", "Kevin Garnett", "Jason Kidd", "Steve Nash",
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
	
// 	console.log("in drawChart");
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

// 		NOTES
addNews = () =>{			
			let chosenYear = document.getElementById("text-field-year").value;
			let startDate = chosenYear + "0101"
			let endDate = chosenYear + "1231";

			let apiEnd = "https://api.nytimes.com/svc/search/v2/articlesearch.json?"+
						 "q="+ playerName + "&sort=relevance"+ "&news_desk=Sports&subsection_name=Pro Basketball&begin_date=" +startDate +"&end_date=" + endDate+ 
						  "&api-key=QQfhX8AwGLRGftX9LXGeoYyszg2BM4fw";
			let articleCount = 0;
			fetch(apiEnd)
				.then(response => { return response.json() } ) 
				.then(json => {
					console.log(json);
					console.log(json["response"]["docs"] );
					for(var i =0 ; i < json["response"]["docs"].length; ++i){
						if( (json["response"]["docs"][i]["abstract"].includes(lastName) ||
						   json["response"]["docs"][i]["headline"]["main"].includes(playerName) ) || 
						   json["response"]["docs"][i]["lead_paragraph"].includes(playerName ) ){
							
							let clone = document.querySelector(".template").cloneNode(true);
							console.log("adam is a cool guy");
							console.log(clone);
// 							<img src="https://www.your-image-source.com/your-image.jpg">
// 							console.log(json["response"]["docs"][i]["multimedia"][0]["url"]);
							clone.querySelector("img").src = "https://static01.nyt.com/" + json["response"]["docs"][i]["multimedia"][0]["url"] ; 
							clone.querySelector("h2").textContent = json["response"]["docs"][i]["headline"]["main"];
							clone.querySelector("h2").style.color = "white";
							clone.querySelector("h2").style.fontFamily = "News Cycle";
// 							clone.querySelector("h2").style.fontSize = "20px";
							
							clone.querySelector("h3").textContent = json["response"]["docs"][i]["byline"]["original"]  ;
							clone.querySelector("h3").style.color = "white";
							clone.querySelector("h3").style.fontFamily = "News Cycle";
							
							clone.querySelector("h5").textContent = json["response"]["docs"][i]["pub_date"].substring(0,10);
							clone.querySelector("h5").style.color = "white";
							clone.querySelector("h5").style.fontFamily = "News Cycle";
							
// 							https://static01.nyt.com/images/2020/03/06/sports/06nba-warriorsraptors-lede/merlin_170093685_a826ab71-230f-4103-9f4d-7e4e1e20a38e-mobileMasterAt3x.jpg
							clone.querySelector("p").textContent = json["response"]["docs"][i]["abstract"];
							clone.querySelector("p").style.color = "white";
							clone.querySelector("p").style.fontFamily = "News Cycle";
							
							let webURL =  json["response"]["docs"][i]["web_url"];
							
							clone.querySelector("button").addEventListener("click", (e)=>{window.open(webURL); })
							
							clone.classList.remove("template"); // so no longer hidden like in style element for first demo card already in index
							
							clone.style.textAlign = "center";
							clone.style.marginBottom = "20px"; 
							document.getElementById("addNewsHere").appendChild(clone);
// 							linebreak = document.createElement("br");
// 							document.getElementById("addNewsHere").appendChild(linebreak);
// 							document.getElementById("addNewsHere").appendChild(linebreak);
							articleCount++ ;
							
						}
					}
					if(articleCount == 0){
						let result = document.createElement('p');
						result.textContent = "No New York Times articles related to "+ playerName + "in the year " + chosenYear;
						result.style.color = "white"; 
						document.getElementById("addNewsHere").appendChild( result );
					}
			})
}//end function 


clearNews = () =>{
// 	console.log(document.getElementById("addNewsHere").querySelectorAll(".mdc-card__primary-action").length ) ;
// 	console.log("in clearNews1"); 
// 	console.log(document.getElementById("addNewsHere").querySelectorAll("mdc-card__primary-action demo-card__primary-action").length ) ;
// 	console.log("in clearNews2"); 
// 	console.log(document.querySelectorAll(".mdc-card__primary-action demo-card__primary-action").length ) ;
// 	console.log("in clearNews3"); 
// 	console.log(document.querySelectorAll("mdc-card__primary-action demo-card__primary-action").length ) ;
// 	console.log("in clearNews4"); 
// 	console.log(document.getElementById("addNewsHere").querySelectorAll(".img").length ) ;
	console.log("in clearNews5"); 
	console.log(document.getElementById("newsScreen").querySelectorAll("mdc-card demo-card").length ) ;
// 	console.log("in clearNews6"); 
// 	console.log(document.querySelectorAll(".img").length ) ;
// 	console.log("in clearNews7"); 
// 	console.log(document.querySelectorAll("img").length ) ;
	for(var i = 0; i < document.getElementById("addNewsHere").querySelectorAll("mdc-card demo-card").length; ++i){
		console.log(i);
		let child = document.getElementById("addNewsHere").querySelector("mdc-card demo-card");
		console.log(child);
		document.getElementById("addNewsHere").removeChild(child);
	}
	
}

document.getElementById("findNews").addEventListener("click", (e)=>{
	addNews(); 
} )

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

//Initial Screen Displays -which are on and off was actually dumb -just style inside divs// document.querySelector("#infoScreen").style.display = "block";
 
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
			document.querySelector("#thirdScreen").style.display =  "none";
			document.querySelector("#searchScreen").style.display = "block";
		})

document.getElementById("searchAgain2").addEventListener("click",  (e)=> {
			
			console.log("search Again 2 button clicked");
			Dexie.delete('stats_database');
			document.getElementById("findPlayer").disabled = false;
			document.body.style.backgroundColor = "#f6f6f2";
			
			document.getElementById("text-field-hero-input").value = "";
			document.querySelector("#thirdScreen").style.display =  "none";
			document.querySelector("#searchScreen").style.display = "block";
			clearNews();
		})



//Event Handlers for Tabs 
document.getElementById("getStats").addEventListener("click",  (e)=> {
	document.querySelector("#newsScreen").style.display =  "none";
	document.querySelector("#buttonsScreen").style.display =  "block";
})

var listGenerated = false;

document.getElementById("getNews").addEventListener("click",  (e)=> {
// 	document.body.style.backgroundColor = "#ffffff";
	document.querySelector("#buttonsScreen").style.display =  "none";
	document.querySelector("#newsScreen").style.display =  "block";
	if(listGenerated == false){
// 		let years = ["2015", "2016", "2017", "2018", "2019", "2020"];
		for(var i = 2010 ; i <= 2020; ++i){
			let dataOption2 = document.createElement("option");
			dataOption2.value =  i //years[i];
			document.getElementById("years").appendChild(dataOption2);
		}
		listGenerated = true;
		
		let opener = document.createElement('p');
		opener.textContent = "Mentions of "+ playerName + " in the New York Times";
		opener.style.color = "white"; 
		opener.style.textAlign = "center";
		document.getElementById("addNewsHere").appendChild( opener );
	}
	
	
	
})			
clickedBtn();