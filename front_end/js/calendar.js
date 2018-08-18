

var calendar = new tui.Calendar('#calendar', {
    defaultView: 'week',
    taskView: true,
    template: {
        monthGridHeader: function(model) {
            var date = new Date(model.date);
            var template = '<span class="tui-full-calendar-weekday-grid-date">' + date.getDate() + '</span>';
            return template;
        }
    }
});

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);

calendar.createSchedules([
    {
        id: '1',
        calendarId: '1',
        title: 'my schedule',
        category: 'time',
        dueDateClass: '',
        start: new Date(),
        end: tomorrow
    },
    {
        id: '2',
        calendarId: '1',
        title: 'second schedule',
        category: 'time',
        dueDateClass: '',
        start: new Date(),
        end: tomorrow,
        isReadOnly: true    // schedule is read-only
    }
]);