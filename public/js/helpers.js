// Citation for following page:
// Date: 05/14/2022
// Adapted from:
// Source: https://web.archive.org/web/20170825085136/http://www.codyrushing.com:80/using-handlebars-helpers-on-both-client-and-server
var register = function(Handlebars) {
    var helpers = {
    formatDate: function(sqlDate) {
        var jsDate = new Date(sqlDate);
        return jsDate.toDateString();
    }
    };
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for(var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }
};

module.exports.register = register;
module.exports.helpers = register(null);