var fs = require('fs');
var rp = require('request-promise')

//pass this an array of courses 
fs.readFile('test.json', 'utf8', (err, data) => {
	var clashLog = {};
	data = JSON.parse(data);
	data = data["courseID"];
	console.log(data);
	keys = Object.keys(data);
	console.log(keys);

	for (index in keys) {
		clashLog[keys[index]] = "";
	}

	/*for every timetable
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
	}*/

	for (index in coursesArray) {
		course = coursesArray[index]
		for (timetable in course["timetables"]) {
			theTimetable = course["timetables"][timetable];
			for (slot in theTimetable) {
				for (index2 in coursesArray) {
					if (index != index2) {
						course2 = coursesArray[index2]
						for (timetable2 in course2["timetables"]) {
							theTimetable2 = course2["timetables"][timetable2];
							for (slot2 in theTimetable2) {
								if (slot["startTime"] == slot2["endTime"]) {
									console.log("clash")
								} else {
									console.log("no clash")
								}
							}
						}
					}
				}
			}
		}
	}
});

//tuicalendar
