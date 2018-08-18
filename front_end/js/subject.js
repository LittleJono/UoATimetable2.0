var course_list = [
    {"key":"111","value":"An Introduction to Practical Computing"},
    {"key":"101","value":"Principles of Programming"},
    {"key":"105","value":"Principles of Computer Science"},
    {"key":"107","value":"Computer Science Fundamentals"},
    {"key":"210","value":"Computer Systems 1"},
    {"key":"215","value":"Computer Systems 2"},
    {"key":"220","value":"Algorithms and Data Structures"},
    {"key":"225","value":"Discrete Structures in Mathematics and Computer Science"},
    {"key":"230","value":"Programming Techniques"},
    {"key":"280","value":"Introduction to Software Development"},
    {"key":"313","value":"Computer Organisation"},
    {"key":"314","value":"Modern Data Communications"},
    {"key":"320","value":"Applied Algorithmics"},
    {"key":"335","value":"Distributed Objects, Services and Programming"},
    {"key":"340","value":"Operating Systems"},
    {"key":"345","value":"Human Computer Interaction"},
    {"key":"350","value":"Mathematical Foundations of Computer Science"},
    {"key":"351","value":"Fundamentals of Database Systems"},
    {"key":"361","value":"Machine Learning"},
    {"key":"367","value":"Artificial Intelligence"},
    {"key":"369","value":"Computational Science"},
    {"key":"373","value":"Computer Graphics and Image Processing"},
    {"key":"380","value":"Undergraduate Project in Computer Science"}];

$("#subject").change(function () {
    $.each(course_list, function (i, item) {
        $('#course').append($('<option>', {
            value: item.key,
            text: item.key + " " + item.value
        }));
    });
});

$("#submit").click(function () {
    var course = $('#course').val();
});