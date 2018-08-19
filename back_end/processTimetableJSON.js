var fs = require('fs');
var rp = require('request-promise')

function getData(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            data = JSON.parse(data);
            data = data["data"];
            var lectures = [];
            var tutorials = [];
            var labs = [];

            for (course in data) {
                try {
                    if (data[course]["startDate"].slice(0, 4) == "2018") {
                        if (data[course]["meetingPatterns"][0]["startTime"].slice(0, 2) != "00") {
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
                } catch (err) {

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
            resolve(outputCourse);
        });
    });
}

var setOfCourses = {}
getData("data1.json").then((course) => {
    console.log("error1")
    setOfCourses["course1"] = course
})

getData("data2.json").then((course) => {
    console.log("error2")
    setOfCourses["course2"] = course
})

getData("data3.json").then((course) => {
    console.log("error3")
    setOfCourses["course3"] = course
})

getData("data4.json").then((course) => {
    console.log("error4")
    setOfCourses["course4"] = course
})

setTimeout(() => {

    finishedTimetableCount = 1;
    for (course in setOfCourses) {
        finishedTimetableCount = (finishedTimetableCount * (setOfCourses[course]["timetables"].length));
    }
    var finishedTimetables = {}
    for (i = 0; i < finishedTimetableCount; i++) {
        finishedTimetables["finishedTimetable" + i] = {}
    }
    var timetableCount = 0;
    var count1 = 0;
    for (timetable1 in setOfCourses["course1"]["timetables"]) {
        var count2 = 0;
        for (timetable2 in setOfCourses["course2"]["timetables"]) {
            var count3 = 0
            for (timetable3 in setOfCourses["course3"]["timetables"]) {
                var count4 = 0
                for (timetable4 in setOfCourses["course4"]["timetables"]) {
                    finishedTimetables["finishedTimetable" + timetableCount] = [count1, count2, count3, count4];
                    timetableCount += 1
                    count4 += 1
                }
                count3 += 1
            }
            count2 += 1
        }
        count1 += 1
    }
    console.log(finishedTimetables)
    for (timetable in finishedTimetables) {
        var realTimetable1 = setOfCourses["course1"]["timetables"][finishedTimetables[timetable][0]]
        var realTimetable2 = setOfCourses["course2"]["timetables"][finishedTimetables[timetable][1]]
        var realTimetable3 = setOfCourses["course3"]["timetables"][finishedTimetables[timetable][2]]
        var realTimetable4 = setOfCourses["course4"]["timetables"][finishedTimetables[timetable][3]]
        if (checkIfClash(realTimetable1, realTimetable2, realTimetable3, realTimetable4) == false) {
            console.log("deleting" + timetable)
            delete finishedTimetables[timetable];
        }
    }
    console.log(finishedTimetables)

    finishedKeys = Object.keys(finishedTimetables);
    finishedKeys = finishedKeys.slice(0, 1);
    for (index in finishedKeys) {
        generateOutput(finishedTimetables[finishedKeys[index]])
    }
}, 500)

function checkIfClash(timetable1, timetable2, timetable3, timetable4) {
    for (slot1 in timetable1) {
        for (slot2 in timetable2) {
            if (timetable1[slot1]["startTime"] == timetable2[slot2]["startTime"] && timetable1[slot1]["DOW"] == timetable2[slot2]["DOW"]) {
                return false
            }
        }
        for (slot3 in timetable3) {
            if (timetable1[slot1]["startTime"] == timetable3[slot3]["startTime"] && timetable1[slot1]["DOW"] == timetable3[slot3]["DOW"]) {
                return false
            }
        }
        for (slot4 in timetable4) {
            if (timetable1[slot1]["startTime"] == timetable4[slot4]["startTime"] && timetable1[slot1]["DOW"] == timetable4[slot4]["DOW"]) {
                return false
            }
        }
    }
    for (slot2 in timetable2) {
        for (slot3 in timetable3) {
            if (timetable2[slot2]["startTime"] == timetable3[slot3]["startTime"] && timetable2[slot2]["DOW"] == timetable3[slot3]["DOW"]) {
                return false
            }
        }
        for (slot4 in timetable4) {
            if (timetable2[slot2]["startTime"] == timetable4[slot4]["startTime"] && timetable2[slot2]["DOW"] == timetable4[slot4]["DOW"]) {
                return false
            }
        }
    }
    for (slot3 in timetable3) {
        for (slot4 in timetable4) {
            if (timetable3[slot3]["startTime"] == timetable4[slot4]["startTime"] && timetable3[slot3]["DOW"] == timetable4[slot4]["DOW"]) {
                return false
            }
        }
    }
    return true;
}

