var fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
    data = data["data"];
    var lectures = [];
    var tutorials = [];
    var labs = [];

    for (course in data) {
        if (data[course]["startDate"].slice(0,4) == "2018") {
            if (data[course]["meetingPatterns"][0]["startTime"].slice(0,2) != "00") { 
                var newDataObject = {};
                newDataObject["subject"] = data[course]["subject"];
                newDataObject["classNumber"] = data[course]["catalogNbr"];
                newDataObject["classID"] = data[course]["classNbr"];
                newDataObject["classType"] = data[course]["component"];
                newDataObject["ssoName"] = data[course]["classSection"];
                newDataObject["classes"] = data[course]["meetingPatterns"];
                if (newDataObject["classType"] == "LEC") {
                    lectures.push(newDataObject);
                } else if (newDataObject["classType"] == "TUT") {
                    tutorials.push(newDataObject);
                } else if (newDataObject["classType"] == "LAB") {
                    labs.push(newDataObject);
                } else {
                    console.log("ERROR")
                }
            }
        }
    }

    
    //generate x possible timetables from lectures.
    var setOfTimeTables = []
    for (course in lectures) {
        for (course2 in labs) {
            var newTimetable = {}
            var daysUsed = []
            for (slot in lectures[course]["classes"]) {
                if (daysUsed.indexOf(lectures[course]["classes"][slot]["daysOfWeek"]) == -1) {
                    daysUsed.push(lectures[course]["classes"][slot]["daysOfWeek"])
                    newTimetable["slot" + slot] = {};
                    newTimetable["slot" + slot]["startTime"] = lectures[course]["classes"][slot]["startTime"]
                    newTimetable["slot" + slot]["endTime"] = lectures[course]["classes"][slot]["endTime"]
                    newTimetable["slot" + slot]["DOW"] = lectures[course]["classes"][slot]["daysOfWeek"]
                    newTimetable["slot" + slot]["location"] = lectures[course]["classes"][slot]["location"]
                }
            }
            newTimetable["extra"] = {}
            newTimetable["extra"]["startTime"] = labs[course2]["classes"][0]["startTime"]
            newTimetable["extra"]["endTime"] = labs[course2]["classes"][0]["endTime"]
            newTimetable["extra"]["DOW"] = labs[course2]["classes"][0]["daysOfWeek"]
            newTimetable["extra"]["location"] = labs[course2]["classes"][0]["location"]
            setOfTimeTables.push(newTimetable);
        }
        for (course3 in tutorials) {
            var newTimetable = {}
            var daysUsed = []
            for (slot in lectures[course]["classes"]) {
                if (daysUsed.indexOf(lectures[course]["classes"][slot]["daysOfWeek"]) == -1) {
                    daysUsed.push(lectures[course]["classes"][slot]["daysOfWeek"])
                    newTimetable["slot" + slot] = {};
                    newTimetable["slot" + slot]["startTime"] = lectures[course]["classes"][slot]["startTime"]
                    newTimetable["slot" + slot]["endTime"] = lectures[course]["classes"][slot]["endTime"]
                    newTimetable["slot" + slot]["DOW"] = lectures[course]["classes"][slot]["daysOfWeek"]
                    newTimetable["slot" + slot]["location"] = lectures[course]["classes"][slot]["location"]
                }
            }
            newTimetable["extra"] = {}
            newTimetable["extra"]["startTime"] = tutorials[course3]["classes"][0]["startTime"]
            newTimetable["extra"]["endTime"] = tutorials[course3]["classes"][0]["endTime"]
            newTimetable["extra"]["DOW"] = tutorials[course3]["classes"][0]["daysOfWeek"]
            newTimetable["extra"]["location"] = tutorials[course3]["classes"][0]["location"]
            setOfTimeTables.push(newTimetable);
        }
    }
    var outputCourse = {}
    outputCourse["timetables"] = setOfTimeTables
    outputCourse["classNumber"] = lectures[0]["classNumber"]
    outputCourse["classID"] = lectures[0]["classID"]
    outputCourse["subject"] = lectures[0]["subject"]
    console.log(outputCourse)
});