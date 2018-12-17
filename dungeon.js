var Twit = require('./node_modules/twit');
 
var T = new Twit({
  consumer_key:         'N13WiJKUKOIDXVnefYTOT78lW',
  consumer_secret:      '8ax5WbnibSFF6QsOLL571fEWmduzWmWd5JZuuAj9ClOix9C8Ar',
  access_token:         '959841386198654981-TenxbBXZZjLlEItXHWm7EIeJ4hIkJbY',
  access_token_secret:  'mokHrsC6VOFDB7H17fOqCSywvVWAjTpHhCl79fHhNaOn8',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

var overallDescriptions = [
	"Arched Brick Tunnels"
	,"Natural Caves"
	,"Rough Block Tunnels"
	,"Finely Crafted Stonework Tunnels"
	,"High Vaulted Chambers"
	,"Low Ceilinged Tunnels"
	,"Damp Earthy Tunnels"
	,"Geometrically Perfect Tunnels"
	,"Crumbling Ancient Tunnels"
]

var roomList = [
	"Barracks"
	,"Guard Room"
	,"Lavatory"
	,"Well"
	,"Animal Pens"
	,"Altar"
	,"Lab"
	,"Kitchens"
	,"Stalagmites"
	,"Natural Spring"
	,"Treasure Room"
	,"Animal Den"
	,"Ceremonial Chamber"
	,"Mess Hall"
	,"Prison Cells"
	,"Crystal Caverns"
	,"Armoury"
	,'Mushroom Farm'
	,"Cave-In"
];

var goodRooms = [
	"Scriptorium"
	,"Temple"
	,"Knitting Room"
	,"Fitting Room"
	,"Sitting Room"
	,"Infirmary"
];
var badRooms = [
	"Blood Pools"
	,"Sacrificial Pit"
	,"Torture Chamber"
	,"Zombie Pens"
	,"War Room"
	,"Pit Trap"
	,"Entrance to Underdark"
	,"Rune of Exploding"
	,"Spike Trap"
	,"Falling Boulder Trap"
];

var inhabitants = [
	{name:"Humans",rooms:["Tapestrorium"]},
	{name:"Dwarves",rooms:["Mining Supply Room","Larder"]},
	{name:"Elves",rooms:["Sun Chamber","Brewery","Library","Poetorium"]},
	{name:"Barbarians",rooms:["Shouting Chamber","Wrestling Mats"]},
	{name:"Wizards",rooms:["Library", "Arcanum"]},
	{name:"Knights",rooms:["Training Room"]}

];

var goodInhabitants =[
	{name:"Hobbits",rooms:["Brewery","Root Cellar","Larder","Washing Room"]},
	{name:"Gnomes",rooms:["Tinkery"]},
	{name:"Bards",rooms:["Music Hall","Bandstand"]},
	{name:"Clerics",rooms:["Prayer Alcove"]}
];

var badInhabitants = [
	{name:"Drow",rooms:["Spider Hatchery"]},
	{name:"Goblins",rooms:["Spawning Pit"]},
	{name:"Orcs",rooms:["Slave Pens","Gruumsh Altar"]},
	{name:"Duergar",rooms:["Slave Pens"]},
	{name:"Vampires",rooms:["Mausoleum","Crypt"]},
	{name:"Necromancers",rooms:["Cold Storage","Skeleton Hole"]},
	{name:"Mind Flayers",rooms:["Brain Pit","Scrying Pool"]},
	{name:"SnakeFolk",rooms:["Egg Hatchery"]},
	{name:"FrogFolk",rooms:["Slimatorim","Spawning Pits"]},
	{name:"Kobolds",rooms:["Fire Pit Trap","Rolling Log Trap","Blowdart Trap"]}
];

// var imgWall = "██";
var imgWall = "⬛";

// var imgBlank = "  ";
var imgBlank = "⬜";

// var imgDoor = "[]";
var imgDoor = "🚪";

// var imgSecret = "$$";
var imgSecret = "◾";

var imgUp = "⏫";

var imgDown = "⏬";

function displayDungeon(dungeon){	
	// creates strings that use emojis to depict the dungeon layout 
	for (var i = 0; i < dungeon.length; i++){
		var asciiDung = "";
		for (var j = 0; j < dungeon[i].length; j++){
			var thisCellFill = "";
			if (dungeon[i][j] == 1){
				thisCellFill = imgBlank;
			} else if (dungeon[i][j] == 0){
				thisCellFill = imgWall;
			} else if (dungeon[i][j] == "D"){
				thisCellFill = aRand([imgDoor,imgSecret,imgUp,imgDown]);
			} else {
				// thisCellFill = "" + (dungeon[i][j]-1) + (dungeon[i][j]-1);
				thisCellFill = "" + (dungeon[i][j]-1) +"⃣";
			}
			asciiDung += (thisCellFill);
		}
		console.log(asciiDung);
	}
}

function twtDungeon(dungeon, num){	
	// creates strings that use emojis to depict the dungeon layout 
	var id_str;
	var asciiDung = "";	
	for (var i = 0; i < dungeon.length; i++){
		for (var j = 0; j < dungeon[i].length; j++){
			var thisCellFill = "";
			if (dungeon[i][j] == 1){
				thisCellFill = imgBlank;
			} else if (dungeon[i][j] == 0){
				thisCellFill = imgWall;
			} else if (dungeon[i][j] == "D"){
				thisCellFill = aRand([imgDoor,imgSecret,imgUp,imgDown]);
			} else {
				// thisCellFill = "" + (dungeon[i][j]-1) + (dungeon[i][j]-1);
				thisCellFill = "" + (dungeon[i][j]-1) +"⃣";
			}
			asciiDung += (thisCellFill);
		}
		asciiDung += "\n";
	}
	T.post('statuses/update', { status: asciiDung }, function(err, data, response) {
	  console.log(data);
	  id = data.id_str;
	  twtNameList(id,num);
	  // twtNameList(asciiDung,num);
	})
}

function aRand(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function randInt(mn,mx){
	let range = mx-mn;
	let retVal = Math.floor(Math.random()*range) + mn;
	return retVal;
}

function connectRooms(dungeon, roomList){
	roomList = shuffle(roomList);
	var roomNum = 2;

	//expands the size of a given room (up to one unit in each direction)
	function expandRoom(rm){
		let xMin = randInt(-1,0);
		let xMax = randInt(1,2);
		let yMin = randInt(-1,0);
		let yMax = randInt(1,2);
		for (let n = xMin; n < xMax; n++){
			for (let p = yMin; p<yMax;p++){
				dungeon[rm.x+n][rm.y+p] = roomNum;
			}
		}
		roomNum++;
	}
	
	// Attaches each room to the next in the list by way of a hallway
	for (var i = 0; i < roomList.length-1; i++){
		var thisRoom = roomList[i];
		var partnerRoom = roomList[i+1];
		var x1 = thisRoom.x;
		var x2 = partnerRoom.x;
		var y1 = thisRoom.y;
		var y2 = partnerRoom.y;
		// in order for the for loop to work the x vals need to be sorted sm to lg
		if (x1 > x2){
			let tmpX = x1;
			x1 = x2;
			x2 = tmpX;
		}
		var cellFill = 1;
		for (var m = x1; m <= x2; m++){
			dungeon[m][y2] = cellFill;
		}
		// in order for the for loop to work the x vals need to be sorted sm to lg
		// AND the x vals need to be reset
		if (y1 > y2){
			let tmpY = y1;
			y1 = y2;
			y2 = tmpY;
		}
		x2 = partnerRoom.x;
		x1 = thisRoom.x;
		for (var m = y1; m <= y2; m++){
			dungeon[x1][m] = cellFill;
		}
	}

	let maxExpand = Math.min(9,roomList.length);
	for (let j = 0; j < maxExpand; j++){
		expandRoom(roomList[j]);
	}

	for (var n = 0; n < dungeon.length; n++){
		dungeon[0][n] = 0;
		dungeon[dungeon.length-1][n] = 0;
		dungeon[n][0] = 0;
		dungeon[n][dungeon.length-1] = 0;
	}
	var rnd = Math.random();
	if (rnd < 0.5){
		var low,high;
		if (rnd < .25){
			low = 0;
			high = roomList[roomList.length-1].x;
		} else {
			low = roomList[roomList.length-1].x;
			high = dungeon.length;
		}
		for (let i = low; i < high; i++){
			dungeon[i][roomList[roomList.length-1].y] = 1;
		}
	} else {
		var low,high;
		if (rnd < 0.75){
			low = 0;
			high = roomList[roomList.length-1].y;
		} else {
			low = roomList[roomList.length-1].y;
			high = dungeon.length;
		}
		for (let i = low; i < high; i++){
			dungeon[roomList[roomList.length-1].x][i] = 1;
		}
	}
	return dungeon;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function createNameList(num){

	var whichOverall = overallDescriptions[Math.floor(Math.random()*overallDescriptions.length)];
	console.log("General Aesthetic: " + whichOverall);

	let rnd = Math.random();
	if (rnd < .4){
		roomList = roomList.concat(goodRooms);
	} else if (rnd >= 0.4 && rnd < 0.8){
		roomList = roomList.concat(badRooms);
	} else {
		roomList = roomList.concat(goodRooms);
		roomList = roomList.concat(badRooms);
	}

	roomList = shuffle(roomList);
	for (let i = 0; i < Math.min(num,9); i ++){
		console.log((i+1) + ": " + roomList[i]);
	}
}

function twtNameList(id, num){
// function twtNameList(status,num){
	var status = "";
	var whichOverall = overallDescriptions[Math.floor(Math.random()*overallDescriptions.length)];
	status += "General Aesthetic: " + whichOverall + "\n";

	let rnd = Math.random();
	let thisRoomList;
	let thisInhabitants;
	if (rnd < 0.475){
		thisRoomList = roomList.concat(goodRooms);
		thisInhabitants = inhabitants.concat(goodInhabitants);
		console.log("Good");
	} else if (rnd >= 0.475 && rnd < 0.95){
		thisRoomList = roomList.concat(badRooms);
		thisInhabitants = inhabitants.concat(badInhabitants);
		console.log("Evil");
	} else {
		thisRoomList = roomList.concat(goodRooms);
		thisRoomList = thisRoomList.concat(badRooms);
		thisInhabitants = inhabitants.concat(goodInhabitants);
		thisInhabitants = thisInhabitants.concat(goodInhabitants);
		console.log("Mix");
	}

	thisInhabitants = shuffle(thisInhabitants);
	thisRoomList = thisRoomList.concat(thisInhabitants[0].rooms);

	status += "Inhabitants: " + thisInhabitants[0].name + "\n";

	thisRoomList = shuffle(thisRoomList);
	for (let i = 0; i < Math.min(num,9); i ++){
		status += ((i+1) + ": " + thisRoomList[i]) + "\n";
	}
	console.log(status);
	T.post('statuses/update', { in_reply_to_status_id: id, status: status }, function(err, data, response) {
	// T.post('statuses/update', { status: status }, function(err, data, response) {
		if (err){console.log(err)}
		console.log(response);
	})
}

function addDoors(dun){
	var doors = Math.floor(Math.random()*4)+1;
	var its = 1000;
	while (doors > 0 && its > 0){
		its--;
		var x = Math.floor(Math.random()*(dun.length-3))+1;
		var y = Math.floor(Math.random()*(dun.length-3))+1;
		if ((dun[x-1][y] === 0 
			&& dun[x+1][y] === 0
			&& dun[x][y-1] === 1
			&& dun[x][y+1] === 1)
			||
			(dun[x-1][y] === 1 
			&& dun[x+1][y] === 1
			&& dun[x][y-1] === 0
			&& dun[x][y+1] === 0)
		){
			dun[x][y] = "D";
			doors--;
		}
	}
	return dun;
}

function doorFill(dun){
	var x = 0; 
	var y = 0;
	while (dun[x][y] == 0){
		x = randInt(0,dun.length-1);
		y = randInt(0,dun.length-1);
	}
	dun = floodFill(dun,x,y,"D");
	return dun;
}

function floodFill(dun,x,y,replacement){
	if (dun[x][y] != 0 && dun[x][y] != replacement){
		dun[x][y] = replacement;
		if (x>0){
			dun = floodFill(dun,x-1,y,replacement);
		}
		if (x<dun.length-1){
			dun = floodFill(dun,x+1,y,replacement);
		}
		if (y>0){
			dun = floodFill(dun,x,y-1,replacement);
		}
		if (y<dun.length-1){
			dun = floodFill(dun,x,y+1,replacement);
		}
	}
	return dun;
}

function trimDungeon(dun){
	// trim top
	var finished = false
	while (!finished){
		for (var i = 0; i < dun[1].length; i++){
			if (dun[1][i] != 0){
				finished = true;
			}
		}
		if (!finished){
			dun.splice(0,1);
		}
	}
	// trim bottom
	finished = false
	while (!finished){
		for (var i = 0; i < dun[dun.length-2].length; i++){
			if (dun[dun.length-2][i] != 0){
				finished = true;
			}
		}
		if (!finished){
			dun.splice(dun.length-1,1);
		}
	}
	// trim left
	finished = false
	while (!finished){
		for (var i = 0; i < dun.length-1; i++){
			if (dun[i][1] != 0){
				finished = true;
			}
		}
		if (!finished){
			for (var i = 0; i< dun.length; i++){
				dun[i].splice(0,1);
			}
		}
	}
	// trim right
	finished = false
	while (!finished){
		for (var i = 0; i < dun.length-1; i++){
			if (dun[i][dun[i].length-2] != 0){
				finished = true;
			}
		}
		if (!finished){
			for (var i = 0; i< dun.length; i++){
				dun[i].splice(dun[i].length-1,1);
			}
		}
	}
	return dun;
}

function main(){

	var dungeonsize = Math.floor(Math.random()*5)+8;
	var dungeon = [];
	var roomList = [];
	for (var i = 0; i < dungeonsize; i++){
		var dungeonLayer = [];
		for (var j = 0; j < dungeonsize; j++){
			var thisCell = 0;
			dungeonLayer.push(thisCell);
		}
		dungeon.push(dungeonLayer);
	}
	while (roomList.length < 3){
		for (var i = 1; i < dungeonsize-1; i++){
			var dungeonLayer = [];
			for (var j = 1; j < dungeonsize-1; j++){
				if (Math.random(1)>0.96){
					dungeon[i][j] = 1;
					roomList.push({x:i,y:j});
				}
			}
		}
	}
	
	dungeon = connectRooms(dungeon, roomList);
	dungeon = addDoors(dungeon);
	dungeon = trimDungeon(dungeon);

	displayDungeon(dungeon);
	twtDungeon(dungeon,roomList.length);
	// createNameList(roomList.length);

}

var second = 1000;
var minute = second*60;
var hour = minute * 60;
var day = hour * 24;

// main();
setInterval(main,hour * 6); // creates a new one every minute
