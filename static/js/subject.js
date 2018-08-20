function getJSON(url) {
    return new Promise((resolve, reject) => {
        const uri = url;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", uri, true);
        xhr.onload = () => {
            const resp = JSON.parse(xhr.responseText);
            resolve(resp);
        }
        xhr.send(null);
    })
}


function getData(fileName) 
    return new Promise((resolve, reject) => {
        fileName2 = fileName
        var courseAlpha = fileName.replace(/[0-9]/g, '');
        var courseNumeric = fileName2.replace(/[a-z]/g, '');
        var string = "http://35.160.249.111/classes?catalogNbr=" + courseNumeric + "&subject=" + courseAlpha + "&year=2018&term=1185";
        console.log(string)
        getJSON(string).then((data) => {
            //data = JSON.parse(data);


            console.log(data)
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

function getCourseData(listOfCourses) {
    return new Promise((resolve, reject) => {
        var setOfCourses = {};
        getData(listOfCourses[0]).then((course) => {
            setOfCourses["course1"] = course
            getData(listOfCourses[1]).then((course) => {
                setOfCourses["course2"] = course
                getData(listOfCourses[2]).then((course) => {
                    setOfCourses["course3"] = course
                    getData(listOfCourses[3]).then((course) => {
                        setOfCourses["course4"] = course
                    }).then(() => {
                        resolve(generateTimetables(setOfCourses));
                    })
                });
            })
        })
    });
};

function generateTimetables(setOfCourses) {
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
        return generateOutput(finishedTimetables[finishedKeys[index]], setOfCourses)
    }
}

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

function generateOutput(timetableArray, setOfCourses) {
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
    return (returnArray)

}






window.onload = function () {
    $("#submit").prop('disabled', true)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var subjectJSON = JSON.parse(this.responseText);
            for (i in subjectJSON) {
                $('#subject').append($('<option>', {
                    value: i,
                    text: i
                }));
            }

        }
    };
    xhttp.open("GET", "https://api.auckland.ac.nz/service/courses/v2/subjects?effectiveYear=2018", true);
    xhttp.send(null);
}
//TODO
var courseList = []

var course_list = {
    "111": "An Introduction to Practical Computing",
    "101": "Principles of Programming",
    "105": "Principles of Computer Science",
    "107": "Computer Science Fundamentals",
    "210": "Computer Systems 1",
    "215": "Computer Systems 2",
    "220": "Algorithms and Data Structures",
    "225": "Discrete Structures in Mathematics and Computer Science",
    "230": "Programming Techniques",
    "280": "Introduction to Software Development",
    "313": "Computer Organisation",
    "314": "Modern Data Communications",
    "320": "Applied Algorithmics",
    "335": "Distributed Objects, Services and Programming",
    "340": "Operating Systems",
    "345": "Human Computer Interaction",
    "350": "Mathematical Foundations of Computer Science",
    "351": "Fundamentals of Database Systems",
    "361": "Machine Learning",
    "367": "Artificial Intelligence",
    "369": "Computational Science",
    "373": "Computer Graphics and Image Processing",
    "380": "Undergraduate Project in Computer Science"
};


//load course list
$("#subject").change(function () {
    //loop object
    for (var key in course_list) {
        $('#course').append($('<option>', {
            value: key,
            text: key + " " + course_list[key]
        }));
    }
});

//initial calender
var calendar = new tui.Calendar(document.getElementById('calendar'), {
    defaultView: "week",
    taskView: false,
    disableDblClick: true,
    isReadOnly: true,
    useCreationPopup: false,
    useDetailPopup: false,
    template: {
        timegridDisplayPrimayTime: function (time) {
            var meridiem = time.hour < 12 ? 'am' : 'pm';
            if (time.hour <= 12) {
                return time.hour + ':00 ' + meridiem;
            } else {
                twelve_hour = time.hour - 12;
                return twelve_hour + ':00 ' + meridiem;
            }
        },
        timegridDisplayTime: function (time) {
            return time.hour + ':' + time.minutes;
        }
    }
});

calendar.setOptions({
    week: {
        startDayOfWeek: 1
    }
}, true); //sets the start of the week to always be Monday
calendar.setOptions({
    month: {
        startDayOfWeek: 1
    }
}, true);
calendar.changeView(calendar.getViewName(), true);


// Make a request for a user with a given ID

function readTextFile(file, callback) { //requesting file setup
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

$("#submit").click(function () {
    // var course = $('#course').val();
    //TODO generate all the course

    console.log(courseList)
    getCourseData(courseList).then((result) => {
        var data = {};
        for (index in result) {
            data["test" + index] = result[index];
        }
        var scheduleList = [];
        for (element in data) {
            item = data[element];
            var color = getColor(item.title)
            item.color = "#FFF"
            item.bgColor = color
            item.borderColor = color
            scheduleList.push(item)
        }
        console.log(scheduleList);
        calendar.clear();
        calendar.createSchedules(scheduleList);
        calendar.render();
    });
    
})


// axios.get("http://35.160.249.111/classes?year=2018&subject=COMPSCI&catalogNbr=" + course)
//     .then(function (response) {
//         // handle success
//         var meetingPatterns = response.data.data[0].meetingPatterns;
//         var sheduleList = []
//         var i = 0
//         var color = getColor(course)
//         meetingPatterns.forEach(function (items) {
//             //hard code data to last week
//             var dates = {
//                 "mon": new Date(2018, 8, 13),
//                 "tue": new Date(2018, 8, 14),
//                 "wed": new Date(2018, 8, 15),
//                 "thu": new Date(2018, 8, 16),
//                 "fri": new Date(2018, 8, 17),
//             };
//             var week = dates[items.daysOfWeek];
//             //initial calender list object
//
//             var object = {
//                 id: '',
//                 calendarId: '1',
//                 title: '',
//                 category: 'time',
//                 dueDateClass: '',
//                 start: '',
//                 end: '',
//                 color: '#FFF',
//                 bgColor: color
//             }
//             object.id = i
//             object.location = items.location
//             object.title = course
//             //new Date().getMonth() from 1 to 12 but when set date it accept from 0 to 11
//             object.start = new Date(week.getFullYear(), week.getMonth() - 1, week.getDate(), items.startTime.split(":")[0])
//             object.end = new Date(week.getFullYear(), week.getMonth() - 1, week.getDate(), items.endTime.split(":")[0])
//             object.category = 'time'
//             object.isReadOnly = true
//             sheduleList.push(object)
//             i++
//         })
//         calendar.createSchedules(sheduleList)
//     })


$("#add-course").click(function () {
    var courseCode = $('#course').val();
    var subjectName = $('#subject').val();
    if (courseList.length === 4) {
        alert("You cannot add courses any more")
    } else {
        var div = document.createElement("Div");
        div.setAttribute('class', 'list-group-item');

        courseList.push(subjectName + courseCode)
        div.innerHTML += (courseCode + ' ' + course_list[courseCode]);
        $("#checklist").append(div);
        let submitButton = $("#submit")
        if (courseList.length === 4) {
            submitButton.text("Generate all").prop('disabled', false)
            $('#add-course').prop('disabled', true)
        } else {
            submitButton.text(`Choose another ${4 - courseList.length} courses`)
        }
    }

});

var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

var getColor = (string) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}