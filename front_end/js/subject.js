window.onload = function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var subjectJSON = JSON.parse(this.responseText);
            for (i in subjectJSON){
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

var course_list = [
    {"key": "111", "value": "An Introduction to Practical Computing"},
    {"key": "101", "value": "Principles of Programming"},
    {"key": "105", "value": "Principles of Computer Science"},
    {"key": "107", "value": "Computer Science Fundamentals"},
    {"key": "210", "value": "Computer Systems 1"},
    {"key": "215", "value": "Computer Systems 2"},
    {"key": "220", "value": "Algorithms and Data Structures"},
    {"key": "225", "value": "Discrete Structures in Mathematics and Computer Science"},
    {"key": "230", "value": "Programming Techniques"},
    {"key": "280", "value": "Introduction to Software Development"},
    {"key": "313", "value": "Computer Organisation"},
    {"key": "314", "value": "Modern Data Communications"},
    {"key": "320", "value": "Applied Algorithmics"},
    {"key": "335", "value": "Distributed Objects, Services and Programming"},
    {"key": "340", "value": "Operating Systems"},
    {"key": "345", "value": "Human Computer Interaction"},
    {"key": "350", "value": "Mathematical Foundations of Computer Science"},
    {"key": "351", "value": "Fundamentals of Database Systems"},
    {"key": "361", "value": "Machine Learning"},
    {"key": "367", "value": "Artificial Intelligence"},
    {"key": "369", "value": "Computational Science"},
    {"key": "373", "value": "Computer Graphics and Image Processing"},
    {"key": "380", "value": "Undergraduate Project in Computer Science"}];

$("#subject").change(function () {
    $.each(course_list, function (i, item) {
        $('#course').append($('<option>', {
            value: item.key,
            text: item.key + " " + item.value
        }));
    });
});

function reqListener () {
    console.log(this.responseText);
}

/* function getSubjects(file, callback) { //requesting

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var subjectJSON = JSON.parse(this.responseText);
            for (i in subjectJSON){
                $('#subject').append($('<option>', {
                    value: JSON.stringify(i),
                    text: JSON.stringify(i)
                }));
            }

        }
    };
    xhttp.open("GET", "https://api.auckland.ac.nz/service/courses/v2/subjects?effectiveYear=2018", true);
    xhttp.send(null);
} */


/* $("#subject").change(function () {
    $.each(course_list, function (i, item) {
        $('#course').append($('<option>', {
            value: item.key,
            text: item.key + " " + item.value
        }));
    });
});
 */

// const axios = require('axios');

// Make a request for a user with a given ID

$("#submit").click(function () {
    var course = $('#course').val();
    axios.get("http://35.160.249.111/classes?year=2018&subject=COMPSCI&catalogNbr=" + course)
        .then(function (response) {
            // handle success
            var meetingPatterns = response.data.data[0].meetingPatterns;
            var sheduleList = []
            var i = 0
            meetingPatterns.forEach(function (items) {
                var dates = {
                    "mon": new Date(2018, 8, 20),
                    "tue": new Date(2018, 8, 21),
                    "wed": new Date(2018, 8, 22),
                    "the": new Date(2018, 8, 23),
                    "fri": new Date(2018, 8, 24),
                };
                var week = dates[items.daysOfWeek];
                // console.log(items.daysOfWeek)
                var object = {
                    id: '',
                    calendarId: '',
                    title: '',
                    category: 'time',
                    dueDateClass: '',
                    start: '',
                    end: ''
                }
                object.id = i
                // object.location = items.location
                object.title = course
                object.start = new Date(week.getFullYear(), week.getMonth()-1, week.getDate(), items.startTime.split(":")[0])
                object.end = new Date(week.getFullYear(), week.getMonth()-1, week.getDate(), items.endTime.split(":")[0])
                object.calendarId = i
                object.category = 'time'
                object.isReadOnly = true
                sheduleList.push(object)
                i++
            })
            newCalendar(sheduleList)
        })
});


function newCalendar(sheduleList) {
    var calendar = new tui.Calendar('#calendar', {
        // defaultView: 'month',
        taskView: true,
        template: {
            monthGridHeader: function (model) {
                var date = new Date(model.date);
                var template = '<span class="tui-full-calendar-weekday-grid-date">' + date.getDate() + '</span>';
                return template;
            }
        }
    });
    calendar.setOptions({month: {visibleWeeksCount: 2}}, true);
    calendar.changeView('month', true);
    console.log(sheduleList)
    calendar.createSchedules(sheduleList)

}