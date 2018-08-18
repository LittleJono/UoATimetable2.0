var items = {
    "data": [
        {
            "acadCareer": "UC01",
            "acadGroup": "4000",
            "acadOrg": "COMSCI",
            "associatedClassNbr": "1",
            "campus": "C",
            "catalogNbr": " 340",
            "classNbr": "46302",
            "classDescr": "Operating Systems",
            "classStatus": "A",
            "classType": "E",
            "classSection": "L01C",
            "combinedSectionId": " ",
            "component": "LEC",
            "consent": "N",
            "dropConsent": "N",
            "crseId": "001390",
            "crseOfferNbr": 1,
            "startDate": "2018-07-16",
            "endDate": "2018-11-12",
            "enrolCap": 320,
            "enrolTotal": 315,
            "instructorMode": "P",
            "meetingPatterns": [
                {
                    "startDate": "2018-07-18",
                    "endDate": "2018-08-22",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "wed",
                    "meetingNumber": 1
                },
                {
                    "startDate": "2018-09-12",
                    "endDate": "2018-10-17",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "wed",
                    "meetingNumber": 2
                },
                {
                    "startDate": "2018-07-19",
                    "endDate": "2018-08-23",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "thu",
                    "meetingNumber": 3
                },
                {
                    "startDate": "2018-09-13",
                    "endDate": "2018-10-18",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "thu",
                    "meetingNumber": 4
                },
                {
                    "startDate": "2018-07-20",
                    "endDate": "2018-08-24",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "fri",
                    "meetingNumber": 5
                },
                {
                    "startDate": "2018-09-14",
                    "endDate": "2018-10-19",
                    "startTime": "11:00:00",
                    "endTime": "12:00:00",
                    "location": "201N-346",
                    "daysOfWeek": "fri",
                    "meetingNumber": 6
                }
            ],
            "session": "1",
            "visible": true,
            "status": "O",
            "subject": "COMPSCI",
            "term": "1185",
            "year": 2018
        }
    ],
    "total": 2
};

$("#subject").change(function () {
    //TODO send ajax update items

    $.each(items.data, function (i, item) {
        $('#course').append($('<option>', {
            value: item.classNbr,
            text: item.classDescr
        }));
    });
});

$("#submit").click(function () {
    var course = $('#course').val();
});