function calculateBreakScore(theTimetable) {
    var data = {}
}

function generateOutput(timetableArray) {
    var realTimetable1 = setOfCourses["course1"]["timetables"][timetableArray[0]]
    var realTimetable2 = setOfCourses["course2"]["timetables"][timetableArray[1]]
    var realTimetable3 = setOfCourses["course3"]["timetables"][timetableArray[2]]
    var realTimetable4 = setOfCourses["course4"]["timetables"][timetableArray[3]]
    returnArray = [];
    console.log(realTimetable1);
    var count = 0
    for (slot1 in realTimetable1) {
        timeObject = {}
        if (realTimetable1[slot1]["DOW"] == "mon") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-13T" + realTimetable1[slot1]["startTime"]
            timeObject["end"] = "2018-08-13T" + realTimetable1[slot1]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        if (realTimetable1[slot1]["DOW"] == "tue") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-14T" + realTimetable1[slot1]["startTime"]
            timeObject["end"] = "2018-08-14T" + realTimetable1[slot1]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        if (realTimetable1[slot1]["DOW"] == "wed") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-15T" + realTimetable1[slot1]["startTime"]
            timeObject["end"] = "2018-08-15T" + realTimetable1[slot1]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        if (realTimetable1[slot1]["DOW"] == "thu") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-16T" + realTimetable1[slot1]["startTime"]
            timeObject["end"] = "2018-08-16T" + realTimetable1[slot1]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        if (realTimetable1[slot1]["DOW"] == "fri") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-17T" + realTimetable1[slot1]["startTime"]
            timeObject["end"] = "2018-08-17T" + realTimetable1[slot1]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        returnArray.push(timeObject)
    }

    for (slot2 in realTimetable2) {
        timeObject = {}
        if (realTimetable2[slot2]["DOW"] == "mon") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-13T" + realTimetable2[slot2]["startTime"]
            timeObject["end"] = "2018-08-13T" + realTimetable2[slot2]["endTime"]
            timeObject["title"] = setOfCourses["course1"]["subject"] + setOfCourses["course1"]["classNumber"];
        }
        if (realTimetable2[slot2]["DOW"] == "tue") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-14T" + realTimetable2[slot2]["startTime"]
            timeObject["end"] = "2018-08-14T" + realTimetable2[slot2]["endTime"]
            timeObject["title"] = setOfCourses["course2"]["subject"] + setOfCourses["course2"]["classNumber"];
        }
        if (realTimetable2[slot2]["DOW"] == "wed") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-15T" + realTimetable2[slot2]["startTime"]
            timeObject["end"] = "2018-08-15T" + realTimetable2[slot2]["endTime"]
            timeObject["title"] = setOfCourses["course2"]["subject"] + setOfCourses["course2"]["classNumber"];
        }
        if (realTimetable2[slot2]["DOW"] == "thu") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-16T" + realTimetable2[slot2]["startTime"]
            timeObject["end"] = "2018-08-16T" + realTimetable2[slot2]["endTime"]
            timeObject["title"] = setOfCourses["course2"]["subject"] + setOfCourses["course2"]["classNumber"];
        }
        if (realTimetable2[slot2]["DOW"] == "fri") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-17T" + realTimetable2[slot2]["startTime"]
            timeObject["end"] = "2018-08-17T" + realTimetable2[slot2]["endTime"]
            timeObject["title"] = setOfCourses["course2"]["subject"] + setOfCourses["course2"]["classNumber"];
        }
        returnArray.push(timeObject)
    }

    for (slot3 in realTimetable3) {
        timeObject = {}
        if (realTimetable3[slot3]["DOW"] == "mon") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-13T" + realTimetable3[slot3]["startTime"]
            timeObject["end"] = "2018-08-13T" + realTimetable3[slot3]["endTime"]
            timeObject["title"] = setOfCourses["course3"]["subject"] + setOfCourses["course3"]["classNumber"];
        }
        if (realTimetable3[slot3]["DOW"] == "tue") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-14T" + realTimetable3[slot3]["startTime"]
            timeObject["end"] = "2018-08-14T" + realTimetable3[slot3]["endTime"]
            timeObject["title"] = setOfCourses["course3"]["subject"] + setOfCourses["course3"]["classNumber"];
        }
        if (realTimetable3[slot3]["DOW"] == "wed") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-15T" + realTimetable3[slot3]["startTime"]
            timeObject["end"] = "2018-08-15T" + realTimetable3[slot3]["endTime"]
            timeObject["title"] = setOfCourses["course3"]["subject"] + setOfCourses["course3"]["classNumber"];
        }
        if (realTimetable3[slot3]["DOW"] == "thu") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-16T" + realTimetable3[slot3]["startTime"]
            timeObject["end"] = "2018-08-16T" + realTimetable3[slot3["endTime"]]
            timeObject["title"] = setOfCourses["course3"]["subject"] + setOfCourses["course3"]["classNumber"];
        }
        if (realTimetable3[slot3]["DOW"] == "fri") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-17T" + realTimetable3[slot3]["startTime"]
            timeObject["end"] = "2018-08-17T" + realTimetable3[slot3]["endTime"]
            timeObject["title"] = setOfCourses["course3"]["subject"] + setOfCourses["course3"]["classNumber"];
        }
        returnArray.push(timeObject)
    }

    for (slot4 in realTimetable4) {
        timeObject = {}
        if (realTimetable4[slot4]["DOW"] == "mon") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-13T" + realTimetable4[slot4]["startTime"]
            timeObject["end"] = "2018-08-13T" + realTimetable4[slot4]["endTime"]
            timeObject["title"] = setOfCourses["course4"]["subject"] + setOfCourses["course4"]["classNumber"];
        }
        if (realTimetable4[slot4]["DOW"] == "tue") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-14T" + realTimetable4[slot4]["startTime"]
            timeObject["end"] = "2018-08-14T" + realTimetable4[slot4]["endTime"]
            timeObject["title"] = setOfCourses["course4"]["subject"] + setOfCourses["course4"]["classNumber"];
        }
        if (realTimetable4[slot4]["DOW"] == "wed") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-15T" + realTimetable4[slot4]["startTime"]
            timeObject["end"] = "2018-08-15T" + realTimetable4[slot4]["endTime"]
            timeObject["title"] = setOfCourses["course4"]["subject"] + setOfCourses["course4"]["classNumber"];
        }
        if (realTimetable4[slot4]["DOW"] == "thu") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-16T" + realTimetable4[slot4]["startTime"]
            timeObject["end"] = "2018-08-16T" + realTimetable4[slot4]["endTime"]
            timeObject["title"] = setOfCourses["course4"]["subject"] + setOfCourses["course4"]["classNumber"];
        }
        if (realTimetable4[slot4]["DOW"] == "fri") {
            count += 1;
            timeObject["id"] = count;
            timeObject["category"] = "time";
            timeObject["calendarId"] = 1;
            timeObject["start"] = "2018-08-17T" + realTimetable4[slot4]["startTime"]
            timeObject["end"] = "2018-08-17T" + realTimetable4[slot4]["endTime"]
            timeObject["title"] = setOfCourses["course4"]["subject"] + setOfCourses["course4"]["classNumber"];
        }
        returnArray.push(timeObject)
    }
    console.log(returnArray)

}