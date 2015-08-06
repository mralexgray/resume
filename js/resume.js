if ((location.protocol != "https:") && (location.hostname != "resume.dev") && (location.hostname != "localhost") && (location.hostname != "127.0.0.1")) {
    location.protocol = "https:";
}

$(document).ready(function() {

    // Hide Javascript required notice
    $("#noJavascript").hide();

    // Load JSON file with data
    $.getJSON("data/resume.json", function(data) {
        // Load template
        var template = $("#template").html();
        var dateTemplate = $("#dateTemplate").html();
        var experienceTemplate = $("#experienceTemplate").html();
        var projectTemplate = $("#projectTemplate").html();
        var organizationTemplate = $("#organizationTemplate").html();
        var skillTemplate = $("#skillTemplate").html();
        var schoolTemplate = $("#schoolTemplate").html();

        // Register partial templates
        Handlebars.registerPartial("date", dateTemplate);
        Handlebars.registerPartial("experience", experienceTemplate);
        Handlebars.registerPartial("project", projectTemplate);
        Handlebars.registerPartial("organization", organizationTemplate);
        Handlebars.registerPartial("skill", skillTemplate);
        Handlebars.registerPartial("school", schoolTemplate);

        // Register helpers
        Handlebars.registerHelper("shortenDate", shortenDate);
        Handlebars.registerHelper("formatPhone", formatPhone);
        Handlebars.registerHelper("formatGPA", formatGPA);
        Handlebars.registerHelper("compare", handlebarsCompare);

        // Compile templates
        var output = Handlebars.compile(template)(data);

        // Output result
        $("#resume").append(output);

        // Set layout
        $("h2").css("fontSize", data.layout.html.size.name);
        $("h3").css("fontSize", data.layout.html.size.titles);
        $("div").css("fontSize", data.layout.html.size.paragraph);
        $("li").css("fontSize", data.layout.html.size.details);
        $("#headerColumns").css("fontSize", data.layout.html.size.header);

        // Set page title
        document.title = data.name + " - Resume";

        // Setup Google Analytics
        if (data.analytics) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', data.analytics, 'auto');
            ga('send', 'pageview');
        }
    })

    // Output error status on failure to load JSON
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("Error: " + textStatus);
    });
});

// Function for shortening dates (e.g. 2014 -> '14)
function shortenDate(input) {
    if (isNaN(input)) {
        return input.substr(0,3);
    }

    return "'" + input.toString().substr(2,2);
}

// Function for formatting GPA (e.g. 4 -> 4.00)
function formatGPA(input) {
    return input.toFixed(2);
}

// Function for formatting telephone number (e.g. +1 (123) 456-7890 -> 1-123-456-7890)
function formatPhone(input) {
    input = input.replace(/[+()]/g, "");
    input = input.replace(/\s/g, "-");

    return input;
}

// Function for comparing data in Handlebars
function handlebarsCompare(lvalue, operator, rvalue, options) {
    var operators, result;

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }

    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}
