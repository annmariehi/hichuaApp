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