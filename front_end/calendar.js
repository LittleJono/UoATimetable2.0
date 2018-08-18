

var calendar = new tui.Calendar('#calendar', {
    defaultView: 'month',
    taskView: true,
    template: {
        monthGridHeader: function(model) {
            var date = new Date(model.date);
            var template = '<span class="tui-full-calendar-weekday-grid-date">' + date.getDate() + '</span>';
            return template;
        }
    }
});