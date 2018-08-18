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
    axios.get("http://35.160.249.111/classes?year=2018&subject=COMPSCI&catalogNbr=" + course)
        .then(function (response) {
            // handle success
            var meetingPatterns = response.data.data[0].meetingPatterns;
            var sheduleList = []
            var i = 0
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
                    end: ''
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