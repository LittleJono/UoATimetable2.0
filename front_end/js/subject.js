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

var course_list =
    {
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

calendar.setOptions({week: {startDayOfWeek: 1}}, true); //sets the start of the week to always be Monday
calendar.setOptions({month: {startDayOfWeek: 1}}, true);
calendar.changeView(calendar.getViewName(), true);


// Make a request for a user with a given ID

$("#submit").click(function () {
    var course = $('#course').val();
    //TODO generate all the course

    axios.get("http://35.160.249.111/classes?year=2018&subject=COMPSCI&catalogNbr=" + course)
        .then(function (response) {
            // handle success
            var meetingPatterns = response.data.data[0].meetingPatterns;
            var sheduleList = []
            var i = 0
            var color = getColor(course)
            meetingPatterns.forEach(function (items) {
                //hard code data to last week
                var dates = {
                    "mon": new Date(2018, 8, 13),
                    "tue": new Date(2018, 8, 14),
                    "wed": new Date(2018, 8, 15),
                    "thu": new Date(2018, 8, 16),
                    "fri": new Date(2018, 8, 17),
                };
                var week = dates[items.daysOfWeek];
                //initial calender list object

                var object = {
                    id: '',
                    calendarId: '1',
                    title: '',
                    category: 'time',
                    dueDateClass: '',
                    start: '',
                    end: '',
                    color: '#FFF',
                    bgColor: color
                }
                object.id = i
                object.location = items.location
                object.title = course
                //new Date().getMonth() from 1 to 12 but when set date it accept from 0 to 11
                object.start = new Date(week.getFullYear(), week.getMonth() - 1, week.getDate(), items.startTime.split(":")[0])
                object.end = new Date(week.getFullYear(), week.getMonth() - 1, week.getDate(), items.endTime.split(":")[0])
                object.category = 'time'
                object.isReadOnly = true
                sheduleList.push(object)
                i++
            })
            calendar.createSchedules(sheduleList)
        })
});


$("#add-course").click(function () {
    var div = document.createElement("Div");
    div.setAttribute('class', 'list-group-item');
    var courseCode = $('#course').val();
    var subjectName = $('#subject').val();
    courseList.push(subjectName+courseCode)
    div.innerHTML += (courseCode + ' ' + course_list[courseCode]);
    $("#checklist").append(div);
    let submitButton = $("#submit")
    if(courseList.length === 4){
        submitButton.text("Generate all").prop('disabled', false)
    }
    else {
        submitButton.text(`Choose another ${4-courseList.length} courses`)
    }
});

var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

var getColor = (username) => {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}