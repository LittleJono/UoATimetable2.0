var calendar = new tui.Calendar(document.getElementById('calendar'), {
    defaultView: "week",
    taskView: false,
    disableDblClick: true,
    isReadOnly: true,
    useCreationPopup: false,
    useDetailPopup: false,
    themeConfig: {'week.vpanelSplitter.border': '4px solid #e5e5e5'} //testing, bugged :(
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