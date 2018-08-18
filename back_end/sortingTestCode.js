var fs = require('fs');
var rp = require('request-promise')
fs.readFile('test.json', 'utf8', (err, data) => {
	var clashLog = {}
	data = JSON.parse(data)
	data = data["courseID"]
	console.log(data)
	keys = Object.keys(data);
	console.log(keys)

	for (index in keys) {
		clashLog[keys[index]] = "";
	}
	//for every timetable
	for (index in keys) {
		//get timetable
		var timetable = data[keys[index]];
		//list of slots in the timetable
		var timeSlots = Object.keys(timetable);
		//for every other timetable
		for (index2 in keys) {
			if (index2 != index) {
				//a different timetable
				var timetable2 = data[keys[index2]];
				//that timetables time slots
				var timeSlots2 = Object.keys(timetable);
				//for every slot in the first timetable
				for (timeIndex in timeSlots) {
					//compare with every slot in other timetable
					for (timeIndex2 in timeSlots2) {
						//if time slot a clashes with time slot b
						slota = timetable[timeSlots[timeIndex]];
						slotb = timetable2[timeSlots2[timeIndex2]];
						console.log(slota["startTime"], slotb["startTime"] );
						if (slota["startTime"] == slotb["startTime"]) {
							if (slota["DOW"] == slotb["DOW"]) {
								console.log("clash");
								clashLog[keys[index]] += " clashes with " + keys[index2];
							}
						} else {
							console.log("no clash");
						}
					}
				}
			}
		}
		console.log(clashLog)
	}
});

/* rp("http://35.160.249.111/classes?classNbr=" + classNumber + "&size=500&catalogNbr=" + catalogNbr + "&subject=COMPSCI").then(function(data) {
	var obj = JSON.parse(data);
	var whatever = {};
	obj = obj["data"]
	console.log("-----------------")
	console.log(obj)
	obj = obj[0]["meetingPatterns"];
	console.log("-----------------")
	console.log(obj)
	var i = 0;
	obj.forEach(element => {
		for (i = 0; i < obj.length; i++) {
			if ((whatever["slot" + i].startTime == element.startTime) || (whatever["slot" + i].endTime == element.endTime)) {
				return;
			}
		}
		whatever["slot" + i] = element;
		i++;
	});
	console.log("-----------------")
	console.log(this);
}) 

new TimeTable("46472", "101")
*/
	
//tuicalendar
