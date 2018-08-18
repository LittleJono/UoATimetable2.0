var calendar = new tui.Calendar(document.getElementById('calendar'), {
    defaultView: "week",
    taskView: false,
    disableDblClick: true,
    isReadOnly: true,
    useCreationPopup: false,
    useDetailPopup: false,
    template: {
        timegridDisplayPrimayTime: function(time) {
            var meridiem = time.hour < 12 ? 'am' : 'pm';
            if (time.hour <= 12) {
                return time.hour + ':00 ' + meridiem;
            } else {
                twelve_hour = time.hour - 12;
                return twelve_hour + ':00 ' + meridiem;
            }
        },
        timegridDisplayTime: function(time) {
            return time.hour + ':' + time.minutes;
        }
    }
});

calendar.setCalendarColor("1", { //timetable item colors
    color: "#ffffff",
    bgColor: "#66aeff",
    borderColor: "#000000"
});

calendar.setOptions({week: {startDayOfWeek: 1}}, true); //sets the start of the week to always be Monday
calendar.setOptions({month: {startDayOfWeek: 1}}, true);
calendar.changeView(calendar.getViewName(), true);

function readTextFile(file, callback) { //requesting file setup
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("http://localhost:8000/js/class_test.json", function(text){ //reading testfile hosted on the server into the calendar
    var data = JSON.parse(text);
    calendar.createSchedules(data);
});

calendar.on('clickDayname', function(event) { //clicking on calendar date allows you to zoom into daliy view and vice versa
    if (calendar.getViewName() === 'week') {
        calendar.setDate(new Date(event.date));
        calendar.changeView('day', true);
    } else {
        calendar.setDate(new Date(event.date));
        calendar.changeView('week', true);
    }
});