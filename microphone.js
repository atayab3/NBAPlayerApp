var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

let players = ["Andrew Wiggins", "Terrence Ross", "DeAndre Jordan", "Jarrett Allen", "Kyle Kuzma", "Joe Harris",
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
					"Stephen Curry", "Kevin Durant", "LeBron James", "Kawhi Leonard", "Giannis Antetokounmpo"];

// // var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ... ];
 var grammar = '#JSGF V1.0; grammar players; public <player> = ' + players.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);
// // 
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
players.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

document.getElementById("microphone").onclick = function() {
  let p1 = document.createElement("p");
  p1.textContent = "Listening for player name, say something";
  document.getElementById("addValuesHere").appendChild(p1);
  recognition.start();
  console.log('Ready to receive a player name command.');
}

recognition.onresult = function(event) {
  var player2 = event.results[0][0].transcript;
  console.log(player2);
	if(players.includes(player2) ){
		console.log("inside of here");
		document.getElementById("text-field-hero-input").value = player2;
		 document.getElementById("findPlayer").click();
		
	}
	else{
		let p1 = document.createElement("p");
		p1.textContent = "Invalid, not a player name, try again";
		  document.getElementById("addValuesHere").appendChild(p1);
	}
//   diagnostic.textContent = 'Result received: ' + player2 + '.';
//   bg.style.backgroundColor = c;
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onspeechend = function() {
  recognition.stop();
}


// var diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');
// var hints = document.querySelector('.hints');

// var colorHTML= '';
// colors.forEach(function(v, i, a){
//   console.log(v, i);
//   colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
// });
// hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }
