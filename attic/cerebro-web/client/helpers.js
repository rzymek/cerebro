UI.registerHelper('json', function(obj) {
    return JSON.stringify(obj, null, 2);
});

function fmt(c, s) {
    while (s.toString().length < c) {
        s = '0' + s;
    }
    return s;
}
fmtDate = function(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + "-" + fmt(2, date.getMonth() + 1) + "-" + fmt(2, date.getDate()) + " "
            + fmt(2, date.getHours()) + ":" + fmt(2, date.getMinutes());
};
fmtDatePart = function(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + "-" + fmt(2, date.getMonth() + 1) + "-" + fmt(2, date.getDate());
};


UI.registerHelper('fmtDate', fmtDate);

UI.registerHelper('get', function(name){
    return Session.get(name);
});