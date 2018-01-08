var weeklySummaries = [];
var summaryData = [];
var today = new Date();
var currentYear = today.getFullYear();

function setup() {

    CalculateSummaries();

    var observer = new MutationSummary({
        callback: CalculateSummaries,
        queries: [{ element: 'div[id="categoryDetailedView"], div.detailed-wrp' }]
    });
}

function CalculateSummaries() {
    weeklySummaries = [];
    summaryData = [];
    today = new Date();
    currentYear = today.getFullYear();

    BuildPointCollection();

    DisplaySummaryData();
}

function DisplaySummaryData() {
    for (var i = 0; i < weeklySummaries.length; i++) {
        var startOfWeek = weeklySummaries[i];
        var summary = summaryData[startOfWeek];

        var newRecord = CreateSummaryRow(startOfWeek, summary.Points);

        $(newRecord).insertBefore($(summary.htmlItem).closest("li.gray-bg, li.padding0"));
    }
}

function BuildPointCollection() {
    var data = $("ul.detail-wrp");

    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        var points = $(entry).find("span.points").attr("data-memberpointsval");
       
        var entryDateText = $(entry).find("h3.date").text();

        var date = GetDateForEntry(entryDateText);

        AddToWeeklySummary(date, points, entry);
    }
}

function GetStartOfWeek(date) {
    var dayOfWeek = date.getDay();
    var innerDate = new Date(date);

    var diff = date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1); // adjust when day is sunday
    var startOfWeek = new Date(innerDate.setDate(diff));

    return startOfWeek;
}

function AddToWeeklySummary(date, points, entry) {
    
    var startOfWeek = GetStartOfWeek(date);
    var intPoints = parseInt(points);
    
    //console.log("Adding " + intPoints + " From " + date + " to Week: " + startOfWeek);

    if (summaryData[startOfWeek] == null) {
        summaryData[startOfWeek] = { Points: intPoints, LastRecord: date, htmlItem: $(entry) };
        weeklySummaries.push(startOfWeek);

    } else {

        var record = summaryData[startOfWeek];

        var currentPoints = parseInt(record.Points);
        var newPoints = currentPoints + intPoints;

        var lastRecord = new Date(record.LastRecord);
        var item = record.htmlItem;

        if (date > lastRecord) {
            lastRecord = date;
            item = $(entry);
        }

        //console.log("Summary already exists for " + startOfWeek + ". Current Points: " + currentPoints + ". New Points: " + newPoints + ".");

        summaryData[startOfWeek] = { Points: newPoints, LastRecord: lastRecord, htmlItem: item };
    }
}

function GetDateForEntry(entryDateText) {
    var date = new Date(entryDateText + " " + currentYear);

    //Ensure the date is in the past.
    if (date > today) {
        date = new Date(entryDateText + " " + (currentYear - 1));
    }

    return date;
}

function CreateSummaryRow(date, points) {
    var html =`<li data-categorylist="true" class="gray-bg padding0">
            <div class="detailed-wrp gray-point-wrp">
            <ul class="detail-wrp">
                <li class="width75 pad14">
                    <div class="detail-one">

                        <h3 class="date">##Date##</h3>
                    </div>
                </li>

                <li>
                    <div class="detail-three width637">
                        <h3>
                            ***Weekly Summary***
                        </h3>
                        <a href="#" class="show-details">Show details</a>
                        <div class="payment-details display-none">
                            <p>Total Weekly Summary for Week ending ##Date##</p>


                            <p class="pad-bottom55"><a href="#" class="hide-details float-right">Hide details</a></p>
                        </div>
                        <div class="point-social-wrp display-none ">
                            
                        </div>
                        
                    </div>
                </li>
                <li>
                    <div class="detail-five block-eqlheight">

                        
                    </div>
                </li>
                <li>
                    <div class="detail-four block-eqlheight">
                        <span data-memberpoints="true" data-memberpointsval="3" class="fields points">##Points##</span>
                    </div>
                </li>
            </ul>
        </div>
    </li>
`;

    var weekEndDate = new Date(date.setDate(date.getDate() + 6));
    var formattedDate = formatDate(weekEndDate);

    html = html.replace("##Date##", formattedDate);
    html = html.replace("##Date##", formattedDate);
    html = html.replace("##Points##", points);

    return html;
}

function formatDate(date) {
    const monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    //var year = date.getFullYear();

    return pad(day, 2) + " " + monthNames[monthIndex] //+ " " + year;
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

$(setup);