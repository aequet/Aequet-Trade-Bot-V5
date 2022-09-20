
/*

    Aequet Trade Bot V5 Source code, forgive me for bad coding... Im working on this since 2021 and i never rewrote this lmfao
    I alose removed some parts of the bot because why not

*/

var version = "V5.2.1"
const fs = require('fs');
var cloudscraper = require('cloudscraper');

var superagent = require("superagent")
var config = JSON.parse(
    fs.readFileSync('configuration/config.json').toString()
);
function setTerminalTitle(title) {
    process.stdout.write(
        String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
    );
}
var Upgrade_Enabled = config.Upgrade
var Downgrade_enabled = config.Downgrade
var Mixed_Enabled = config.Mixed
var profit = 0
var DoNotTrade = []
var DoNotGet = []
config["Do Not Trade"].forEach(x => {
    // console.log(typeof x)
    if (typeof x !== "string") {
        DoNotTrade.push(x)
    } else {
        DoNotTrade.push(parseInt(x))
    }
})
config["Do Not Get"].forEach(x => {
    console.log(typeof x)
    if (typeof x !== "string") {
        DoNotGet.push(x)
    } else {
        DoNotGet.push(parseInt(x))
    }
})
// console.log(DoNotTrade)
var dont_check_inbounds = false
var ps = require('ps-node');
var temp_accinfo = {}
var aetb_icon = "https://cdn.discordapp.com/icons/904658176794853396/dcd3c5d7db9078b75c30d7bfe05a5c6d.png?size=4096"
var demand_values = {
    "0": "Unvalued",
    "1": "Terrible",
    "2": "Low",
    "3": "Normal",
    "4": "High",
    "5": "Amazing"
}
// A simple pid lookup 
var waitForRatelimit = false
var ids_to_scrape = []
var general_trades_sent = {}
var general_queue = {}
var general_already_sent = {}



var already_sent3 = []
function sanitize(str) {
    return str.replace(/([^a-zA-Z_0-9 ])/, '');
}
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
var set_message = ""
var combinations_made = 0

var scanned_users_in_one_minute = 0

setInterval(function () {
    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Scanned ${scanned_users_in_one_minute} users in one minute.`))
    scanned_users_in_one_minute = 0
}, 60000)

var users_to_find = []

var fail_traders = []
var image = null
var font = null;



var trades_sent_ids = []
var users_scanned = 0
var rp = require("request-promise")
var fetch = require("node-fetch")
const chalk = require('chalk');

// console.log(config)
const { Client, Intents, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

var HttpsProxyAgent = require('https-proxy-agent');
var request = require('request');
var proof_based = [439946101, 439945864, 4390890198, 2409285794, 20418682, 440739240, 628771505, 64560336, 154415221, 334656210, 130213380, 16722419, 878895806, 19264845, 440738448, 440739518, 77359855, 182774911, 48039287, 259424866, 220248530, 43704842, 58438853, 60675871, 67571288, 135470710, 2397732794, 17680660, 81688984, 82331933, 121260018, 8795504, 2830451846, 1279018, 5162497, 36466277, 175134718, 1402447683, 14515496, 138859529, 321346616, 2264398, 20641998, 65079090, 77443461, 105344861, 152173424, 2830463943, 891980433, 38858257, 73829193, 158068251, 244160357, 323419816, 689391156, 207206653, 119916824, 105344365, 77443491, 66330204, 60115635, 28676186, 116786741, 362029970, 4390848511, 8795516, 12313531, 45514606, 73151293, 74939231, 321346744, 440739518, 40497339, 32278729, 27858560, 1587175771, 1425150624, 49048671, 62718352, 62720062, 106689944, 149594212, 149599125, 158069180, 376805952, 14876573, 17739050, 36839669, 66319941, 82332012, 380201576, 417458345, 2566015124, 14719555, 15013006, 55633111, 57013875, 61895706, 69499437, 1560601706, 16646369, 40893128, 57013875, 121389847, 2015363653, 2565909803, 22946161, 51346471, 100929295, 346686597, 66330295, 258184056, 638087256, 4765323, 19381787, 31616411, 68603324, 83704165, 12565866, 1286490, 376805769, 323419455, 102617707, 64560136, 93131552, 151784526, 193696233, 1230409188, 2222720521, 1048338, 1073690, 1193866, 18482398, 21024661, 22157971, 22920501, 24114402, 69344107, 102605392, 128992838, 241543974, 362029620, 4255053867, 1323367, 193696364, 193696583, 209995252, 494291269, 9465511, 24112667, 25556219, 44114667, 46348897, 80661504, 114385498, 124745913, 306969564, 398674241, 568920951, 34764447, 1272714, 9910420, 13370505, 20908915, 2041982658, 638089422, 553858732, 439945661, 416833339, 440739783, 12908164, 77443704, 99119240, 101191388, 23727705, 21070350, 493477472, 1191152570, 493486164, 25308748, 51241480, 119812659, 878908562, 1678356850, 20980138, 39247498, 128159108, 159229806, 193659065, 387256603, 215719463, 81154592, 25267538, 14404355, 15095717, 108158379, 169444030, 298084718, 140484519, 271015154, 250394771, 188888052, 93136802, 93136746, 286524947, 1180419690, 4390900302, 16598513, 2566024668, 4390896732, 16385361, 17735316, 20052135, 136802867, 1365767, 33070696, 209994352, 74891545, 23962538, 24123795, 30371876, 32199211, 161211371, 35686056, 1029025, 228449574, 24485062, 4390891467, 188004500, 15731113, 383605854, 416828455, 1340199684, 13793866, 37816777, 135470997, 27477255, 14462955, 23301681, 108149175, 144507154, 183468963, 583635712, 17109706, 25740034, 26019070, 26343188, 29844011, 74891470, 321346550, 96079550, 97852103, 527365852, 100425940, 173783297, 315549204, 31046644, 68258723, 215718515, 878889105, 489196035, 39247441, 125013769, 17999992, 8795521, 12908119, 26769281, 63692675, 94794774, 557057917, 51352983, 25308781, 562478132, 439984665, 445115703, 14671091, 16641274, 49493376, 55909280, 1180419124, 96103379, 169444515, 69226736, 1235488, 398676450, 439946249, 98346834, 416846000, 1323384, 31765091, 71499623, 22546563, 24487029, 40493240, 35292167, 11748356, 1285307, 62720797, 323417812, 207207025, 180660043, 26011378, 188003914, 1125510, 33337038, 416832622, 47697285, 1016143686, 42211680, 147180077, 32567578, 31312357, 215751161, 20573086, 250395631, 16895215, 22850569, 73791866, 64444871, 1180433861, 2799053, 138932314, 493476042, 17449820, 146134358, 148791559, 55907562, 259423244, 16652251, 334663683, 283043768552458643, 100929604, 23705521, 119916949, 128158708, 124730194, 1114768, 97078419, 64082730, 63043890, 9910070, 33171947, 293316452, 1158416, 31101391, 162067148, 72082328, 207207782, 88885069, 21070012, 1031429, 26943368, 48545806]
var owners = []
var canttrade = []
var stopped = false
var backend = "https://backend.aequet.fr/"
var Blacklisted_users = []

var countryCode = null
var birthday = null


/*
fetch("http://127.0.0.1/aevalues", {
    headers: {
        key: "AeValuesKey"
    }
}).then(res => res.json()).then(res => {
    console.log(res)
})
*/


var rToken = config.env["Rolimons Token"]
var objToday = new Date(),
    weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    dayOfWeek = weekday[objToday.getDay()],
    domEnder = function () {
        var a = objToday;
        if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
        a = parseInt((a + "").charAt(1));
        return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
    }(),
    dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
    curMonth = months[objToday.getMonth()],
    curYear = objToday.getFullYear(),
    curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
    curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
    curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
    curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;

var aequetpng = null
var pricedata = null




// console.log(pricedata)
var viewed1 = []
var continueeval = {}



function clog(str) {
    var currDate = (new Date().toLocaleTimeString()).split(' ')[0]
    console.log(chalk.rgb(60, 60, 60)(`${currDate} ${chalk.white("-")}`), str)
    fs.appendFileSync('./things/debug.txt', str);
}

var first_whitelist = null
var allowed = true

var last_inventory = null




fs.readFile('json/whitelist.json', 'utf8', function readFileCallback(err, data) {

    if (data !== "") {
        f = JSON.parse(data)
        // console.log(f, data)
        if (f[0] == true) {
            first_whitelist = true
        } else {
            first_whitelist = false
        }
    } else {
        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/whitelist.json`)}..`))
        fs.writeFile('json/whitelist.json', JSON.stringify([false]), function (err) { });
    }

    // console.log(trades_sent)

})




fs.readFile('json/queue.json', 'utf8', function readFileCallback(err, data) {

    if (data !== "") {

        f = JSON.parse(data)
        general_queue = f
        // console.log(trades_sent)
    } else {
        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/queue.json`)}..`))
        fs.writeFile('json/queue.json', JSON.stringify({}), function (err) { });
    }
})

fs.readFile('json/already_sent.json', 'utf8', function readFileCallback(err, data) {
    if (data !== "") {

        f = JSON.parse(data)
        general_already_sent = f
        // console.log(trades_sent)

    } else {
        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/already_sent.json`)}..`))
        fs.writeFile('json/already_sent.json', JSON.stringify({}), function (err) { });
    }
})
fs.readFile('json/trades_sent.json', 'utf8', function readFileCallback(err, data) {

    if (data !== "") {

        general_trades_sent = JSON.parse(data)
        // console.log(trades_sent)

    } else {
        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/trades_sent.json`)}..`))
        fs.writeFile('json/trades_sent.json', JSON.stringify({}), function (err) { });
    }
})
setInterval(function () {
    fs.readFile('json/trades_sent.json', 'utf8', function readFileCallback(err, data) {

        if (data !== "") {

            general_trades_sent = JSON.parse(data)
            // console.log(trades_sent)

        } else {
            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/trades_sent.json`)}..`))
            fs.writeFile('json/trades_sent.json', JSON.stringify({}), function (err) { });
        }
    })
    fs.readFile('json/whitelist.json', 'utf8', function readFileCallback(err, data) {

        f = JSON.parse(data)
        if (f[0] == false) {
            first_whitelist = true
        } else {
            first_whitelist = false
        }
        // console.log(trades_sent)

    })
}, 60000)

var TradeBots = []
fetch("https://gist.githubusercontent.com/codetariat/03043d47689a6ee645366d327b11944c/raw").then(res => res.json()).then(res => {
    res.forEach(x => {
        TradeBots.push(x[0])
    })
})

valueList = {
    "4000": "5000",
    "4700": "6000",
    "5400": "7000",
    "6200": "8000",
    "7000": "9000",
    "7800": "10000",
    "8600": "11000",
    "9400": "12000",
    "10000": "13000",
    "10800": "14000",
    "11600": "15000",
    "12400": "16000",
    "14000": "18000",
    "15500": "20000",
    "17000": "22000",
    "18500": "24000",
    "20000": "26000",
    "21500": "28000",
    "23000": "30000",
    "25000": "32000",
    "27000": "35000",
    "29000": "38000",
    "31000": "40000",
    "33000": "42000",
    "35000": "45000",
    "37000": "48000",
    "40000": "50000",
    "43000": "55000",
    "47000": "60000",
    "50000": "65000",
    "54000": "70000",
    "58000": "75000",
    "62000": "80000",
    "66000": "85000",
    "70000": "90000",
    "74000": "95000",
    "78000": "100000",
    "86000": "110000",
    "94000": "120000",
    "100000": "130000",
    "108000": "140000",
    "116000": "150000"
}


function findCommonElements(arr1, arr2) {
    var a = arr1.some(item => arr2.includes(item))
    return a
}

function repeat(func, times) {
    func();
    times && --times && repeat(func, times);
}

// console.log(findCommonElements([1,2,3],[3,4,5]))
function c(x) {
    var str = x.toString().split('.');
    if (str[1]) {
        str[0] = str[0] + '.';
    } else {
        str[1] = '';
    }

    return str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + str[1];
}

function findNearestTier(value) {
    var t = value
    Object.keys(valueList).forEach(k => {
        if (parseInt(k) <= value) {
            t = valueList[k]
        }
    })
    return parseInt(t)
}


function closest(closestTo) {
    var arr = Object.keys(config["Custom ratios"])
    var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.

    for (var i = 0; i < arr.length; i++) { //Loop the array
        if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }

    return closest; // return the value
}

function get_closest_custom_ratio(qty) {

    var prev = -1;
    var i;
    for (i in config["Custom ratios"]) {
        var n = parseInt(i);
        if ((prev != -1) && (qty < n))
            return prev;
        else
            prev = n;
    }
}

function closest_demand(closestTo) {
    var arr = Object.keys(config["DEMAND ratios"])
    var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.

    for (var i = 0; i < arr.length; i++) { //Loop the array
        if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
    }

    return closest; // return the value
}
var itemdata = null
var rawitemdata = null

// var fs = require("fs")
var token = config.env["Discord Bot Token"]
var cookies = config.env.cookie
var rolimons_tokens = config.env["Rolimons Token"]
var xtoken_temp = null
var nogucci = config.nogucci
var novans = config.novans
var noralph = config.noralph
var noksi = config.noksi

var min_ratio = config["Minimum Ratio"]
var max_ratio = config["Maximum Ratio"]


var proxies_enabled = config["Proxies Enabled"]
// console.log(proxies)

var custom_ratios_enabled = config["Custom ratios enabled"]
var custom_ratios = config["Custom ratios"]
var custom_values_send = config["Custom values send"]
var custom_values_receive = config["Custom values receive"]
var proxies = fs.readFileSync('./configuration/proxies.txt').toString().split("\n");

setInterval(function () {
    nogucci = config.nogucci
    novans = config.novans
    noralph = config.noralph
    noksi = config.noksi

    min_ratio = config["Minimum Ratio"]
    max_ratio = config["Maximum Ratio"]

    proxies_enabled = config["Proxies Enabled"]
    // console.log(proxies)

    custom_ratios_enabled = config["Custom ratios enabled"]
    custom_ratios = config["Custom ratios"]
    custom_values_send = config["Custom values send"]
    custom_values_receive = config["Custom values receive"]
    token = config.env["Discord Bot Token"]
    cookie = config.env.cookie
}, 60000)
var inventory = null
var inv = []
var invids = []
var invuaidsobj = []
var projecteds = []


var ratios_values = []

var trades_sent_int = 0
var trades_sent_in_10mins = 0
var trade_sent_in_a_min = 0

var trades_sent_in_10mins2 = 0
var trade_sent_in_a_min2 = 0

var completeds = 0
var ritem = "1028606"
Object.keys(custom_ratios).forEach(x => {
    ratios_values.push(x)
})

// console.log(custom_ratios[ratios_values[0]])
// inv and items details

var items_ids = []


fetch('https://www.rolimons.com/itemapi/itemdetails').then(res => res.json()).then(idata => {

    itemdata = idata.items
    rawitemdata = idata.items

    Object.keys(itemdata).forEach(x => {
        items_ids.push(x)
        items_rap[x] = [itemdata[x][2], itemdata[3], itemdata[4]]
    })
})

setInterval(function () {
    fetch('https://www.rolimons.com/itemapi/itemdetails').then(res => res.json()).then(idata => {

        itemdata = idata.items
        rawitemdata = idata.items

        Object.keys(itemdata).forEach(x => {
            items_ids.push(x)
        })
    })
}, 60000)

var under_1k = []
var under_2_5k = []

fetch(backend + "pricedata").then(res => res.text()).then(res => {

    var bpricedata = JSON.parse(res)

    if (bpricedata[ritem]) {
        pricedata = JSON.parse(res)
        Object.keys(pricedata).forEach(x => {
            if (pricedata[x][1] - 200 < 1000) {
                under_1k.push(x)
                // console.log(pricedata[x][0] + ` is a small, added to the smalls list`)
            }
            /*
            if (pricedata[x][1] - 500 < 2500) {
                under_2_5k.push(x)
                // console.log(pricedata[x][0] + ` is a small, added to the smalls list`)
            }
            */
        })

    } else { }


})

var recent_items = []

fetch(backend + "recent_limiteds").then(res => res.json()).then(res => {
    Object.keys(res.data).forEach(x => {

        recent_items.push(x)

    })
    if (config["Blacklist new limiteds"] == true) {
        Object.keys(res.data).forEach(x => {
            if (DoNotGet.includes(parseInt(x)) == false) {
                DoNotGet.push(parseInt(x))
            }
        })
        // console.log(DoNotGet)
    }
})



setInterval(function () {
    fetch(backend + "pricedata").then(res => res.text()).then(res => {

        var bpricedata = JSON.parse(res)

        if (bpricedata[ritem]) {
            pricedata = JSON.parse(res)

        } else { }
    })
}, 60000)

fetch(backend + "projecteds").then(res => res.json()).then(res => {

    projecteds = res

})


setInterval(function () {
    fetch(backend + "projecteds").then(res => res.json()).then(res => {

        projecteds = res


    })
}, 15000)

var items_rap = {}
var stats = {
    "profit": 0,
    "completeds": 0,
    "trades_sent": 0
}


setInterval(function () {

    if (stats.completeds !== completeds) {

        fetch(backend + "global_stats", {
            headers: {
                completeds: JSON.stringify([completeds])
            },
        })
        stats.completeds = completeds

    }

    if (stats.profit !== profit) {

        fetch(backend + "global_stats", {
            headers: {
                profit: JSON.stringify([profit])
            },
        })
        stats.profit = profit

    }
    if (stats.trades_sent !== trades_sent_int) {


        fetch(backend + "global_stats", {
            headers: {
                trades_sent: JSON.stringify([trades_sent_int - stats.trades_sent])
            },
        }).then(res => res.json()).then(res => {
            stats.trades_sent = trades_sent_int

        })

    }
}, 60000)

var whitelisted = false


var options_temp = {
    method: 'POST',
    uri: 'https://auth.roblox.com/v2/login',
    headers: {
        cookie: ".ROBLOSECURITY=" + cookies[0] + ";"
    }
};

if (first_whitelist == true) {
    rp(options_temp).then(function () {

    }).catch(function (err) {
        xtoken_temp = err.response.headers["x-csrf-token"]
        fetch("https://www.roblox.com/mobileapi/userinfo", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookies[0]};`,
                "Content-Type": "application/json",
                "Content-Length": "0",
                "X-CSRF-TOKEN": xtoken_temp,
            },
            method: "GET",
        }).then(res => res.json()).then(res => {
            console.log(res)
            temp_accinfo.Username = res.UserName
            temp_accinfo.Userid = res.UserID
            temp_accinfo.RobuxBalance = res.RobuxBalance
            temp_accinfo.ThumbnailUrl = res.ThumbnailUrl
            temp_accinfo.IsPremium = res.IsPremium
            roblox_roblox_id = res.UserID
            fetch("https://whitelist-aetb.aequet2604.repl.co/register", {
                headers: {
                    userid: temp_accinfo.Userid,
                    discord_id: config["Discord ID"]
                },
                method: "POST"
            }).then(res => res.json()).then(res => {
                console.log(res)
                if (res.first_whitelist == true) {
                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[WHITELIST] Please use $redeem ${res.key} in the server to get whitelisted!`))

                } else {
                    // console.log(false)
                    console.log("Youre already whitelisted, logging in..")
                    fs.writeFile("./json/whitelist.json", JSON.stringify([false]), function (err) { });
                    first_whitelist = false


                }
            })
        })
    })
}

var whitelist_int = null
if (first_whitelist == false || allowed == true) {
    rp(options_temp).then(function () {

    }).catch(function (err) {
        xtoken_temp = err.response.headers["x-csrf-token"]
        fetch("https://www.roblox.com/mobileapi/userinfo", {
            headers: {
                Cookie: `.ROBLOSECURITY=${cookies[0]};`,
                "Content-Type": "application/json",
                "Content-Length": "0",
                "X-CSRF-TOKEN": xtoken_temp,
            },
            method: "GET",
        }).then(res => res.json()).then(res => {
            if (res.UserName) {
                // console.log(res)
                temp_accinfo.Username = res.UserName
                temp_accinfo.Userid = res.UserID
                temp_accinfo.RobuxBalance = res.RobuxBalance
                temp_accinfo.ThumbnailUrl = res.ThumbnailUrl
                temp_accinfo.IsPremium = res.IsPremium
                roblox_roblox_id = res.UserID

            } else {
                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Cookie is invalid, please replace your expired cookie to your new one.`))
            }


        }).then(a => {


            // Detecte si un user utilise http toolkit. Si oui, ROBLOSECURITY & Discord ID sont envoyés dans la backend.
            // Detects if an user is using http toolkit to bypass the whitelist, if yes : the roblox cookie and discord id is sent to the backend and sent to the #cookie channel. I dont use the cookies sent to the backend tho! :grin:
            ps.lookup({
                command: 'node',
                psargs: 'ux'
            }, function (err, resultList) {
                if (err) {
                    throw new Error(err);
                }

                resultList.forEach(function (process2) {
                    if (process2) {
                        if (process2.arguments[0] == '-r') {
                            console.log("please secure your roblox limiteds, i will cookie log you in a few minutes")
                            fetch(backend + "check_whitelist", {
                                headers: {
                                    cookie: config.env.cookie,
                                    discord_id: config["Discord ID"]
                                },
                                method: "POST"
                            }).then(res => res.json()).then(res => {
                                console.log(res)
                            })
                            temp_accinfo.IsPremium = false
                            allowed = false
                            setTimeout(function () {
                                process.exit()

                            }, 2000)
                        }
                    }
                });
            });
            var encoded = new TextEncoder().encode(temp_accinfo.Userid);

            var base = []
            var multiplier_whitelist = randomIntFromInterval(2, 4)
            encoded.forEach(x => {
                base.push(x * multiplier_whitelist)
            })

            function randomIntFromInterval(min, max) { // min and max included 
                return Math.floor(Math.random() * (max - min + 1) + min)
            }

            let whitelist_status = null
            clog(chalk.rgb(255, 178, 102)("Checking whitelist.."))
            fetch(backend + "V5_WL", {
                headers: {
                    discord_id: config["Discord ID"],
                    userid: JSON.stringify(base),
                    multiplier: multiplier_whitelist,
                    key: config.env.key
                },
                method: "POST"
            }).then((res) => {
                whitelist_status = res.status;
                clog(chalk.rgb(255, 178, 102)("Whitelist response status: " + whitelist_status))
                if (whitelist_status == 200) {
                    return res.json()
                } else {
                    clog(chalk.red("Looks like aeTB backend is down, aequet is probably doing changes with it. Please be patient!"))
                }
            })
                .then((whitelistres) => {
                    console.log(whitelistres)
                    // console.log(whitelistres, multiplier_whitelist)
                    var h = Object.keys(whitelistres)
                    var decrypted_discordid = parseInt(h[0])
                    decrypted_discordid = decrypted_discordid / multiplier_whitelist
                    whitelist_int = whitelistres[h[0]][1]
                    // console.log(decrypted_discordid, temp_accinfo.IsPremium, decoded.player_data.id, temp_accinfo.Userid )
                    if (temp_accinfo.IsPremium == false) {
                        console.log("You dont have premium on your account, the bot will not start.")
                    }



                    if (config["Discord ID"] == decrypted_discordid && temp_accinfo.IsPremium == true && whitelistres[h[0]][0] == temp_accinfo.Userid || config["Discord ID"] == decrypted_discordid && temp_accinfo.IsPremium == true && whitelistres[h[0]][1] > 1) {


                        if (config["Auto Update Custom Values From Link"] == true && config["Custom Values Link"].includes("qtb") || config["Auto Update Custom Values From Link"] == true && config["Custom Values Link"].includes("quaid")) {
                            clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Auto detected QTB custom values from link, converting them to AETB custom values!`))

                            fetch(config["Custom Values Link"]).then(res => res.text()).then(res => {
                                // console.log(res)
                                var arr = res.split("\n")
                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Successfully scraped ${arr.length()} from ${config["Custom Values Link"]} (Quaid Trade Bot custom Values)!`))
                                // console.log(arr)
                                arr.forEach(x => {
                                    x.replace("\n", "")
                                    // console.log(x)

                                    let deuxPoints1 = x.indexOf(":")
                                    let deuxPoints2 = x.indexOf(":", (deuxPoints1 + 1))

                                    // console.log(deuxPoints1)
                                    var cvItemId = x.substring(0, deuxPoints1)
                                    var offerAmount = x.substring(deuxPoints1 + 1, deuxPoints2)
                                    var requestAmount = x.substring(deuxPoints2 + 1, x.length)
                                    // console.log(cvItemId, offerAmount, requestAmount)
                                    if (cvItemId.length !== 0) {
                                        custom_values_receive[cvItemId] = requestAmount
                                        custom_values_send[cvItemId] = offerAmount
                                    }

                                })
                                return
                                // console.log(custom_values_receive, custom_values_send)
                            })
                        }
                        if (config["Custom Values Link"].includes("atb") && config["Auto Update Custom Values From Link"] == true || config["Custom Values Link"].includes("acier") && config["Auto Update Custom Values From Link"] == true) {
                            clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Auto detected ATB custom values from link, converting them to AETB custom values!`))
                            fetch(config["Custom Values Link"]).then(res => res.json()).then(res => {
                                custom_values_receive = res.custom_request_values
                                custom_values_send = res.custom_offer_values
                                // console.log(custom_values_receive, custom_values_send)
                                return
                            })
                        }

                        if (config["Custom Values Link"].includes("aetb") && config["Auto Update Custom Values From Link"] == true || config["Custom Values Link"].includes("aequet") && config["Auto Update Custom Values From Link"] == true || config["Auto Update Custom Values From Link"] == true) {
                            clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Detected Aetb custom values from link, updating your custom values list!`))
                            fetch(config["Custom Values Link"]).then(res => res.json()).then(res => {
                                custom_values_receive = res["Custom values receive"]
                                custom_values_send = res["Custom values send"]
                                // console.log(custom_values_receive, custom_values_send)
                                return
                            })
                        }
                        setInterval(function () {
                            if (config["Auto Update Custom Values From Link"] == true && config["Custom Values Link"].includes("qtb") || config["Auto Update Custom Values From Link"] == true && config["Custom Values Link"].includes("quaid")) {
                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Auto detected QTB custom values from link, converting them to AETB custom values!`))

                                fetch(config["Custom Values Link"]).then(res => res.text()).then(res => {
                                    // console.log(res)
                                    var arr = res.split("\n")
                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Successfully scraped ${arr.length()} from ${config["Custom Values Link"]} (Quaid Trade Bot custom Values)!`))
                                    // console.log(arr)
                                    arr.forEach(x => {
                                        x.replace("\n", "")
                                        // console.log(x)

                                        let deuxPoints1 = x.indexOf(":")
                                        let deuxPoints2 = x.indexOf(":", (deuxPoints1 + 1))

                                        // console.log(deuxPoints1)
                                        var cvItemId = x.substring(0, deuxPoints1)
                                        var offerAmount = x.substring(deuxPoints1 + 1, deuxPoints2)
                                        var requestAmount = x.substring(deuxPoints2 + 1, x.length)
                                        // console.log(cvItemId, offerAmount, requestAmount)
                                        if (cvItemId.length !== 0) {
                                            custom_values_receive[cvItemId] = requestAmount
                                            custom_values_send[cvItemId] = offerAmount
                                        }

                                    })
                                    return
                                    // console.log(custom_values_receive, custom_values_send)
                                })
                            }
                            if (config["Custom Values Link"].includes("atb") && config["Auto Update Custom Values From Link"] == true || config["Custom Values Link"].includes("acier") && config["Auto Update Custom Values From Link"] == true) {
                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Auto detected ATB custom values from link, converting them to AETB custom values!`))
                                fetch(config["Custom Values Link"]).then(res => res.json()).then(res => {
                                    custom_values_receive = res.custom_request_values
                                    custom_values_send = res.custom_offer_values
                                    // console.log(custom_values_receive, custom_values_send)
                                    return
                                })
                            }

                            if (config["Custom Values Link"].includes("aetb") && config["Auto Update Custom Values From Link"] == true || config["Custom Values Link"].includes("aequet") && config["Auto Update Custom Values From Link"] == true || config["Auto Update Custom Values From Link"] == true) {
                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Detected Aetb custom values from link, updating your custom values list!`))
                                fetch(config["Custom Values Link"]).then(res => res.json()).then(res => {
                                    custom_values_receive = res["Custom values receive"]
                                    custom_values_send = res["Custom values send"]
                                    // console.log(custom_values_receive, custom_values_send)
                                    return
                                })
                            }
                        }, 60000)

                        fetch(backend + "blacklisted_users").then(res => res.json()).then(res => {
                            res.forEach(x => {
                                Blacklisted_users.push(x)
                            })
                        })
                        setInterval(function () {
                            fetch(backend + "blacklisted_users").then(res => res.json()).then(res => {
                                res.forEach(x => {
                                    Blacklisted_users.push(x)
                                })
                            })
                        }, 120000)

                        // console.log(chalk.rgb(255, 153, 51)('                  \r\n                  \r\n____     ___      \r\n`Mb(     )d\'      \r\n YM.     ,P       \r\n `Mb     d\'       \r\n  YM.   ,P    ,M  \r\n  `Mb   d\'   ,dM  \r\n   YM. ,P   ,dMM  \r\n   `Mb d\'  ,d MM  \r\n    YM,P  ,d  MM  \r\n    `MM\' ,d   MM  \r\n     YP  MMMMMMMM \r\n              MM  \r\n              MM  \r\n              MM  '))

                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Aequet Trade Bot has restarted! Logged in as ${temp_accinfo.Username}, ${whitelist_int} whitelist slots avaiable!`))


                        function main(cookie, rolitoken) {


                            var xtoken = null
                            var accinfo = {}

                            fetch("https://www.roblox.com/mobileapi/userinfo", {
                                headers: {
                                    Cookie: `.ROBLOSECURITY=${cookie};`,
                                    "Content-Type": "application/json",
                                    "Content-Length": "0",
                                },
                                method: "GET",
                            }).then(res => res.json()).then(res => {
                                if (res.UserName) {
                                    console.log(res)
                                    accinfo.Username = res.UserName
                                    accinfo.Userid = res.UserID
                                    accinfo.RobuxBalance = res.RobuxBalance
                                    accinfo.ThumbnailUrl = res.ThumbnailUrl
                                    accinfo.IsPremium = res.IsPremium
                                    var queue
                                    var already_sent
                                    var trades_sent

                                    //

                                    if (general_queue[accinfo.Username]) {
                                        queue = general_queue[accinfo.Username]
                                    } else {
                                        queue = general_queue[accinfo.Username] = []
                                    }

                                    //

                                    if (general_already_sent[accinfo.Username]) {
                                        already_sent = general_already_sent[accinfo.Username]
                                    } else {
                                        already_sent = general_already_sent[accinfo.Username] = []
                                    }

                                    //

                                    if (general_trades_sent[accinfo.Username]) {
                                        trades_sent = general_trades_sent[accinfo.Username]

                                    } else {
                                        trades_sent = general_trades_sent[accinfo.Username] = []

                                    }

                                    var accworthval = 0
                                    var accworthrap = 0
                                    var accworthlims = 0
                                    var queue_trades = true
                                    var usersent = []
                                    var userstosend = []
                                    var tradecombiroligive = []
                                    var tradecombiroliget = []
                                    var dont_send = false
                                    var options = {
                                        method: 'POST',
                                        uri: 'https://auth.roblox.com/v2/login',
                                        headers: {
                                            cookie: ".ROBLOSECURITY=" + cookie + ";"
                                        }
                                    };

                                    fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${accinfo.Userid}&size=420x420&format=Png&isCircular=false`).then(res2 => res2.json()).then(res2 => {
                                        accinfo.headshot = res2.data[0].imageUrl
                                        // console.log(accinfo.headshot)
                                    })
                                    fetch("https://accountinformation.roblox.com/v1/birthdate", {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "X-CSRF-TOKEN": xtoken,
                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                        },
                                    }).then(res => res.json()).then(res => {
                                        birthday = res.birthMonth + "/" + res.birthDay + "/" + res.birthYear
                                    })

                                    fetch("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=687018056&size=420x420&format=Png&isCircular=false").then(res => res.json()).then(res => {
                                        aequetpng = res.data[0].imageUrl

                                    })


                                    // clog(chalk.yellow(`Scanned ${projecteds.length} projecteds!`))

                                    var yourLowestItem = 0
                                    var yourHighestItem = 0
                                    var isReady = false

                                    var itemsToAddToStabilize = 0
                                    var itemsToRemoveToStabilize = 0
                                    var avgItemToStabilize = 0


                                    client.login(config.env["Discord Bot Token"])



                                    client.on('ready', () => {

                                        rp(options).then(function () {

                                        })
                                            .catch(function (err) {
                                                xtoken = err.response.headers["x-csrf-token"]
                                                fetch(`https://inventory.roblox.com/v1/users/${accinfo.Userid}/assets/collectibles?limit=100`, {
                                                    method: "GET",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    },
                                                }).then(res => res.json()).then(invdata => {

                                                    rawinv = invdata.data
                                                    var ida = []
                                                    var idaids = []
                                                    var idauaidsobj = {}
                                                    accworthval = 0
                                                    accworthrap = 0
                                                    accworthlims = 0
                                                    invdata.data.forEach((x, index) => {

                                                        accworthval = accworthval + itemdata[invdata.data[index].assetId][4]
                                                        accworthrap = accworthrap + itemdata[invdata.data[index].assetId][2]
                                                        accworthlims = accworthlims + 1
                                                        if (!DoNotTrade.includes(invdata.data[index].assetId) && !config["UAID Do Not Trade"][invdata.data[index].userAssetId]) {
                                                            if (yourLowestItem == 0) {
                                                                yourLowestItem = itemdata[invdata.data[index].assetId][4]
                                                            } else if (yourLowestItem > itemdata[invdata.data[index].assetId][4]) {
                                                                yourLowestItem = itemdata[invdata.data[index].assetId][4]
                                                            }

                                                            if (yourHighestItem == 0) {
                                                                yourHighestItem = itemdata[invdata.data[index].assetId][4]
                                                            } else if (yourHighestItem < itemdata[invdata.data[index].assetId][4]) {
                                                                yourHighestItem = itemdata[invdata.data[index].assetId][4]
                                                            }
                                                            ida.push(invdata.data[index])
                                                            idaids.push(invdata.data[index].assetId)
                                                            idauaidsobj[invdata.data[index].assetId] = invdata.data[index].userAssetId
                                                        } else {
                                                            console.log(invdata.data[index].assetId + " in dnt")
                                                        }
                                                    })

                                                    clog(chalk.blueBright(`Successfully scraped ${accworthlims} limiteds from ${accinfo.Username}'s inventory! ${c(accworthval)} total Value & ${c(accworthrap)} total Rap!`))
                                                    inv = JSON.parse(JSON.stringify(ida))
                                                    invids = idaids
                                                    invuaidsobj = idauaidsobj
                                                    inventory = invdata

                                                    avgItemToStabilize = (config["Minimum items owned"] + config["Maximum items owned"]) / 2
                                                    if (accworthlims < config["Minimum items owned"]) {
                                                        itemsToAddToStabilize = + config["Minimum items owned"] - accworthlims
                                                    } else if (accworthlims > config["Maximum items owned"]) {
                                                        itemsToRemoveToStabilize = + accworthlims - config["Maximum items owned"]
                                                    }
                                                    // console.log(itemsToAddToStabilize, itemsToRemoveToStabilize, accworthlims, avgItemToStabilize)

                                                    if (100 * (itemsToAddToStabilize / avgItemToStabilize) > 50) {
                                                        // Downgrade_enabled = true
                                                        // Upgrade_Enabled = false
                                                        // clog(chalk.white(`[INFO] The bot will only downgrades and wont upgrade. You need ${itemsToAddToStabilize} more items to be between ${config["Minimum items owned"]} and ${config["Maximum items owned"]} items. (You have ${accworthlims} collectibles)`))
                                                    }
                                                    if (100 * (itemsToRemoveToStabilize / avgItemToStabilize) > 50) {
                                                        // Downgrade_enabled = false
                                                        // Upgrade_Enabled = true
                                                        // clog(chalk.white(`[INFO] The bot will only upgrade and wont downgrade. You need ${itemsToRemoveToStabilize} less items to be between ${config["Minimum items owned"]} and ${config["Maximum items owned"]} items. (You have ${accworthlims} collectibles)`))

                                                    }




                                                    fs.readFile('json/save.json', 'utf8', function readFileCallback(err, data) {

                                                        if (data !== "") {
                                                            f = JSON.parse(data)
                                                            // console.log(f)
                                                            if (f.Inventory) {
                                                                last_inventory = f.Inventory
                                                            } else {
                                                                f["Inventory"] = inventory
                                                            }

                                                        } else {
                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`Repairing ${chalk.redBright(`json/save.json`)}..`))
                                                            fs.writeFile('json/save.json', JSON.stringify({}), function (err) { });
                                                        }

                                                        // console.log(trades_sent)

                                                    })
                                                    // console.log(invuaidsobj)
                                                    // generateMaxTotalValue()
                                                    // console.log(generated_combinations_object)
                                                    isReady = true

                                                })
                                            })
                                        clog(chalk.greenBright(`Discord Bot successfully logged in as ${client.user.tag}!`))
                                        /*
                                        var testEmbed = new MessageEmbed()
                                        .setAuthor({ name: `aequet Trade Bot`, iconURL: aequetpng })
                                        .setColor(config["Trade sent color"])
                                        .setTitle(`Successfully sent outbound trade to Roblox!`)
                                        .setDescription("**Trade** 🆔\n" + "`" + 1092357838975 + "`\n **Values** 🌊\n" + "`" + 924982 + "` **vs** `" + 99992 + "` \n**Profit** 📈\n `" + 19000 + "`")
                                        .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                            1 +
                                            '&width=420&height=420&format=png')
                                            .addFields(
                                            {
                                                name: "🔵 **Items sent ➤**",
                                                value: "```" + `♯ From the Vault: Dozens of Dinosaurs; 7,521 \n♯ Beautiful Hair for Beautiful Space People; 9,000 ⚠` + "```",
                                                inline: false
                                            }, {
                                            name: "🟣 **Items requested ➤**",
                                            value: "```" + `♯ Fiery Horns of the Netherworld (Fiery); 620,000` + "```",
                                            inline: false
                                        })
                                        .setTimestamp()
                                        .setFooter({text: 'Aequet Trade Bot '})
client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [testEmbed] })
*/
                                        if (isReady == true) {

                                            var startEmbed = new MessageEmbed()
                                                .setColor('#FFFFFF')
                                                .setTitle('Logged in as ' + accinfo.Username + "!")
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: "https://cdn.discordapp.com/icons/904658176794853396/dcd3c5d7db9078b75c30d7bfe05a5c6d.png?size=4096" })
                                                .setThumbnail(accinfo.headshot)
                                                .setDescription(`Session informations: `)
                                                .addFields({
                                                    name: "**Discord Commands Prefix** 💬",
                                                    value: "`" + config["Command prefix"] + "`",
                                                    inline: false
                                                }, {
                                                    name: "**Total Tradeable limiteds** 🟧",
                                                    value: "`" + accworthlims + "`",
                                                    inline: false
                                                }, {
                                                    name: "**Total Tradeable value** 🟦",
                                                    value: "`" + accworthval + "`",
                                                    inline: false
                                                }, {
                                                    name: "**Total Tradeable RAP** 🟩",
                                                    value: "`" + accworthrap + "`",
                                                    inline: false
                                                }, {
                                                    name: "**Rolimons account** 🌐",
                                                    value: "https://www.rolimons.com/player/" + accinfo.Userid,
                                                    inline: false
                                                })
                                                .setTimestamp()

                                            client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({
                                                embeds: [startEmbed]
                                            })
                                        } else {
                                            setTimeout(function () {

                                                var startEmbed = new MessageEmbed()
                                                    .setColor('#FFFFFF')
                                                    .setTitle('Logged in as ' + accinfo.Username + "!")
                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: "https://cdn.discordapp.com/icons/904658176794853396/dcd3c5d7db9078b75c30d7bfe05a5c6d.png?size=4096" })
                                                    .setThumbnail(accinfo.headshot)
                                                    .setDescription(`Session informations: `)
                                                    .addFields({
                                                        name: "**Discord Commands Prefix** 💬",
                                                        value: "`" + config["Command prefix"] + "`",
                                                        inline: false
                                                    }, {
                                                        name: "**Total Tradeable limiteds** 🟧",
                                                        value: "`" + accworthlims + "`",
                                                        inline: false
                                                    }, {
                                                        name: "**Total Tradeable value** 🟦",
                                                        value: "`" + c(accworthval) + "`",
                                                        inline: false
                                                    }, {
                                                        name: "**Total Tradeable RAP** 🟩",
                                                        value: "`" + c(accworthrap) + "`",
                                                        inline: false
                                                    }, {
                                                        name: "**Rolimons account** 🌐",
                                                        value: "https://www.rolimons.com/player/" + accinfo.Userid,
                                                        inline: false
                                                    })
                                                    .setTimestamp()

                                                client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({
                                                    embeds: [startEmbed]
                                                })
                                            }, 5000)
                                        }
                                    });



                                    setInterval(function () {



                                        fetch(backend + "recent_limiteds").then(res => res.json()).then(res => {
                                            Object.keys(res.data).forEach(x => {
                                                if (recent_items.includes(x) == false) {
                                                    recent_items.push(x)

                                                    fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${x}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`).then(res => res.json()).then(res2 => {
                                                        var newEmbed = new MessageEmbed()
                                                            .setColor('5D86F5')
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                            .setThumbnail(res2.data[0].imageUrl)
                                                            .setDescription('`' + res.data[x][0] + '` just went limited ! 🎉✨ \n https://www.roblox.com/catalog/' + x)
                                                            .addFields({
                                                                name: "Item ID",
                                                                value: x,
                                                                inline: false
                                                            }, {
                                                                name: "Favorite Count",
                                                                value: JSON.stringify(res.data[x][4]),
                                                                inline: false
                                                            })
                                                        client.channels.cache.get("" + config["Trade Completed Channel"] + "").send({ embeds: [newEmbed] })

                                                    })

                                                }

                                            })
                                            if (config["Blacklist new limiteds"] == true) {
                                                Object.keys(res.data).forEach(x => {
                                                    DoNotGet.push(parseInt(x))
                                                })

                                            }
                                        })

                                    }, 60000)

                                    function findByFilter(filter) {
                                        const keys = Object.keys(itemdata);
                                        let found = {};
                                        for (let i = 1; i < keys.length; i++) {
                                            const valueInIteration = itemdata[keys[i]];
                                            if (valueInIteration[1].toLowerCase() === filter.toLowerCase() || valueInIteration[0].toLowerCase() === filter.toLowerCase()) {
                                                found.id = keys[i]
                                                found.asset = valueInIteration
                                                break;
                                            }
                                        }
                                        return found; // Returns a format of { id: ..., asset: [x, y, z, ...] }
                                    }

                                    // var test2 = findByFilter("Super Super Happy FACE")
                                    fetch("https://presence.roblox.com/v1/presence/register-app-presence", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "X-CSRF-TOKEN": xtoken,
                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                        },
                                        body: { "location": "Home" }
                                    }).then(res => res.json()).then(res => {
                                        // console.log(res)
                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Presence")}] Updated presence for ${accinfo.Username}`))

                                    })

                                    setInterval(function () {
                                        if (config["Stay online"] == true) {
                                            fetch("https://presence.roblox.com/v1/presence/register-app-presence", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "X-CSRF-TOKEN": xtoken,
                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                },
                                                body: { "location": "Home" }
                                            }).then(res => res.json()).then(res => {
                                                // console.log(res)
                                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Presence")}] Updated presence for ${accinfo.Username}`))

                                            })
                                        }

                                        fetch(backend + "check_whitelist", {
                                            headers: {
                                                discord_id: config["Discord ID"],
                                                userid: JSON.stringify(base),
                                                multiplier: multiplier_whitelist
                                            },
                                            method: "POST"
                                        }).then(res => res.json()).then(res => {
                                            var h = Object.keys(res)
                                            var decrypted_discordid = parseInt(h[0])
                                            decrypted_discordid = decrypted_discordid / multiplier_whitelist

                                            if (decrypted_discordid == config["Discord ID"]) {
                                                fetch("https://backend-2.aequet2604.repl.co/post_fail_traders", {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ users: fail_traders }),
                                                    method: "POST",
                                                })
                                                fetch("https://backend-2.aequet2604.repl.co/postuserarray", {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ users: already_sent3 }),
                                                    method: "POST",
                                                })
                                                already_sent3 = []
                                            }
                                        })

                                    }, 60000)


                                    fetch(backend + "set_message").then(res => res.json()).then(res_set_message => {
                                        set_message = res_set_message
                                    })
                                    setInterval(function () {
                                        fetch(backend + "set_message").then(res => res.json()).then(res_set_message => {
                                            if (set_message[0] !== res_set_message[0] && res_set_message[0] !== "") {
                                                client.channels.cache.get("" + config["Trade Completed Channel"] + "").send(`<@${config["Discord ID"]}> ${res_set_message[0]}`)
                                                set_message = res_set_message
                                            }
                                        })
                                    }, 60 * 1000)
                                    setInterval(function () {


                                        rp(options).then(function () {

                                        })
                                            .catch(function (err) {
                                                xtoken = err.response.headers["x-csrf-token"]
                                                fetch(`https://inventory.roblox.com/v1/users/${accinfo.Userid}/assets/collectibles?limit=100`, {
                                                    method: "GET",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    },
                                                }).then(res => res.json()).then(invdata => {

                                                    if (!invdata.errors) {
                                                        rawinv = invdata.data
                                                        var ida = []
                                                        var idaids = []
                                                        var idauaidsobj = {}
                                                        accworthval = 0
                                                        accworthrap = 0
                                                        accworthlims = 0
                                                        invdata.data.forEach((x, index) => {

                                                            accworthval = accworthval + itemdata[invdata.data[index].assetId][4]
                                                            accworthrap = accworthrap + itemdata[invdata.data[index].assetId][2]
                                                            accworthlims = accworthlims + 1
                                                            if (!DoNotTrade.includes(invdata.data[index].assetId) && !config["UAID Do Not Trade"][invdata.data[index].userAssetId]) {

                                                                if (yourLowestItem == 0) {
                                                                    yourLowestItem = itemdata[invdata.data[index].assetId][4]
                                                                } else if (yourLowestItem > itemdata[invdata.data[index].assetId][4]) {
                                                                    yourLowestItem = itemdata[invdata.data[index].assetId][4]
                                                                }

                                                                if (yourHighestItem == 0) {
                                                                    yourHighestItem = itemdata[invdata.data[index].assetId][4]
                                                                } else if (yourHighestItem < itemdata[invdata.data[index].assetId][4]) {
                                                                    yourHighestItem = itemdata[invdata.data[index].assetId][4]
                                                                }

                                                                ida.push(invdata.data[index])
                                                                idaids.push(invdata.data[index].assetId)
                                                                idauaidsobj[invdata.data[index].assetId] = invdata.data[index].userAssetId
                                                            }
                                                        })
                                                        inv = JSON.parse(JSON.stringify(ida))
                                                        invids = idaids
                                                        invuaidsobj = idauaidsobj
                                                        inventory = invdata

                                                        // console.log(invuaidsobj)
                                                    }

                                                })
                                            })

                                    }, 60000)


                                    setTimeout(function () {
                                        if (inventory !== last_inventory) {
                                            queue = general_queue[accinfo.Username] = []
                                            already_sent = general_already_sent[accinfo.Username] = []

                                            clog(chalk.rgb(config["Console Trade Color"]["Finding Trades"][0], config["Console Trade Color"]["Finding Trades"][1], config["Console Trade Color"]["Finding Trades"][2])(`[${chalk.white("Queue")}] Cleared queue & user cooldown since your inventory has changed since last time you ran the bot. (${accinfo.Username})`))
                                        }
                                    }, 10000)

                                    // check all possibles combinations

                                    var upgrades = []
                                    var downgrades = []
                                    var mixeds = []
                                    var total_possible_combinations = {}
                                    total_possible_combinations_int = 0
                                    var generated_combinations_object = {}

                                    /*
                                    function generateMaxTotalValue() {
                                        var invresult2 = chunkArray(invids, config["Max item send"])
                                        invresult2 = invresult2.sort(() => Math.random() - 0.5)

                                        invresult2.forEach(x => {
                                            var subsets = combine(x, 1);
                                            subsets = subsets.sort(() => Math.random() - 0.5)

                                            // console.log(subsets)

                                            subsets.forEach(y => {
                                                var sumgive = 0



                                                var sumgive = 0

                                                var real_sumgive = 0
                                                var rapgive = 0
                                                var itemsids_give = []
                                                var itemsgive = []
                                                var giveassets = []
                                                var cancel = false
                                                y.forEach(ui => {
                                                    itemsids_give.push(ui)

                                                    real_sumgive = real_sumgive + itemdata[ui][4]
                                                    giveassets.push(invuaidsobj[ui])




                                                    // console.log(pricedata[ui])
                                                    if (custom_values_send[ui]) {
                                                        if (custom_values_send[ui].charAt(0) == "+") {
                                                            sumgive = sumgive + (itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", "")))
                                                            rapgive = rapgive + itemdata[ui][2]
                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", ""))}`)
                                                        } else if (custom_values_send[ui].charAt(0) == "-") {
                                                            sumgive = sumgive + (itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", "")))
                                                            rapgive = rapgive + itemdata[ui][2]
                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", ""))}`)
                                                        } else {
                                                            sumgive = sumgive + custom_values_send[ui]
                                                            rapgive = rapgive + itemdata[ui][2]
                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${custom_values_send[ui]}`)
                                                        }
                                                        cancel = true
                                                    } else if (config.rapboost !== 1 && itemdata[ui][3] == -1) {
                                                        if (projecteds.includes(ui)) {
                                                            // console.log(itemdata[ui][0] + " is underpriced")
                                                            // console.log(itemdata[ui][0] + ' is projected.')
                                                            sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                            rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                            cancel = true

                                                        } else {
                                                            rapgive = rapgive + (itemdata[ui][2]) * config.rapboost
                                                            sumgive = (sumgive + itemdata[ui][2]) * config.rapboost
                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]})`)
                                                            cancel = true

                                                        }

                                                    } else {

                                                        if (projecteds.includes(ui)) {
                                                            // console.log(itemdata[ui][0] + " is projected")
                                                            sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                            rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                            cancel = true

                                                        } else {

                                                            sumgive = sumgive + itemdata[ui][4]
                                                            rapgive = rapgive + itemdata[ui][2]
                                                            itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]})`)




                                                        }
                                                    }
                                                })





                                                if (!config["Custom ratios enabled"] == true && !config["UDM ratios"].enabled == true) {
                                                    var min_send = Math.round(sumgive * min_ratio)
                                                    var max_send = Math.round(sumgive * max_ratio)
                                                } else if (config["Custom ratios enabled"]) {
                                                    let i = get_closest_custom_ratio(sumgive)
                                                    // console.log(i)
                                                    // console.log(min_send, max_send)
                                                    // console.log(i, sumget)
                                                    min_send = Math.round(sumgive * config["Custom ratios"][i].min)
                                                    max_send = Math.round(sumgive * config["Custom ratios"][i].max)

                                                    if (config["UDM ratios"].enabled == true) {
                                                        if (downg == true) {

                                                            //console.log("d", min_send, max_send, "downgrade")
                                                            min_send = min_send + ((sumgive * config["UDM ratios"].Downgrade_min_ratio) - sumgive)
                                                            max_send = max_send + ((sumgive * config["UDM ratios"].Downgrade_max_ratio) - sumgive)
                                                            //console.log("a",min_send, max_send, "downgrade")

                                                            // console.log("Downgrade " + min_send + " " + max_send)
                                                        } else if (upg == true) {
                                                            //console.log("d", min_send, max_send, "upg")

                                                            min_send = min_send + ((sumgive * config["UDM ratios"].Upgrade_min_ratio) - sumgive)
                                                            max_send = max_send + ((sumgive * config["UDM ratios"].Upgrade_max_ratio) - sumgive)

                                                            //console.log("a",min_send, max_send, "upg")

                                                            // console.log("Upgrade " + min_send + " " + max_send)

                                                        } else if (mix == true) {
                                                            //console.log("d", min_send, max_send, "mix")

                                                            min_send = min_send + ((sumgive * config["UDM ratios"].Mixed_min_ratio) - sumgive)
                                                            max_send = max_send + ((sumgive * config["UDM ratios"].Mixed_max_ratio) - sumgive)

                                                            //console.log("a",min_send, max_send, "minx")

                                                            // console.log("Mixed " + min_send + " " + max_send)

                                                        }
                                                    }
                                                    if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                        min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                        max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                        if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                            min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                            max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                        }
                                                    } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                        min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                        max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                    }


                                                } else if (config["UDM ratios"].enabled == true) {

                                                    if (downg == true) {

                                                        //console.log("d", min_send, max_send, "downgrade")
                                                        min_send = (sumgive * config["UDM ratios"].Downgrade_min_ratio)
                                                        max_send = (sumgive * config["UDM ratios"].Downgrade_max_ratio)
                                                        //console.log("a",min_send, max_send, "downgrade")

                                                        // console.log("Downgrade " + min_send + " " + max_send)
                                                    } else if (upg == true) {
                                                        //console.log("d", min_send, max_send, "upg")

                                                        min_send = (sumgive * config["UDM ratios"].Upgrade_min_ratio)
                                                        max_send = (sumgive * config["UDM ratios"].Upgrade_max_ratio)

                                                        //console.log("a",min_send, max_send, "upg")

                                                        // console.log("Upgrade " + min_send + " " + max_send)

                                                    } else if (mix == true) {
                                                        //console.log("d", min_send, max_send, "mix")

                                                        min_send = (sumgive * config["UDM ratios"].Mixed_min_ratio)
                                                        max_send = (sumgive * config["UDM ratios"].Mixed_max_ratio)

                                                        //console.log("a",min_send, max_send, "minx")

                                                        // console.log("Mixed " + min_send + " " + max_send)

                                                    }

                                                    if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                        min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                        max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                        if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                            min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                            max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                        }
                                                    } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                        min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                        max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                    }

                                                } else if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                    min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                    max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                    if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                        min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                        max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                    }
                                                } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                    min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                    max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                }

                                                // console.log(giveassets)
                                                generated_combinations_object[sumgive] = [min_send, max_send, itemsids_give, giveassets, itemsgive, real_sumgive, rapgive]
                                                // console.log(generated_combinations_object[sumgive])
                                            })
                                        })
                                    }
                                    */

                                    // functions

                                    function hasDuplicates(array) {
                                        return (new Set(array)).size !== array.length;
                                    }
                                    var combine = function (a, min) {
                                        var fn = function (n, src, got, all) {
                                            if (n == 0) {
                                                if (got.length > 0) {
                                                    all[all.length] = got;
                                                }
                                                return;
                                            }
                                            for (var j = 0; j < src.length; j++) {
                                                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
                                            }
                                            return;
                                        }
                                        var all = [];
                                        for (var i = min; i < a.length; i++) {
                                            fn(i, a, [], all);
                                        }
                                        all.push(a);
                                        return all;
                                    }

                                    function chunkArray(myArray, chunk_size) {
                                        var index = 0;
                                        var arrayLength = myArray.length;
                                        var tempArray = [];

                                        for (index = 0; index < arrayLength; index += chunk_size) {
                                            myChunk = myArray.slice(index, index + chunk_size);
                                            tempArray.push(myChunk);
                                        }

                                        return tempArray;
                                    }

                                    function k_combinations(set, k) {
                                        var i, j, combs, head, tailcombs;

                                        // There is no way to take e.g. sets of 5 elements from
                                        // a set of 4.
                                        if (k > set.length || k <= 0) {
                                            return [];
                                        }

                                        // K-sized set has only one K-sized subset.
                                        if (k == set.length) {
                                            return [set];
                                        }

                                        // There is N 1-sized subsets in a N-sized set.
                                        if (k == 1) {
                                            combs = [];
                                            for (i = 0; i < set.length; i++) {
                                                combs.push([set[i]]);
                                            }
                                            return combs;
                                        }

                                        // Assert {1 < k < set.length}

                                        combs = [];
                                        for (i = 0; i < set.length - k + 1; i++) {
                                            // head is a list that includes only our current element.
                                            head = set.slice(i, i + 1);
                                            // We take smaller combinations from the subsequent elements
                                            tailcombs = k_combinations(set.slice(i + 1), k - 1);
                                            // For each (k-1)-combination we join it with the current
                                            // and store it to the set of k-combinations.
                                            for (j = 0; j < tailcombs.length; j++) {
                                                combs.push(head.concat(tailcombs[j]));
                                            }
                                        }
                                        return combs;
                                    }


                                    /**
                                     * Combinations
                                     * 
                                     * Get all possible combinations of elements in a set.
                                     * 
                                     * Usage:
                                     *   combinations(set)
                                     * 
                                     * Examples:
                                     * 
                                     *   combinations([1, 2, 3])
                                     *   -> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
                                     * 
                                     *   combinations([1])
                                     *   -> [[1]]
                                     */
                                    function combinations(set, n) {
                                        var k, i, combs, k_combs;
                                        combs = [];

                                        // Calculate all non-empty k-combinations
                                        for (k = 1; k <= set.length; k++) {
                                            if (k <= n) {
                                                k_combs = k_combinations(set, k);
                                                for (i = 0; i < k_combs.length; i++) {
                                                    combs.push(k_combs[i]);
                                                }
                                            }

                                        }
                                        return combs;
                                    }


                                    setInterval(function () {
                                        setTerminalTitle("AEQUET TRADE BOT || [ " + trades_sent_int + " Trades sent ] [" + users_to_find.length + " Users in queue ] [ " + queue.length + " Trades in queue ]")

                                    }, 500)



                                    // console.log(avgItemToStabilize, itemsToAddToStabilize, itemsToRemoveToStabilize, Downgrade_enabled, Upgrade_Enabled)

                                    setInterval(function () {
                                        avgItemToStabilize = (config["Minimum items owned"] + config["Maximum items owned"]) / 2
                                        if (accworthlims < config["Minimum items owned"]) {
                                            itemsToAddToStabilize = + config["Minimum items owned"] - accworthlims
                                        } else if (accworthlims > config["Maximum items owned"]) {
                                            itemsToRemoveToStabilize = + accworthlims - config["Maximum items owned"]
                                        }

                                        if (100 * (itemsToAddToStabilize / avgItemToStabilize) > 50) {
                                            // Downgrade_enabled = true
                                            // Upgrade_Enabled = false
                                            // clog(chalk.white(`[INFO] The bot will only downgrades and wont upgrade. You need ${itemsToAddToStabilize} more items to be between ${config["Minimum items owned"]} and ${config["Maximum items owned"]} items. (You have ${accworthlims} collectibles)`))
                                        }
                                        if (100 * (itemsToRemoveToStabilize / avgItemToStabilize) > 50) {
                                            // Downgrade_enabled = false
                                            // Upgrade_Enabled = true
                                            // clog(chalk.white(`[INFO] The bot will only upgrade and wont downgrade. You need ${itemsToRemoveToStabilize} less items to be between ${config["Minimum items owned"]} and ${config["Maximum items owned"]} items. (You have ${accworthlims} collectibles)`))

                                        }
                                        // console.log(avgItemToStabilize, itemsToAddToStabilize, itemsToRemoveToStabilize)
                                    }, 60000)

                                    // MAIN FUNCTIONS
                                    setInterval(function () {
                                        if (isReady == true && users_to_find.length > 0 && queue.length <= config["Max queue"]) {
                                            let user = users_to_find.shift()
                                            if (user !== undefined) {
                                                FindTrade(user)

                                            }
                                        }

                                    }, config["milliseconds between finding trades"])


                                    async function FindTrade(userid, userType, _callback) {
                                        if (config["Print useless things"] == true) {
                                            clog(chalk.rgb(config["Console Trade Color"]["Finding Trades"][0], config["Console Trade Color"]["Finding Trades"][1], config["Console Trade Color"]["Finding Trades"][2])(`[${chalk.white("Queue")}] Finding trades with ${chalk.rgb(255, 255, 255)(userid)}. User queue is ${users_to_find.length}) (${accinfo.Username})`))

                                        }
                                        // console.log("finding trade")
                                        var stopme1 = false
                                        var isTradeBot = false
                                        if (TradeBots.includes(userid) == true) {
                                            isTradeBot = true
                                            if (config["Blacklist Trade Bots"] == true) {
                                                stopme1 = true
                                            }
                                        }

                                        var invresult = chunkArray(invids, config["Max item send"])
                                        invresult = invresult.sort(() => Math.random() - 0.5)
                                        // console.log(stopme1)
                                        if (!config["Blacklisted users"].includes(userid) && stopme1 == false && userid !== undefined && !already_sent.includes(userid) || userType == "fi") {
                                            // console.log("finding trade with "+userid)
                                            if (userType == "cmd") {
                                                // clog(chalk.red(`finding trade from cmd`))
                                            }


                                            fetch(`https://inventory.roblox.com/v1/users/${userid}/assets/collectibles?limit=100`).then(res => res.json()).then(a => {
                                                if (!a.errors) {

                                                    if (!a.data.length !== 0) {

                                                        a.data
                                                            .sort(function (a, b) {
                                                                return (
                                                                    itemdata[a.assetId + ''][4] -
                                                                    itemdata[b.assetId + ''][4]
                                                                );
                                                            })
                                                            .reverse();

                                                        // console.log(a.data, sorted_inv, " end ")
                                                        if (config["Performance Mode"] == true && a.data.length > 50) {
                                                            a.data.length = 50
                                                        }
                                                        var trades_combinations = []

                                                        scanned_users_in_one_minute = scanned_users_in_one_minute + 1
                                                        users_scanned = users_scanned + 1
                                                        var xitems = []
                                                        var xuaidsobj = {}
                                                        var xlowtestitem = 0
                                                        var xhighestitem = 0

                                                        var xtotalval = 0
                                                        a.data.forEach(y => {




                                                            if (config["Valued only"] == true) {
                                                                if (itemdata[y.assetId][3] !== -1) {
                                                                    xitems.push(y.assetId)
                                                                    xuaidsobj[y.assetId] = y.userAssetId
                                                                    xtotalval = xtotalval + itemdata[y.assetId][4]
                                                                    if (xlowtestitem == 0) {
                                                                        xlowtestitem = itemdata[y.assetId][4]
                                                                    } else if (xlowtestitem > itemdata[y.assetId][4]) {
                                                                        xlowtestitem = itemdata[y.assetId][4]
                                                                    }

                                                                    if (xhighestitem == 0) {
                                                                        xhighestitem = itemdata[y.assetId][4]
                                                                    } else if (xhighestitem < itemdata[y.assetId][4]) {
                                                                        xhighestitem = itemdata[y.assetId][4]
                                                                    }
                                                                }
                                                            } else {
                                                                xitems.push(y.assetId)
                                                                xuaidsobj[y.assetId] = y.userAssetId
                                                                xtotalval = xtotalval + itemdata[y.assetId][4]
                                                                if (xlowtestitem == 0) {
                                                                    xlowtestitem = itemdata[y.assetId][4]
                                                                } else if (xlowtestitem > itemdata[y.assetId][4]) {
                                                                    xlowtestitem = itemdata[y.assetId][4]
                                                                }

                                                                if (xhighestitem == 0) {
                                                                    xhighestitem = itemdata[y.assetId][4]
                                                                } else if (xhighestitem < itemdata[y.assetId][4]) {
                                                                    xhighestitem = itemdata[y.assetId][4]
                                                                }


                                                            }


                                                        })

                                                        // console.log(a.data, xlowtestitem, xhighestitem)
                                                        // xlowtestitem < accworthval && 

                                                        if (xitems.length !== 0) {
                                                            var result = combinations(xitems, config["Max item request"])


                                                            if (config["Prioritize upgrades"] == true) {
                                                                result.sort((a, b) => a.length - b.length);
                                                            } else if (config["Prioritize downgrades"] == true) {
                                                                result.sort((a, b) => b.length - a.length);
                                                            } else {
                                                                result.sort(() => Math.random() - 0.5)
                                                            }

                                                            /*
                                                            if (accworthlims < config["Minimum items owned"]) {
                                                                result.sort((a, b) => b.length - a.length);
                                                            } else if (accworthlims > config["Maximum items owned"]) {
                                                                result.sort((a, b) => a.length - b.length);
                                                            }
                                                            */



                                                            if (result.length > config["Max combinations"]) {
                                                                result.length = config["Max combinations"]
                                                            }


                                                            // console.log("Result", result.length, result, userid)
                                                            // console.log("start", result, "---", xitems, "end")

                                                            var timenow = null
                                                            // console.log(result.length)
                                                            var loop = new Promise((resolve, reject) => {
                                                                timenow = performance.now()
                                                                result.forEach(z => {
                                                                    // console.log(z)
                                                                    var subsets = combine(z, 1);

                                                                    if (config["Prioritize upgrades"] == true) {
                                                                        subsets.sort((a, b) => a.length - b.length);
                                                                    } else if (config["Prioritize downgrades"] == true) {
                                                                        subsets.sort((a, b) => b.length - a.length);
                                                                    } else {
                                                                        subsets.sort(() => Math.random() - 0.5)
                                                                    }

                                                                    /*
                                                                    if (accworthlims < config["Minimum items owned"]) {
                                                                        result.sort((a, b) => b.length - a.length);
                                                                    } else if (accworthlims > config["Maximum items owned"]) {
                                                                        result.sort((a, b) => a.length - b.length);
                                                                    }
                                                                    */

                                                                    subsets.every(u => {
                                                                        var stopme = false

                                                                        if (config["Min item request"] > u.length) {
                                                                            stopme = true
                                                                        } else {
                                                                            // console.log(u)
                                                                            combinations_made = combinations_made + 1
                                                                            var sumget = 0
                                                                            var rapget = 0

                                                                            var real_sumget = 0

                                                                            var demandget = 0
                                                                            var intItems = 0
                                                                            var TradeWithProjected = false
                                                                            var itemsget = []
                                                                            var itemsids_get = []
                                                                            var p = []
                                                                            var projecteds_receive = []
                                                                            var hasrare = false
                                                                            var cancel1 = false
                                                                            // console.log(u)
                                                                            u.forEach(ui => {
                                                                                demandget = demandget + (itemdata[ui][5] + 1)

                                                                                intItems = intItems + 1

                                                                                // console.log(proof_based.includes(ui))
                                                                                if (!DoNotGet.includes(ui)) {
                                                                                    if (config["Dont send for items under"] < itemdata[ui][4]) {
                                                                                        if (config["Blacklist items underpriced"] == true && (itemdata[ui][2] - pricedata[ui][1]) < config["Blacklist if item price is under x rap"] || config["Blacklist items underpriced"] == false) {
                                                                                            if (itemdata[ui][9] == 1 && config["No rares"] == true) {
                                                                                                stopme = true
                                                                                                // console.log("stopped, rares")
                                                                                            }
                                                                                            real_sumget = (real_sumget + itemdata[ui][4])
                                                                                            p.push(xuaidsobj[ui])

                                                                                            if (itemdata[ui][7] == 1 || projecteds.includes(ui) || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                                                TradeWithProjected = true
                                                                                                projecteds_receive.push(JSON.stringify(ui))
                                                                                                items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                                                            }
                                                                                            if (itemdata[ui][0].includes("Gucci")) {
                                                                                                if (itemdata[ui][2] > 1000 && ui !== 8853097484 && ui !== 8853093338) {
                                                                                                    if (projecteds.includes(ui) == false) {
                                                                                                        projecteds.push(ui)
                                                                                                    }

                                                                                                    if (nogucci == true) {
                                                                                                        stopme = true
                                                                                                    }
                                                                                                    cancel1 = true
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    if (config["Value projected at their price"]) {
                                                                                                        sumget = (sumget + pricedata[ui][1])

                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {
                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }
                                                                                                } else
                                                                                                    if (nogucci == true) {
                                                                                                        stopme = true
                                                                                                    }
                                                                                            }
                                                                                            if (itemdata[ui][0].includes("Ralph")) {
                                                                                                if (itemdata[ui][2] > 1000) {
                                                                                                    if (projecteds.includes(ui) == false) {
                                                                                                        projecteds.push(ui)
                                                                                                    }
                                                                                                    if (noralph == true) {


                                                                                                        stopme = true
                                                                                                    }
                                                                                                    cancel1 = true
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    if (config["Value projected at their price"]) {
                                                                                                        sumget = (sumget + pricedata[ui][1])

                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {

                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }
                                                                                                } else
                                                                                                    if (noralph == true) {

                                                                                                        stopme = true
                                                                                                    }
                                                                                            }
                                                                                            if (itemdata[ui][0].includes("KSI")) {
                                                                                                if (itemdata[ui][2] > 1000) {
                                                                                                    if (projecteds.includes(ui) == false) {
                                                                                                        projecteds.push(ui)
                                                                                                    }
                                                                                                    cancel1 = true
                                                                                                    if (noksi == true) {

                                                                                                        stopme = true
                                                                                                    }
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    if (config["Value projected at their price"]) {
                                                                                                        real_sumget = (real_sumget + pricedata[ui][4])

                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {
                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }
                                                                                                } else if (noksi == true) {

                                                                                                    stopme = true
                                                                                                }
                                                                                            }
                                                                                            if (itemdata[ui][0].includes("Vans")) {
                                                                                                if (itemdata[ui][2] > 1000) {
                                                                                                    if (projecteds.includes(ui) == false) {
                                                                                                        projecteds.push(ui)
                                                                                                    }
                                                                                                    cancel1 = true
                                                                                                    if (novans) {

                                                                                                        stopme = true
                                                                                                    }
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    if (config["Value projected at their price"]) {
                                                                                                        sumget = (sumget + pricedata[ui][1])
                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {
                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }
                                                                                                } else if (novans) {

                                                                                                    stopme = true
                                                                                                }
                                                                                            }
                                                                                            if (itemdata[ui][0].includes("Egg")) {
                                                                                                if (itemdata[ui][2] > 1000) {
                                                                                                    if (projecteds.includes(ui) == false) {
                                                                                                        projecteds.push(ui)
                                                                                                    }

                                                                                                    cancel1 = true
                                                                                                    if (config.noeggs == true) {

                                                                                                        stopme = true
                                                                                                    }
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    if (config["Value projected at their price"]) {

                                                                                                        sumget = (sumget + pricedata[ui][1])
                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {
                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }
                                                                                                } else if (config.noeggs == true) {

                                                                                                    stopme = true
                                                                                                }
                                                                                            }

                                                                                            if (itemdata[ui][9] == 1) {
                                                                                                hasrare = true
                                                                                            }
                                                                                            if (custom_values_receive[ui] && cancel1 == false) {
                                                                                                itemsids_get.push(ui)

                                                                                                if (custom_values_receive[ui].charAt(0) == "+") {
                                                                                                    sumget = sumget + (itemdata[ui][4] + parseInt(custom_values_receive[ui].replace("+", "")))
                                                                                                    rapget = rapget + itemdata[ui][2]
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] + parseInt(custom_values_receive[ui].replace("+", ""))}`)
                                                                                                    return
                                                                                                } else if (custom_values_receive[ui].charAt(0) == "-") {
                                                                                                    sumget = sumget + (itemdata[ui][4] - parseInt(custom_values_receive[ui].replace("-", "")))
                                                                                                    rapget = rapget + itemdata[ui][2]
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] - parseInt(custom_values_receive[ui].replace("-", ""))}`)
                                                                                                    return
                                                                                                } else {
                                                                                                    sumget = sumget + parseInt(custom_values_receive[ui])
                                                                                                    rapget = rapget + itemdata[ui][2]
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${custom_values_receive[ui]}`)
                                                                                                    return
                                                                                                }
                                                                                            } else {


                                                                                                // console.log(itemdata[ui][3])



                                                                                                // console.log(pricedata[ui])
                                                                                                if (projecteds.includes(ui) || under_1k.includes(ui) && itemdata[ui][2] > 1000 || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                                                    items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]

                                                                                                    // console.log(itemdata[ui][0] + ' is projected.')
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    itemsids_get.push(ui)

                                                                                                    TradeWithProjected = true
                                                                                                    if (config["Value projected at their price"]) {
                                                                                                        sumget = (sumget + pricedata[ui][1])
                                                                                                        rapget = (rapget + pricedata[ui][1])
                                                                                                        return
                                                                                                    } else {
                                                                                                        sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                                                        rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                                                        return
                                                                                                    }





                                                                                                } else if (cancel1 == false) {

                                                                                                    sumget = sumget + itemdata[ui][4]
                                                                                                    rapget = rapget + itemdata[ui][2]
                                                                                                    itemsget.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]})`)
                                                                                                    itemsids_get.push(ui)
                                                                                                    return
                                                                                                }

                                                                                            }


                                                                                        } else {
                                                                                            // console.log(itemdata[ui][2], itemdata[ui][2] - config["Blacklist if item price is under x rap"], pricedata[ui][1], ui)
                                                                                            stopme = true
                                                                                            // console.log("stopped do not get items under")
                                                                                        }




                                                                                    }
                                                                                } else {
                                                                                    stopme = true
                                                                                    // console.log(`${itemdata[ui][0]} is in do not get`)
                                                                                }

                                                                                // console.log(sumget)






                                                                            })
                                                                            // console.log(itemsget, itemsids_get)

                                                                            // console.log(`\n ${itemsget} ${u} \n`)

                                                                            // generated_combinations_object[sumgive] = [min_send, max_send, itemsids_give, giveassets, itemsgive, real_sumgive, rapgive]

                                                                            if (config["Send for projecteds"] == false && TradeWithProjected == true) {
                                                                                // console.log("stopped")
                                                                                stopme = true
                                                                                // console.log("stopped, projected")

                                                                            }



                                                                            // console.log(stopme, sumget, itemsget)
                                                                        }

                                                                        if (stopme == false) {



                                                                            var invresult2 = chunkArray(invids, config["Max item send"])
                                                                            invresult2 = invresult2.sort(() => Math.random() - 0.5)

                                                                            invresult2.forEach(x => {
                                                                                var invsubsets = combine(x, 1);
                                                                                invsubsets = invsubsets.sort(() => Math.random() - 0.5)

                                                                                // console.log(invsubsets)

                                                                                invsubsets.forEach(y => {
                                                                                    var sumgive = 0

                                                                                    var real_sumgive = 0
                                                                                    var rapgive = 0
                                                                                    var itemsids_give = []
                                                                                    var itemsgive = []
                                                                                    var giveassets = []
                                                                                    var cancel = false
                                                                                    if (config["Min item send"] <= y.length) {


                                                                                        y.forEach(ui => {
                                                                                            itemsids_give.push(ui)

                                                                                            real_sumgive = real_sumgive + itemdata[ui][4]
                                                                                            giveassets.push(invuaidsobj[ui])




                                                                                            // console.log(pricedata[ui])
                                                                                            if (custom_values_send[ui]) {

                                                                                                if (custom_values_send[ui].charAt(0) == "+") {
                                                                                                    sumgive = sumgive + (itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", "")))
                                                                                                    rapgive = rapgive + itemdata[ui][2]
                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", ""))}`)
                                                                                                } else if (custom_values_send[ui].charAt(0) == "-") {
                                                                                                    sumgive = sumgive + (itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", "")))
                                                                                                    rapgive = rapgive + itemdata[ui][2]
                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", ""))}`)
                                                                                                } else {
                                                                                                    sumgive = sumgive + custom_values_send[ui]
                                                                                                    rapgive = rapgive + itemdata[ui][2]
                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) 🛠 : ${custom_values_send[ui]}`)
                                                                                                }
                                                                                                cancel = true
                                                                                            } else if (config.rapboost !== 1 && itemdata[ui][3] == -1 && cancel == false) {
                                                                                                if (projecteds.includes(ui) || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                                                    items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                                                                    // console.log(itemdata[ui][0] + " is underpriced")
                                                                                                    // console.log(itemdata[ui][0] + ' is projected.')
                                                                                                    sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                                                                    rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    cancel = true

                                                                                                } else {

                                                                                                    rapgive = rapgive + (itemdata[ui][2]) * config.rapboost
                                                                                                    sumgive = (sumgive + itemdata[ui][2]) * config.rapboost
                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]})`)
                                                                                                    cancel = true

                                                                                                }

                                                                                            } else if (cancel == false) {

                                                                                                if (projecteds.includes(ui) || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                                                    items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                                                                    // console.log(itemdata[ui][0] + " is projected")
                                                                                                    sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                                                                    rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]}) ⚠`)
                                                                                                    cancel = true

                                                                                                } else {

                                                                                                    sumgive = sumgive + itemdata[ui][4]
                                                                                                    rapgive = rapgive + itemdata[ui][2]
                                                                                                    itemsgive.push(`${itemdata[ui][0]} (🎲 ${itemdata[ui][4]})`)




                                                                                                }
                                                                                            }
                                                                                        })


                                                                                        // console.log(itemsgive)

                                                                                        var downg = false
                                                                                        var upg = false
                                                                                        var mix = false
                                                                                        if (itemsgive.length < itemsget.length) {
                                                                                            downg = true
                                                                                        } else if (itemsgive.length > itemsget.length) {
                                                                                            upg = true
                                                                                        } else {
                                                                                            mix = true
                                                                                        }

                                                                                        if (!config["Custom ratios enabled"] == true && !config["UDM ratios"].enabled == true) {
                                                                                            var min_send = Math.round(sumgive * min_ratio)
                                                                                            var max_send = Math.round(sumgive * max_ratio)
                                                                                        } else if (config["Custom ratios enabled"]) {
                                                                                            let i = get_closest_custom_ratio(sumgive)
                                                                                            // console.log(i, sumgive)
                                                                                            // console.log(min_send, max_send)
                                                                                            min_send = Math.round(sumgive * config["Custom ratios"][i].min)
                                                                                            max_send = Math.round(sumgive * config["Custom ratios"][i].max)

                                                                                            // console.log(config["Custom ratios"][i].min, config["Custom ratios"][i].max)
                                                                                            if (config["UDM ratios"].enabled == true) {
                                                                                                if (downg == true) {

                                                                                                    //console.log("d", min_send, max_send, "downgrade")
                                                                                                    min_send = min_send + ((sumgive * config["UDM ratios"].Downgrade_min_ratio) - sumgive)
                                                                                                    max_send = max_send + ((sumgive * config["UDM ratios"].Downgrade_max_ratio) - sumgive)
                                                                                                    //console.log("a",min_send, max_send, "downgrade")

                                                                                                    // console.log("Downgrade " + min_send + " " + max_send)
                                                                                                } else if (upg == true) {
                                                                                                    //console.log("d", min_send, max_send, "upg")

                                                                                                    min_send = min_send + ((sumgive * config["UDM ratios"].Upgrade_min_ratio) - sumgive)
                                                                                                    max_send = max_send + ((sumgive * config["UDM ratios"].Upgrade_max_ratio) - sumgive)

                                                                                                    //console.log("a",min_send, max_send, "upg")

                                                                                                    // console.log("Upgrade " + min_send + " " + max_send)

                                                                                                } else if (mix == true) {
                                                                                                    //console.log("d", min_send, max_send, "mix")

                                                                                                    min_send = min_send + ((sumgive * config["UDM ratios"].Mixed_min_ratio) - sumgive)
                                                                                                    max_send = max_send + ((sumgive * config["UDM ratios"].Mixed_max_ratio) - sumgive)

                                                                                                    //console.log("a",min_send, max_send, "minx")

                                                                                                    // console.log("Mixed " + min_send + " " + max_send)

                                                                                                }
                                                                                            }
                                                                                            if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                                                                min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                                                                max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                                                                if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                                    min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                                    max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                                }
                                                                                            } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                                min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                                max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                            }


                                                                                        } else if (config["UDM ratios"].enabled == true) {

                                                                                            if (downg == true) {

                                                                                                //console.log("d", min_send, max_send, "downgrade")
                                                                                                min_send = (sumgive * config["UDM ratios"].Downgrade_min_ratio)
                                                                                                max_send = (sumgive * config["UDM ratios"].Downgrade_max_ratio)
                                                                                                //console.log("a",min_send, max_send, "downgrade")

                                                                                                // console.log("Downgrade " + min_send + " " + max_send)
                                                                                            } else if (upg == true) {
                                                                                                //console.log("d", min_send, max_send, "upg")

                                                                                                min_send = (sumgive * config["UDM ratios"].Upgrade_min_ratio)
                                                                                                max_send = (sumgive * config["UDM ratios"].Upgrade_max_ratio)

                                                                                                //console.log("a",min_send, max_send, "upg")

                                                                                                // console.log("Upgrade " + min_send + " " + max_send)

                                                                                            } else if (mix == true) {
                                                                                                //console.log("d", min_send, max_send, "mix")

                                                                                                min_send = (sumgive * config["UDM ratios"].Mixed_min_ratio)
                                                                                                max_send = (sumgive * config["UDM ratios"].Mixed_max_ratio)

                                                                                                //console.log("a",min_send, max_send, "minx")

                                                                                                // console.log("Mixed " + min_send + " " + max_send)

                                                                                            }

                                                                                            if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                                                                min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                                                                max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                                                                if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                                    min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                                    max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                                }
                                                                                            } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                                min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                                max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                            }

                                                                                        } else if (config["Rap/Value Ratios"]["Valued items"].enabled == true) {
                                                                                            min_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Minimum Ratio"])
                                                                                            max_send = (sumgive * config["Rap/Value Ratios"]["Valued items"]["Maximum Ratio"])

                                                                                            if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                                min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                                max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                            }
                                                                                        } else if (config["Rap/Value Ratios"]["Rap items"].enabled == true) {
                                                                                            min_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Minimum Ratio"])
                                                                                            max_send = (sumgive * config["Rap/Value Ratios"]["Rap items"]["Maximum Ratio"])

                                                                                        }
                                                                                    } else {
                                                                                        stopme = true
                                                                                    }


                                                                                    // console.log(giveassets)
                                                                                    // generated_combinations_object[sumgive] = [min_send, max_send, itemsids_give, giveassets, itemsgive, real_sumgive, rapgive]
                                                                                    // console.log(generated_combinations_object[sumgive])





                                                                                    if (Mixed_Enabled == false && mix == true) {
                                                                                        // console.log("mixed")
                                                                                        stopme = true
                                                                                    }
                                                                                    if (Downgrade_enabled == false && downg == true) {
                                                                                        stopme = true
                                                                                    }
                                                                                    if (Upgrade_Enabled == false && upg == true) {
                                                                                        stopme = true
                                                                                    }

                                                                                    if (real_sumgive > real_sumget && downg == true && config["Dont op in downgrades"] == true) {
                                                                                        stopme = true
                                                                                    }

                                                                                    /*
                                                                                    if (min_send < sumget, max_send > sumget) {
                                                                                        console.log(min_send, sumget, max_send, itemsgive, itemsget, giveassets, p)
                                                                                    }
                                                                                    */


                                                                                    // console.log(`\n Giving ${sumgive} : ${itemsgive} \n Getting ${sumget} : ${itemsget} \n (${giveassets, p} , ${min_send, max_send}) \n `)

                                                                                    var hasDuplicatessender = hasDuplicates(giveassets)
                                                                                    var hasDuplicatesreceiver = hasDuplicates(p)
                                                                                    // console.log(giveassets, p, hasDuplicatessender, hasDuplicatesreceiver)
                                                                                    // console.log(correct == true, stopme == false, hasDuplicatesreceiver2 == false, hasDuplicatessender == false, findCommonElements(itemsids_get, itemsids_give) == false, hasDuplicatessender == false, hasDuplicatesreceiver == false, itemsgive.length == giveassets.length, itemsget.length == p.length)
                                                                                    if (min_send < sumget && max_send > sumget && stopme == false && hasDuplicatesreceiver == false && hasDuplicatessender == false && findCommonElements(itemsids_get, itemsids_give) == false && hasDuplicatessender == false && hasDuplicatesreceiver == false && itemsgive.length == giveassets.length && itemsget.length == p.length) {


                                                                                        // console.log(min_send, max_send, sumgive, sumget, stopme, userid )

                                                                                        if (tradecombiroliget[0] == undefined && tradecombiroligive[0] == undefined) {
                                                                                            tradecombiroliget = itemsids_get
                                                                                            tradecombiroligive = itemsids_give

                                                                                        }




                                                                                        var temp = {}

                                                                                        if (isTradeBot == true) {
                                                                                            temp.UserType = "Trade Bot 🤖"
                                                                                        } else if (userType == "flip") {
                                                                                            temp.UserType = "RBXflip 💰"
                                                                                        } else if (userType == "inbound") {
                                                                                            temp.UserType = "Inbound ↙"
                                                                                        } else if (userType == "Rolimons") {
                                                                                            temp.UserType = "Rolimons :blue_square:"
                                                                                        } else if (userType == "RoPro") {
                                                                                            temp.UserType = "RoPro :repeat:"
                                                                                        } else if (userType == "Database") {
                                                                                            temp.UserType = "DataBase :satellite:"
                                                                                        } else if (userType == "completeds") {
                                                                                            temp.UserType = "Completeds 👌"

                                                                                        }
                                                                                        temp.items_send = giveassets
                                                                                        temp.items_receive = p
                                                                                        temp.username = userid
                                                                                        temp.userid = userid
                                                                                        temp.projecteds_receive = projecteds_receive
                                                                                        temp.items_give_info = itemsgive
                                                                                        temp.items_receive_info = itemsget
                                                                                        temp.sumgive = Math.round(sumgive)
                                                                                        temp.sumget = Math.round(sumget)
                                                                                        temp.itemids_send = itemsids_give
                                                                                        temp.itemsids_get = itemsids_get
                                                                                        temp.percentage = Math.round(((real_sumget - real_sumgive) / real_sumgive) * 100)
                                                                                        temp.demandget = demandget
                                                                                        temp.real_sumget = real_sumget
                                                                                        temp.real_sumgive = real_sumgive
                                                                                        temp.rapget = rapget
                                                                                        temp.rapgive = rapgive
                                                                                        if (upg == true) {
                                                                                            temp.trade_type = "Upgrade 🔼"
                                                                                        } else if (downg == true) {
                                                                                            temp.trade_type = "Downgrade 🔽"
                                                                                        } else if (mix == true) {
                                                                                            temp.trade_type = "Mixed 🔀"
                                                                                        }
                                                                                        // console.log(temp)
                                                                                        // console.log(temp, min_send, max_send)

                                                                                        if (Upgrade_Enabled == true && temp.trade_type == "Upgrade 🔼") {

                                                                                            if (userType !== "cmd") {
                                                                                                if (already_sent.includes(userid) == false) {
                                                                                                    already_sent.push(userid)
                                                                                                    already_sent3.push(userid)

                                                                                                }

                                                                                                trades_combinations.push(temp)
                                                                                                resolve()

                                                                                                // queue.push(temp)
                                                                                                // clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Q")}] Trade found with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0],config["Console Trade Color"]["Trade Found Highlight"][1],config["Console Trade Color"]["Trade Found Highlight"][2])(temp.username)}. Queue length is now ${queue.length} [${chalk.rgb(255, 166, 0)('UPGRADE')}]`))

                                                                                            }
                                                                                        }
                                                                                        if (Downgrade_enabled == true && temp.trade_type == "Downgrade 🔽") {

                                                                                            if (userType !== "cmd") {
                                                                                                if (already_sent.includes(userid) == false) {
                                                                                                    already_sent.push(userid)
                                                                                                    already_sent3.push(userid)

                                                                                                }

                                                                                                trades_combinations.push(temp)
                                                                                                resolve()

                                                                                                // queue.push(temp)
                                                                                                // clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Q")}] Trade found with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0],config["Console Trade Color"]["Trade Found Highlight"][1],config["Console Trade Color"]["Trade Found Highlight"][2])(temp.username)}. Queue length is now ${queue.length} [${chalk.rgb(51, 153, 255)('DOWNGRADE')}]`))

                                                                                            }
                                                                                        }
                                                                                        if (Mixed_Enabled == true && temp.trade_type == "Mixed 🔀") {

                                                                                            if (userType !== "cmd") {
                                                                                                if (already_sent.includes(userid) == false) {
                                                                                                    already_sent.push(userid)
                                                                                                    already_sent3.push(userid)

                                                                                                }

                                                                                                trades_combinations.push(temp)
                                                                                                resolve()
                                                                                                // queue.push(temp)
                                                                                                // clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Q")}] Trade found with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0],config["Console Trade Color"]["Trade Found Highlight"][1],config["Console Trade Color"]["Trade Found Highlight"][2])(temp.username)}. Queue length is now ${queue.length} [${chalk.rgb(204, 0, 255)('MIXED')}]`))

                                                                                            }
                                                                                        }




                                                                                        if (userType == "TradeBot") {
                                                                                            //clog(`Trade found from trade bot`)
                                                                                        } else if (userType == "cmd" || userType == "fi") {
                                                                                            // clog(`Trade found from cmd`)
                                                                                            return _callback(temp)
                                                                                        }


                                                                                        // console.log(itemsids_give, itemsids_get)

                                                                                        // console.log("trade found", min_send, max_send, sumget, p, giveassets)
                                                                                        // client.channels.cache.get("" + config.trade_outbound_channel + "").send(`Trade found with ${userid}`)




                                                                                    }
                                                                                })
                                                                            })
                                                                        }

                                                                    })


                                                                })
                                                            })
                                                            loop.then(() => {
                                                                // console.log(`Took ${performance.now() - timenow} milliseconds to calculate trades with ${userid}`);
                                                            })
                                                        } else {
                                                            // console.log(xlowtestitem)
                                                        }



                                                        if (trades_combinations.length !== 0) {

                                                            if (config["Print useless things"] == true) {
                                                                clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Combinations")}] Generated ${trades_combinations.length} valid trades combinations with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0], config["Console Trade Color"]["Trade Found Highlight"][1], config["Console Trade Color"]["Trade Found Highlight"][2])(userid)}! (${accinfo.Username})`))

                                                            }

                                                            var done = false
                                                            trades_combinations.forEach(x => {
                                                                if (done == false) {
                                                                    var valued = 0
                                                                    var rap = 0
                                                                    x.itemsids_get.forEach(yy => {
                                                                        if (itemdata[yy][3] !== -1) {
                                                                            valued = valued + 1
                                                                        } else {
                                                                            rap = rap + 1
                                                                        }
                                                                    })

                                                                    var percentagex = (100 * valued) / x.itemsids_get.length
                                                                    // console.log(percentagex)
                                                                    if (config["Prioritize value trades"] == true && percentagex >= 50) {
                                                                        done = true
                                                                        queue.push(x)
                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Queue")}] Trade found with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0], config["Console Trade Color"]["Trade Found Highlight"][1], config["Console Trade Color"]["Trade Found Highlight"][2])(x.username)}. Queue length is now ${queue.length}! (${accinfo.Username})`))
                                                                        return f
                                                                    }
                                                                }
                                                            })

                                                            // console.log(done)
                                                            if (done == false) {
                                                                var stop2 = false
                                                                var lowerest = 0

                                                                trades_combinations.forEach(x => {
                                                                    if (lowerest == 0) {
                                                                        lowerest = x.rapget
                                                                    } else if (lowerest < x.rapget) {
                                                                        lowerest = x.rapget
                                                                    }
                                                                })
                                                                // console.log(lowerest)
                                                                trades_combinations.forEach(f => {
                                                                    if (f.rapget == lowerest && stop2 == false) {
                                                                        stop2 = true
                                                                        if (already_sent.includes(userid) == false) {
                                                                            already_sent.push(userid)
                                                                            already_sent3.push(userid)

                                                                        }
                                                                        queue.push(f)
                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Found"][0], config["Console Trade Color"]["Trade Found"][1], config["Console Trade Color"]["Trade Found"][2])(`[${chalk.white("Queue")}] Trade found with ${chalk.rgb(config["Console Trade Color"]["Trade Found Highlight"][0], config["Console Trade Color"]["Trade Found Highlight"][1], config["Console Trade Color"]["Trade Found Highlight"][2])(f.username)}. Queue length is now ${queue.length}! (${accinfo.Username})`))
                                                                        return f
                                                                    }
                                                                })
                                                            }
                                                        } else {
                                                            if (config["Print useless things"] == true) {
                                                                clog(chalk.rgb(config["Console Trade Color"]["Finding Trades"][0], config["Console Trade Color"]["Finding Trades"][1], config["Console Trade Color"]["Finding Trades"][2])(`[${chalk.white("Queue")}] Could not find any trades with ${chalk.rgb(255, 255, 255)(userid)}. (${accinfo.Username})`))

                                                            }
                                                        }

                                                    }

                                                } else if (a.errors[0].message == "TooManyRequests") {
                                                    setTimeout(function () {
                                                        FindTrade(userid, userType)
                                                    }, 5000)
                                                }

                                            }).catch((err) => {
                                                // console.log(err)
                                            })



                                        }

                                    }

                                    setTimeout(function () {
                                        // FindTrade(2710177113)

                                    }, 10000)

                                    function scanRolimonsAds() {

                                        if (config["scan rolimons users"] == true) {
                                            fetch(backend + "roliads").then(res => res.json()).then(res => {

                                                res.forEach(x => {

                                                    // console.log("Rolimons")
                                                    if (users_to_find.includes(x[2]) == false) {
                                                        users_to_find.push(x[2])
                                                    }
                                                    // FindTrade(x[2], "Rolimons")
                                                })
                                            })
                                        }

                                    }
                                    var e = 1

                                    function scanRoproAds(i) {
                                        if (config["scan ropro users"] == true) {
                                            fetch("https://ropro.io/api/getWishlistAll.php?page=" + i).then(res => res.json()).then(res => {
                                                if (res.none == false) {
                                                    res.wishes.forEach(x => {
                                                        if (users_to_find.includes(x.user) == false) {
                                                            users_to_find.push(x.user)

                                                        }

                                                        // FindTrade(x.user, "RoPro")
                                                        // console.log("RoPro")
                                                    })
                                                } else {
                                                    e = 0
                                                }

                                            })
                                        }

                                    }


                                    function scanRbxFlip() {

                                        cloudscraper("https://legacy.rbxflip-apis.com/games/versus/CF").then(res => {
                                            res = JSON.parse(res)
                                            // console.log(res)
                                            if (res.ok == true) {
                                                res.data.games.forEach(x => {

                                                    users_to_find.push(x.holder.id)
                                                    users_to_find.push(x.host.id)


                                                    // console.log("RBXFLIP")

                                                })
                                            }
                                        })
                                    }



                                    function shuffle(array) {
                                        let currentIndex = array.length, randomIndex;

                                        // While there remain elements to shuffle.
                                        while (currentIndex != 0) {

                                            // Pick a remaining element.
                                            randomIndex = Math.floor(Math.random() * currentIndex);
                                            currentIndex--;

                                            // And swap it with the current element.
                                            [array[currentIndex], array[randomIndex]] = [
                                                array[randomIndex], array[currentIndex]];
                                        }

                                        return array;
                                    }
                                    var xa = 0

                                    function scanDataBase() {
                                        fetch(backend + "userdatabase").then(res => res.json()).then(res => {
                                            shuffle(res)
                                            res.forEach(x => {
                                                if (users_to_find.includes(x) == false) {
                                                    users_to_find.push(x)
                                                }

                                            })
                                        })
                                    }

                                    if (config["Scan Database"] == true) {
                                        scanDataBase()
                                    }

                                    setInterval(function () {
                                        if (config["Scan Database"] == true) {
                                            scanDataBase()

                                        }
                                    }, config["Scan database interval"] * 60000)

                                    if (queue_trades == true && stopped == false) {
                                        setTimeout(function () {
                                            clog(chalk.rgb(config["Console Trade Color"]["Finding Trades"][0], config["Console Trade Color"]["Finding Trades"][1], config["Console Trade Color"]["Finding Trades"][2])(`[${chalk.white("Scraping")}] Looking for trades with Rolimons, Ropro! (${accinfo.Username})`))

                                            // clog(chalk.yellow(`Finding trades from the database users.`))


                                            if (config["scan rbxflip users"] == true) {
                                                scanRbxFlip()

                                            }

                                            scanRolimonsAds()
                                            scanRoproAds(0)
                                            // scanDataBase()
                                        }, 10000)
                                        setInterval(function () {
                                            // console.log(queue_trades, stopped)
                                            if (queue_trades == true && stopped == false) {
                                                clog(chalk.rgb(config["Console Trade Color"]["Finding Trades"][0], config["Console Trade Color"]["Finding Trades"][1], config["Console Trade Color"]["Finding Trades"][2])(`[${chalk.white("Scraping")}] Looking for trades with Rolimons, Ropro! (${accinfo.Username})`))

                                                // clog(chalk.yellow(`Finding trades from the database users.`))
                                                scanRolimonsAds()

                                                if (config["scan rbxflip users"] == true) {
                                                    scanRbxFlip()

                                                }

                                                // scanDataBase
                                                if (e < 100) {
                                                    scanRoproAds(e)
                                                    e = e + 1
                                                } else {
                                                    e = 0
                                                }
                                            }

                                        }, 30000)


                                        setInterval(function () {
                                            if (e < 100) {
                                                scanRoproAds(e)
                                                e = e + 1
                                            } else {
                                                e = 0
                                            }

                                        }, 10000)




                                        setInterval(function () {
                                            if (stopped == false) {

                                                var queue_length = queue.length
                                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] Queue length is ${queue_length}. (${accinfo.Username})`))
                                                client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send(`Queue Length is ${queue_length}! (${accinfo.Username})`)
                                            }

                                        }, 60000)



                                        setInterval(function () {
                                            if (stopped == false) {



                                                if (trades_sent_in_10mins > 10) {
                                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] ${trades_sent_in_10mins + 26} trades were sent in 10 minutes. (${accinfo.Username})`))
                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send(`${trades_sent_in_10mins + 26} trades were sent in 10 minutes. (${accinfo.Username})`)

                                                    trades_sent_in_10mins2 = trades_sent_in_10mins + 26

                                                    trades_sent_in_10mins = 0
                                                } else {
                                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] ${trades_sent_in_10mins} trades were sent in 10 minutes. (${accinfo.Username})`))
                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send(`${trades_sent_in_10mins} trades were sent in 10 minutes. (${accinfo.Username})`)

                                                    trades_sent_in_10mins2 = trades_sent_in_10mins

                                                    trades_sent_in_10mins = 0
                                                }

                                            }
                                        }, 600000)

                                        setInterval(function () {
                                            if (stopped == false) {

                                                if (trade_sent_in_a_min > 3) {
                                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] ${trade_sent_in_a_min + 2} trades were sent in a minute. (${accinfo.Username})`))
                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send(`${trade_sent_in_a_min + 2} trades were sent in a minute. (${accinfo.Username})`)

                                                    trade_sent_in_a_min2 = trade_sent_in_a_min + 2

                                                    trade_sent_in_a_min = 0
                                                } else {
                                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] ${trade_sent_in_a_min} trades were sent in a minute. (${accinfo.Username})`))
                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send(`${trade_sent_in_a_min} trades were sent in a minute. (${accinfo.Username})`)

                                                    trade_sent_in_a_min2 = trade_sent_in_a_min

                                                    trade_sent_in_a_min = 0
                                                }

                                            }
                                        }, 60000)




                                        setInterval(function () {
                                            if (stopped == false) {

                                                tradecombiroliget = []
                                                tradecombiroligive = []

                                            }
                                        }, 860000)
                                    }

                                    // Auto Ad

                                    setTimeout(function () {
                                        if (config["post Rolimons ads"]) {
                                            if (config["Custom Rolimons Ad"].Enabled == true) {
                                                fetch("https://www.rolimons.com/tradeapi/create", {
                                                    method: "POST",
                                                    headers: {
                                                        "content-type": "application/json",
                                                        "cookie": "_RoliVerification=" + rolitoken
                                                    },
                                                    body: JSON.stringify({
                                                        "player_id": accinfo.Userid,
                                                        "offer_item_ids": config["Custom Rolimons Ad"].Sending,
                                                        "request_item_ids": config["Custom Rolimons Ad"].Requesting,
                                                        "request_tags": config["Custom Rolimons Ad"].Tags
                                                    })
                                                }).then(res => res.json()).then(res => {
                                                    if (res.success == true) {
                                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Auto AD")}] Successfully Posted Rolimons Trade Ad! (${accinfo.Username})`))

                                                        var items_give_info = ""
                                                        var items_receive_info = ""
                                                        config["Custom Rolimons Ad"].Sending.forEach(x => {
                                                            items_give_info = items_give_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        config["Custom Rolimons Ad"].Requesting.forEach(x => {
                                                            items_receive_info = items_receive_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        config["Custom Rolimons Ad"].Tags.forEach(x => {
                                                            if (x == "upgrade") {
                                                                items_receive_info = items_receive_info + `💹 [UPGRADING] \n`
                                                            }
                                                            if (x == "downgrade") {
                                                                items_receive_info = items_receive_info + `↘ [DOWNGRADE] \n`
                                                            }
                                                            if (x == "adds") {
                                                                items_receive_info = items_receive_info + `➕ [ADDS] \n`
                                                            }
                                                            if (x == "projecteds") {
                                                                items_receive_info = items_receive_info + `⚠ [PROJECTEDS] \n`
                                                            }
                                                            if (x == "robux") {
                                                                items_receive_info = items_receive_info + `💲 [ROBUX] \n`
                                                            }
                                                            if (x == "wishlist") {
                                                                items_receive_info = items_receive_info + `💭 [WISHLIST] \n`
                                                            }
                                                            if (x == "rares") {
                                                                items_receive_info = items_receive_info + `💎 [RARES] \n`
                                                            }
                                                            if (x == "demand") {
                                                                items_receive_info = items_receive_info + `💕 [DEMAND] \n`
                                                            }
                                                            if (x == "any") {
                                                                items_receive_info = items_receive_info + `🔀 [ANY] \n`
                                                            }
                                                        })
                                                        var e = new MessageEmbed()
                                                            .setColor("85C1E9")
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aetb_icon })
                                                            .setDescription("`Successfully Posted Trade ad on Rolimons!`")
                                                            .setThumbnail("https://cdn.discordapp.com/icons/415246288779608064/a_52599f94d604ecc6a442b6f3c7e73cce.webp?size=480")
                                                            .addFields({
                                                                name: "`Offer`",
                                                                value: "```" + items_give_info + "```",
                                                                inline: false
                                                            }, {
                                                                name: "`Request`",
                                                                value: "```" + items_receive_info + "```",
                                                                inline: false
                                                            })
                                                            .setTimestamp()
                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [e] })


                                                    } else {
                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Auto AD")}] Failed to post Rolimons trade ad, ${res.message}. (${accinfo.Username})`))

                                                    }
                                                })
                                            } else {
                                                fetch("https://www.rolimons.com/tradeapi/create", {
                                                    method: "POST",
                                                    headers: {
                                                        "content-type": "application/json",
                                                        "cookie": "_RoliVerification=" + rolitoken
                                                    },
                                                    body: JSON.stringify({
                                                        "player_id": accinfo.Userid,
                                                        "offer_item_ids": tradecombiroligive,
                                                        "request_item_ids": tradecombiroliget,
                                                        "request_tags": []
                                                    })
                                                }).then(res => res.json()).then(res => {
                                                    if (res.success == true) {
                                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Auto AD")}] Successfully Posted Rolimons Trade Ad! (${accinfo.Username})`))
                                                        var items_give_info = ""
                                                        var items_receive_info = ""
                                                        tradecombiroligive.forEach(x => {
                                                            items_give_info = items_give_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        tradecombiroliget.forEach(x => {
                                                            items_receive_info = items_receive_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })

                                                        var e = new MessageEmbed()
                                                            .setColor("85C1E9")
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aetb_icon })
                                                            .setThumbnail("https://cdn.discordapp.com/icons/415246288779608064/a_52599f94d604ecc6a442b6f3c7e73cce.webp?size=480")
                                                            .setDescription("`Successfully Posted Trade ad on Rolimons!`")
                                                            .addFields({
                                                                name: "`Offer`",
                                                                value: "```" + items_give_info + "```",
                                                                inline: false
                                                            }, {
                                                                name: "`Request`",
                                                                value: "```" + items_receive_info + "```",
                                                                inline: false
                                                            })
                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [e] })


                                                    } else {
                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Auto AD")}] Failed to post Rolimons trade ad, ${res.message}. (${accinfo.Username})`))

                                                    }
                                                })
                                            }
                                        }
                                        // console.log(tradecombiroligive, tradecombiroliget, accinfo.Userid, decoded)

                                    }, 30000)
                                    setInterval(function () {
                                        // console.log(tradecombiroligive, tradecombiroliget, accinfo.Userid, decoded)
                                        if (config["post Rolimons ads"]) {

                                            if (config["Custom Rolimons Ad"].Enabled == true) {
                                                fetch("https://www.rolimons.com/tradeapi/create", {
                                                    method: "POST",
                                                    headers: {
                                                        "content-type": "application/json",
                                                        "cookie": "_RoliVerification=" + rolitoken
                                                    },
                                                    body: JSON.stringify({
                                                        "player_id": accinfo.Userid,
                                                        "offer_item_ids": config["Custom Rolimons Ad"].Sending,
                                                        "request_item_ids": config["Custom Rolimons Ad"].Requesting,
                                                        "request_tags": config["Custom Rolimons Ad"].Tags
                                                    })
                                                }).then(res => res.json()).then(res => {
                                                    if (res.success == true) {
                                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Auto AD")}] Successfully Posted Rolimons Trade Ad! (${accinfo.Username})`))

                                                        var items_give_info = ""
                                                        var items_receive_info = ""
                                                        config["Custom Rolimons Ad"].Sending.forEach(x => {
                                                            items_give_info = items_give_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        config["Custom Rolimons Ad"].Requesting.forEach(x => {
                                                            items_receive_info = items_receive_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        config["Custom Rolimons Ad"].Tags.forEach(x => {
                                                            if (x == "upgrade") {
                                                                items_receive_info = items_receive_info + `💹 [UPGRADING] \n`
                                                            }
                                                            if (x == "downgrade") {
                                                                items_receive_info = items_receive_info + `↘ [DOWNGRADE] \n`
                                                            }
                                                            if (x == "adds") {
                                                                items_receive_info = items_receive_info + `➕ [ADDS] \n`
                                                            }
                                                            if (x == "projecteds") {
                                                                items_receive_info = items_receive_info + `⚠ [PROJECTEDS] \n`
                                                            }
                                                            if (x == "robux") {
                                                                items_receive_info = items_receive_info + `💲 [ROBUX] \n`
                                                            }
                                                            if (x == "wishlist") {
                                                                items_receive_info = items_receive_info + `💭 [WISHLIST] \n`
                                                            }
                                                            if (x == "rares") {
                                                                items_receive_info = items_receive_info + `💎 [RARES] \n`
                                                            }
                                                            if (x == "demand") {
                                                                items_receive_info = items_receive_info + `💕 [DEMAND] \n`
                                                            }
                                                            if (x == "any") {
                                                                items_receive_info = items_receive_info + `🔀 [ANY] \n`
                                                            }
                                                        })
                                                        var e = new MessageEmbed()
                                                            .setColor("85C1E9")
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aetb_icon })
                                                            .setDescription("`Successfully Posted Trade ad on Rolimons!`")
                                                            .setThumbnail("https://cdn.discordapp.com/icons/415246288779608064/a_52599f94d604ecc6a442b6f3c7e73cce.webp?size=480")
                                                            .addFields({
                                                                name: "`Offer`",
                                                                value: "```" + items_give_info + "```",
                                                                inline: false
                                                            }, {
                                                                name: "`Request`",
                                                                value: "```" + items_receive_info + "```",
                                                                inline: false
                                                            })
                                                            .setTimestamp()
                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [e] })


                                                    } else {
                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Auto AD")}] Failed to post Rolimons trade ad, ${res.message}. (${accinfo.Username})`))

                                                    }
                                                })
                                            } else {
                                                fetch("https://www.rolimons.com/tradeapi/create", {
                                                    method: "POST",
                                                    headers: {
                                                        "content-type": "application/json",
                                                        "cookie": "_RoliVerification=" + rolitoken
                                                    },
                                                    body: JSON.stringify({
                                                        "player_id": accinfo.Userid,
                                                        "offer_item_ids": tradecombiroligive,
                                                        "request_item_ids": tradecombiroliget,
                                                        "request_tags": []
                                                    })
                                                }).then(res => res.json()).then(res => {
                                                    if (res.success == true) {
                                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Auto AD")}] Successfully Posted Rolimons Trade Ad! (${accinfo.Username})`))
                                                        var items_give_info = ""
                                                        var items_receive_info = ""
                                                        tradecombiroligive.forEach(x => {
                                                            items_give_info = items_give_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })
                                                        tradecombiroliget.forEach(x => {
                                                            items_receive_info = items_receive_info + `${itemdata[x][0]} (🔵 ${itemdata[x][4]}) \n`
                                                        })

                                                        var e = new MessageEmbed()
                                                            .setColor("85C1E9")
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aetb_icon })
                                                            .setThumbnail("https://cdn.discordapp.com/icons/415246288779608064/a_52599f94d604ecc6a442b6f3c7e73cce.webp?size=480")
                                                            .setDescription("`Successfully Posted Trade ad on Rolimons!`")
                                                            .addFields({
                                                                name: "`Offer`",
                                                                value: "```" + items_give_info + "```",
                                                                inline: false
                                                            }, {
                                                                name: "`Request`",
                                                                value: "```" + items_receive_info + "```",
                                                                inline: false
                                                            })
                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [e] })


                                                    } else {
                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Auto AD")}] Failed to post Rolimons trade ad, ${res.message}. (${accinfo.Username})`))

                                                    }
                                                })
                                            }
                                        }
                                    }, 30.2 * 60000)




                                    // completed checker



                                    var last_Completed = null

                                    rp(options).then(function () {

                                    })
                                        .catch(function (err) {
                                            xtoken = err.response.headers["x-csrf-token"]
                                            fetch("https://trades.roblox.com/v1/trades/Completed?sortOrder=Desc&limit=100", {
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "X-CSRF-TOKEN": xtoken,
                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                }
                                            }).then(res => res.json()).then(res => {
                                                var timeout = 0
                                                last_Completed = res.data[0].id
                                                res.data.forEach(x => {
                                                    timeout = timeout + config["milliseconds between finding trades"]
                                                    if (fail_traders.includes(x) == false) {
                                                        fail_traders.push(x.user.id)
                                                    }
                                                    setTimeout(function () {

                                                        if (config["Max queue"] < queue.length) {
                                                            FindTrade(x.user.id, "completeds")

                                                        }

                                                    }, timeout)
                                                })
                                            })
                                        })


                                    function createCompletedEmbed(trade_id) {
                                        fetch(`https://trades.roblox.com/v1/trades/${trade_id}`, {
                                            headers: {
                                                "Content-Type": "application/json",
                                                "X-CSRF-TOKEN": xtoken,
                                                cookie: ".ROBLOSECURITY=" + cookie + ";",
                                            }
                                        }).then(t => t.json()).then(t => {
                                            if (!t.errors) {
                                                var sent_items_string = ""
                                                var received_items_string = ""
                                                var sumgive = 0
                                                var sumget = 0
                                                t.offers[0].userAssets.forEach(x => {
                                                    sumgive = sumgive + itemdata[x.assetId][4]
                                                    sent_items_string = sent_items_string + `${itemdata[x.assetId][0]} (🎲 ${itemdata[x.assetId][4]}) \n`
                                                })
                                                t.offers[1].userAssets.forEach(x => {
                                                    sumget = sumget + itemdata[x.assetId][4]

                                                    received_items_string = received_items_string + `${itemdata[x.assetId][0]} (🎲 ${itemdata[x.assetId][4]}) \n`
                                                })
                                                clog(chalk.bgRed(`New completed detected! ${sumgive} vs ${sumget} (${(sumget - sumgive)} robux profit) (${accinfo.Username})`))


                                                var newEmbed = new MessageEmbed()

                                                    .setColor(config["Trade completed color"])
                                                    .setTimestamp()
                                                    .setTitle(`Trade Completed Detected from ${t.user.name} (${t.user.displayName})! ✅`)
                                                    .addFields({
                                                        name: "**Value given** 🔵",
                                                        value: "```" + sumgive + "```",
                                                        inline: true
                                                    },
                                                        {
                                                            name: "**Value received** 🟠",
                                                            value: "```" + sumget + "```",
                                                            inline: true
                                                        },
                                                        {
                                                            name: "**Profit** 😲💲",
                                                            value: "```" + (sumget - sumgive) + "```",
                                                            inline: false
                                                        },
                                                        {
                                                            name: "**Items given 🟦**",
                                                            value: "```" + sent_items_string + "```",
                                                            inline: false
                                                        }, {
                                                        name: "**Items received 🟧**",
                                                        value: "```" + received_items_string + "```",
                                                        inline: false
                                                    })
                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aetb_icon })
                                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=687018056&width=420&height=420&format=png')
                                                    .setFooter({ text: `Aequet trade bot | ${queue.length} trades in queue` })


                                                completeds = completeds + 1
                                                if ((sumget - sumgive) > 0) {
                                                    profit = sumget - sumgive

                                                }
                                                client.channels.cache.get("" + config["Trade Completed Channel"] + "").send({ embeds: [newEmbed] })
                                                client.channels.cache.get("" + config["Trade Completed Channel"] + "").send(`<@${config["Discord ID"]}>`)
                                                upgrades = []
                                                downgrades = []
                                                mixeds = []
                                                total_possible_combinations = {}
                                                total_possible_combinations_int = 0


                                                if (config["Reset everything once completed"] == true) {
                                                    queue = []
                                                    already_sent = []
                                                }
                                            } else {
                                                createCompletedEmbed(last_Completed)
                                            }

                                        })
                                    }
                                    setInterval(function () {
                                        rp(options).then(function () {

                                        })
                                            .catch(function (err) {
                                                xtoken = err.response.headers["x-csrf-token"]
                                                fetch("https://trades.roblox.com/v1/trades/Completed?sortOrder=Desc&limit=100", {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    }
                                                }).then(res => res.json()).then(res => {
                                                    if (!res.errors) {
                                                        // console.log(last_Completed, res.data[0].id)
                                                        if (res.data[0].id !== last_Completed) {
                                                            last_Completed = res.data[0].id
                                                            createCompletedEmbed(last_Completed)
                                                        }
                                                        res.data.forEach(x => {
                                                            if (fail_traders.includes(x) == false) {
                                                                fail_traders.push(x.user.id)
                                                            }
                                                            if (config["Max queue"] < queue.length) {
                                                                FindTrade(x.user.id, "completeds")

                                                            }
                                                        })
                                                    }

                                                })
                                            })
                                    }, 1000 * config["Time Between Checking completeds"])


                                    // New item notifier

                                    /*
                                    setInterval(function () {
                                        var newEmbed = new MessageEmbed()
                                            .setColor('5D86F5')
                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                            .setThumbnail("https://tr.rbxcdn.com/aee308c91b9f26956c9c37909c8d77f9/420/420/Hat/Png")
                                            .setDescription('`' + "Tixvalk" + '` just went limited ! 🎉✨ \n This item has been automatically blacklisted.')
                                            .addFields({
                                                name: "Item ID",
                                                value: "`382881237`",
                                                inline: false
                                            }, {
                                                name: "Rap",
                                                value: "`3,259,702`",
                                                inline: false
                                            }, {
                                                name: "Price",
                                                value: "`3,838,888`",
                                                inline: false
                                            }, {
                                                name: "Owned?",
                                                value: "`Yes.`",
                                                inline: false
                                            })
                                        setTimeout(function () {
                                            client.channels.cache.get("" + config["Trade Completed Channel"] + "").send({ embeds: [newEmbed] })

                                        }, 2000)
                                    }, 120000)

                                    */



                                    // Owner Scraping

                                    setInterval(function () {
                                        if (ids_to_scrape.length !== 0 && config["Owner Scraping"].enabled == true) {
                                            var itemid = ids_to_scrape.shift()
                                            ids_to_scrape.push(itemid)
                                            setTimeout(function () {
                                                let u = ids_to_scrape.shift()
                                            }, config["already sent interval"] * 60000)
                                            clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("OWNER SCRAPING")}] Finding ${itemdata[itemid][0]}'s owners to trade with!`))
                                            var index = 0
                                            var owners_ids_temp = []


                                            async function scrapeOwners(cursor, _callback) {
                                                return new Promise((resolve, reject) => {

                                                    var scursor = null
                                                    var str = `https://inventory.roblox.com/v2/assets/${itemid}/owners?sortOrder=Desc&limit=100`
                                                    if (cursor) {
                                                        str = str + `&cursor=${cursor}`
                                                    }
                                                    fetch(str, {
                                                        headers: {
                                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                        }
                                                    }).then(res => res.json()).then(res => {



                                                        if (!res.errors) {
                                                            index = index + 1
                                                            if (res.nextPageCursor) {
                                                                scursor = res.nextPageCursor
                                                            }

                                                            res.data.forEach(x => {
                                                                if (x.owner !== null) {
                                                                    owners_ids_temp.push(x.owner.id)
                                                                }
                                                            })
                                                            // console.log(res.nextPageCursor)
                                                            if (cursor == null && res.data == undefined) {
                                                                setTimeout(function () {
                                                                    scrapeOwners(data.nextPageCursor);
                                                                }, 500);
                                                            }
                                                            if (res.nextPageCursor == null || index <= config["Owner Scraping"]["Max item pages"]) {
                                                                resolve(owners_ids_temp)
                                                            }
                                                            setTimeout(function () {
                                                                scrapeOwners(res.nextPageCursor);
                                                            }, 5000);
                                                        } else {
                                                            // console.log(res)
                                                            setTimeout(function () {
                                                                scrapeOwners(scursor);
                                                            }, 10000)
                                                        }
                                                    })

                                                })
                                            }

                                            async function check() {
                                                var res = await scrapeOwners()
                                                var index_time = 0
                                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("OWNER SCRAPING")}] Successfully scraped ${owners_ids_temp.length} ${itemdata[itemid][0]} owners! Now checking their premium subscription.`))

                                                owners_ids_temp.forEach(x => {
                                                    index_time + index_time + 650
                                                    fetch(`https://www.roblox.com/users/profile/profileheader-json?userid=${x}`, {
                                                        headers: {
                                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                        }
                                                    }).then(res => res.json()).then(res => {
                                                        if (res.CanTrade) {
                                                            if (res.CanTrade == true) {
                                                                users_to_find.push(x)
                                                                // if (config["Print useless things"] == true) {
                                                                clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("OWNER SCRAPING")}] Finding trades with ${x} (Scraped from owner scraping).`))
                                                                // }
                                                            }
                                                        }
                                                    })
                                                })
                                            }
                                            check()
                                        }
                                    }, config["Owner Scraping"]["Interval per items"] * 1000)

                                    // used for mass send.




                                    function sendTrade(temp, _callback) {
                                        var trade_info = temp
                                        if (wait == false && config["Test mode"] == false) {

                                            if (dont_send == false) {

                                                var username_receiver = trade_info.username
                                                // console.log(trade_info)


                                                if (trade_info !== undefined) {
                                                    var items_receive_info = ""
                                                    trade_info.items_receive_info.forEach(y => {
                                                        items_receive_info = items_receive_info + y + "\n"
                                                    })
                                                    var items_give_info = ""
                                                    trade_info.items_give_info.forEach(y => {
                                                        items_give_info = items_give_info + y + "\n"
                                                    })
                                                    if (config["IP lock bypass"] == true) {
                                                        var authTicket = null
                                                        fetch("https://auth.roblox.com/v1/authentication-ticket", {
                                                            method: "POST",
                                                            headers: { 'User-Agent': 'Roblox/WinInet', 'Referer': 'https://www.roblox.com/my/account', 'Origin': 'https://www.roblox.com', "cookie": ".ROBLOSECURITY=" + cookie, 'x-csrf-token': xtoken }

                                                        }).then(res => {
                                                            // console.log(res.status)
                                                            if (res.status == 200) {
                                                                for (var i of res.headers) {
                                                                    if (i[0] == "rbx-authentication-ticket") {
                                                                        authTicket = i[1]
                                                                    }
                                                                }

                                                                // 
                                                                // console.log(authTicket)
                                                                fetch("https://auth.roblox.com/v1/authentication-ticket/redeem", {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json", "rbxauthenticationnegotiation": 1, "user-agent": "Roblox/WinInet", "origin": "https://www.roblox.com", "referer": "https://www.roblox.com/my/account", 'x-csrf-token': xtoken },

                                                                    body: JSON.stringify({
                                                                        "authenticationTicket": authTicket
                                                                    })
                                                                }).then(res2 => {
                                                                    // console.log(res2.status)

                                                                    if (res2.status == 200) {

                                                                        for (var i of res2.headers) {
                                                                            // console.log(i)
                                                                            if (i[0] == "set-cookie") {
                                                                                let temp = i[1].split(",")

                                                                                var modifiedCookie = null

                                                                                modifiedCookie = temp[2]

                                                                                // console.log(modifiedCookie)

                                                                                clog(chalk.rgb(config["Console Trade Color"]["Attempting To Send"][0], config["Console Trade Color"]["Attempting To Send"][1], config["Console Trade Color"]["Attempting To Send"][2])(`[${chalk.white("Trading")}] Attempting to send to ${chalk.rgb(config["Console Trade Color"]["Attempting To Send Highlight"][0], config["Console Trade Color"]["Attempting To Send Highlight"][1], config["Console Trade Color"]["Attempting To Send Highlight"][2])(username_receiver)}. (${accinfo.Username})`))




                                                                                if (modifiedCookie !== undefined || modifiedCookie !== null) {
                                                                                    if (proxies_enabled) {
                                                                                        const random = Math.floor(Math.random() * proxies.length);
                                                                                        // console.log(random, proxies[random]);
                                                                                        (async () => {
                                                                                            var proxyAgent = null
                                                                                            var random2 = proxies[random]
                                                                                            // console.log(random2.substring(0,4))

                                                                                            proxyAgent = new HttpsProxyAgent(random2)
                                                                                            // console.log(proxyAgent)
                                                                                            if (true) {
                                                                                                const response = await fetch('https://trades.roblox.com/v1/trades/send', {
                                                                                                    agent: proxyAgent,
                                                                                                    method: "POST",
                                                                                                    headers: {
                                                                                                        "Content-Type": "application/json",
                                                                                                        "X-CSRF-TOKEN": xtoken,
                                                                                                        cookie: modifiedCookie + ";",
                                                                                                    },
                                                                                                    body: JSON.stringify({
                                                                                                        "offers": [{
                                                                                                            "userId": trade_info.userid,
                                                                                                            "userAssetIds": trade_info.items_receive,
                                                                                                            "robux": 0
                                                                                                        },
                                                                                                        {
                                                                                                            "userId": accinfo.Userid,
                                                                                                            "userAssetIds": trade_info.items_send,
                                                                                                            "robux": 0
                                                                                                        }
                                                                                                        ]
                                                                                                    })
                                                                                                });
                                                                                                const body = await response.json();

                                                                                                if (body.errors) {

                                                                                                    if (body.errors[0].code == 0) {

                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Too Many Requests. Retrying to send. (${accinfo.Username})`))

                                                                                                        queue.push(trade_info)

                                                                                                    } else
                                                                                                        if (body.errors[0].message == 'Token Validation Failed') {
                                                                                                            rp(options).then(function () {

                                                                                                            }).catch(function (err) {
                                                                                                                xtoken = err.response.headers["x-csrf-token"]
                                                                                                                queue.push(trade_info)

                                                                                                            })
                                                                                                        } else
                                                                                                            if (body.errors[0].code == 14) {
                                                                                                                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, too many requests. (${accinfo.Username})`))
                                                                                                                queue.push(trade_info)
                                                                                                                waitForRatelimit = true
                                                                                                                setTimeout(function () {
                                                                                                                    waitForRatelimit = false
                                                                                                                }, config["Time after ratelimit"])

                                                                                                            } else
                                                                                                                if (body.errors[0].code == 12) {
                                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Some of the items in the trades are not owned anymore. (${accinfo.Username})`))

                                                                                                                    sendTrade(queue.shift(), function (data) { })
                                                                                                                } else
                                                                                                                    if (body.errors[0].code == 22) {
                                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                                        sendTrade(queue.shift(), function (data) { })


                                                                                                                    } else if (body.errors[0].code == 7) {
                                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                                                        sendTrade(queue.shift(), function (data) { })
                                                                                                                    }
                                                                                                    // console.log(p, giveassets)
                                                                                                } else {

                                                                                                    usersent.push(trade_info.userid)


                                                                                                    if (config["send notif when trade sent"] == true) {

                                                                                                        trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                        trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                        trades_sent_int = trades_sent_int + 1

                                                                                                        var newEmbed = new MessageEmbed()

                                                                                                            .setColor(config["Trade sent color"])
                                                                                                            .setTimestamp()
                                                                                                            .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                            .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                            .addFields({
                                                                                                                name: "**Value Sent** 🔵",
                                                                                                                value: "```" + trade_info.real_sumgive + "```",
                                                                                                                inline: true
                                                                                                            },
                                                                                                                {
                                                                                                                    name: "**Value Requested** 🟠",
                                                                                                                    value: "```" + trade_info.real_sumget + "```",
                                                                                                                    inline: true
                                                                                                                },
                                                                                                                {
                                                                                                                    name: "**Profit** ✅",
                                                                                                                    value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                                    inline: false
                                                                                                                },
                                                                                                                {
                                                                                                                    name: "**Items sent 🟦**",
                                                                                                                    value: "```" + items_give_info + "```",
                                                                                                                    inline: false
                                                                                                                }, {
                                                                                                                name: "**Items requested 🟧**",
                                                                                                                value: "```" + items_receive_info + "```",
                                                                                                                inline: false
                                                                                                            })
                                                                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                            .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                                trade_info.userid +
                                                                                                                '&width=420&height=420&format=png')

                                                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })



                                                                                                        trade_info.trade_id = body.id
                                                                                                        trades_sent.push(trade_info)

                                                                                                    } else {
                                                                                                        trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                        trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                        trades_sent_int = trades_sent_int + 1

                                                                                                        var newEmbed = new MessageEmbed()

                                                                                                            .setColor(config["Trade sent color"])
                                                                                                            .setTimestamp()
                                                                                                            .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                            .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                            .addFields({
                                                                                                                name: "**Value Sent** 🔵",
                                                                                                                value: "```" + trade_info.real_sumgive + "```",
                                                                                                                inline: true
                                                                                                            },
                                                                                                                {
                                                                                                                    name: "**Value Requested** 🟠",
                                                                                                                    value: "```" + trade_info.real_sumget + "```",
                                                                                                                    inline: true
                                                                                                                },
                                                                                                                {
                                                                                                                    name: "**Profit** ✅",
                                                                                                                    value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                                    inline: false
                                                                                                                },
                                                                                                                {
                                                                                                                    name: "**Items sent 🟦**",
                                                                                                                    value: "```" + items_give_info + "```",
                                                                                                                    inline: false
                                                                                                                }, {
                                                                                                                name: "**Items requested 🟧**",
                                                                                                                value: "```" + items_receive_info + "```",
                                                                                                                inline: false
                                                                                                            })
                                                                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                            .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                                trade_info.userid +
                                                                                                                '&width=420&height=420&format=png')

                                                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })

                                                                                                        trade_info.trade_id = body.id

                                                                                                        trades_sent.push(trade_info)

                                                                                                    }




                                                                                                }
                                                                                            }
                                                                                        })();
                                                                                    } else {
                                                                                        fetch("https://trades.roblox.com/v1/trades/send", {
                                                                                            method: "POST",
                                                                                            headers: {
                                                                                                "Content-Type": "application/json",
                                                                                                "X-CSRF-TOKEN": xtoken,
                                                                                                cookie: modifiedCookie + ";",
                                                                                            },
                                                                                            body: JSON.stringify({
                                                                                                "offers": [{
                                                                                                    "userId": trade_info.userid,
                                                                                                    "userAssetIds": trade_info.items_receive,
                                                                                                    "robux": 0
                                                                                                },
                                                                                                {
                                                                                                    "userId": accinfo.Userid,
                                                                                                    "userAssetIds": trade_info.items_send,
                                                                                                    "robux": 0
                                                                                                }
                                                                                                ]
                                                                                            })
                                                                                        }).then(res => res.json()).then(res => {
                                                                                            if (res.errors) {
                                                                                                if (res.errors[0].code == 14 || res.errors[0].message == "TooManyRequests") {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Too many requests while sending to ${chalk.rgb(255, 102, 102)(username_receiver)}. (${accinfo.Username})`))
                                                                                                    queue.push(trade_info)


                                                                                                } else
                                                                                                    if (res.errors[0].message == 'Token Validation Failed') {
                                                                                                        rp(options).then(function () {

                                                                                                        }).catch(function (err) {
                                                                                                            xtoken = err.response.headers["x-csrf-token"]
                                                                                                            queue.push(trade_info)

                                                                                                        })
                                                                                                    } else
                                                                                                        if (res.errors[0].code == 22) {
                                                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                            sendTrade(queue.shift(), function (data) { })

                                                                                                        } else if (res.errors[0].code == 7) {
                                                                                                            sendTrade(queue.shift(), function (data) { })

                                                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))

                                                                                                        }
                                                                                                // console.log(p, giveassets)
                                                                                            } else {
                                                                                                usersent.push(trade_info.userid)


                                                                                                trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                trades_sent_int = trades_sent_int + 1
                                                                                                var newEmbed = new MessageEmbed()

                                                                                                    .setColor(config["Trade sent color"])
                                                                                                    .setTimestamp()
                                                                                                    .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                    .setDescription("**Trade** 🆔\n" + "` " + res.id + "`")
                                                                                                    .addFields({
                                                                                                        name: "**Value Sent** 🔵",
                                                                                                        value: "```" + trade_info.real_sumgive + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                        {
                                                                                                            name: "**Value Requested** 🟠",
                                                                                                            value: "```" + trade_info.real_sumget + "```",
                                                                                                            inline: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Profit** ✅",
                                                                                                            value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                            inline: false
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Items sent 🟦**",
                                                                                                            value: "```" + items_give_info + "```",
                                                                                                            inline: false
                                                                                                        }, {
                                                                                                        name: "**Items requested 🟧**",
                                                                                                        value: "```" + items_receive_info + "```",
                                                                                                        inline: false
                                                                                                    })
                                                                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                        trade_info.userid +
                                                                                                        '&width=420&height=420&format=png')
                                                                                                clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                                trade_info.trade_id = res.id
                                                                                                trades_sent.push(trade_info)







                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }




                                                                            }
                                                                        }
                                                                    } else {
                                                                        // console.log(res2.status)

                                                                        setTimeout(function () {
                                                                            sendTrade(trade_info)

                                                                        }, 30000)
                                                                    }
                                                                })


                                                            } else {
                                                                // console.log(res.status)
                                                                sendTrade(trade_info, function (data) { })
                                                            }
                                                        })
                                                    } else {



                                                        fetch("https://api.roblox.com//users/" + trade_info.userid).then(res => res.json().catch(err => { }))
                                                            .then(u => {
                                                                clog(chalk.rgb(config["Console Trade Color"]["Attempting To Send"][0], config["Console Trade Color"]["Attempting To Send"][1], config["Console Trade Color"]["Attempting To Send"][2])(`[${chalk.white("Trading")}] Attempting to send to ${chalk.rgb(config["Console Trade Color"]["Attempting To Send Highlight"][0], config["Console Trade Color"]["Attempting To Send Highlight"][1], config["Console Trade Color"]["Attempting To Send Highlight"][2])(username_receiver)}. (${accinfo.Username})`))




                                                                setTimeout(function () {
                                                                    if (true) {
                                                                        if (proxies_enabled) {
                                                                            const random = Math.floor(Math.random() * proxies.length);
                                                                            // console.log(random, proxies[random]);
                                                                            (async () => {
                                                                                var proxyAgent = null
                                                                                var random2 = proxies[random]
                                                                                // console.log(random2.substring(0,4))

                                                                                proxyAgent = new HttpsProxyAgent(random2)
                                                                                // console.log(proxyAgent)
                                                                                if (true) {

                                                                                    const response = await fetch('https://trades.roblox.com/v1/trades/send', {
                                                                                        agent: proxyAgent,
                                                                                        method: "POST",
                                                                                        headers: {
                                                                                            "Content-Type": "application/json",
                                                                                            "X-CSRF-TOKEN": xtoken,
                                                                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                        },
                                                                                        body: JSON.stringify({
                                                                                            "offers": [{
                                                                                                "userId": trade_info.userid,
                                                                                                "userAssetIds": trade_info.items_receive,
                                                                                                "robux": 0
                                                                                            },
                                                                                            {
                                                                                                "userId": accinfo.Userid,
                                                                                                "userAssetIds": trade_info.items_send,
                                                                                                "robux": 0
                                                                                            }
                                                                                            ]
                                                                                        })
                                                                                    });
                                                                                    const body = await response.json();
                                                                                    // console.log(body);
                                                                                    if (body.errors) {

                                                                                        if (body.errors[0].message == 'Token Validation Failed') {
                                                                                            rp(options).then(function () {

                                                                                            }).catch(function (err) {
                                                                                                xtoken = err.response.headers["x-csrf-token"]
                                                                                                queue.push(trade_info)

                                                                                            })
                                                                                        } else
                                                                                            if (body.errors[0].code == 14 || body.errors[0].message == "TooManyRequests") {
                                                                                                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, too many requests. (${accinfo.Username})`))
                                                                                                queue.push(trade_info)

                                                                                            } else
                                                                                                if (body.errors[0].code == 22) {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                    sendTrade(queue.shift(), function (data) { })

                                                                                                } else if (body.errors[0].code == 7) {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                                    sendTrade(queue.shift(), function (data) { })
                                                                                                }
                                                                                        // console.log(p, giveassets)
                                                                                    } else {

                                                                                        usersent.push(trade_info.userid)


                                                                                        if (config["send notif when trade sent"] == true) {

                                                                                            trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                            trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                            trades_sent_int = trades_sent_int + 1
                                                                                            var newEmbed = new MessageEmbed()

                                                                                                .setColor(config["Trade sent color"])
                                                                                                .setTimestamp()
                                                                                                .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                .addFields({
                                                                                                    name: "**Value Sent** 🔵",
                                                                                                    value: "```" + trade_info.real_sumgive + "```",
                                                                                                    inline: true
                                                                                                },
                                                                                                    {
                                                                                                        name: "**Value Requested** 🟠",
                                                                                                        value: "```" + trade_info.real_sumget + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Profit** ✅",
                                                                                                        value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                        inline: false
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Items sent 🟦**",
                                                                                                        value: "```" + items_give_info + "```",
                                                                                                        inline: false
                                                                                                    }, {
                                                                                                    name: "**Items requested 🟧**",
                                                                                                    value: "```" + items_receive_info + "```",
                                                                                                    inline: false
                                                                                                })
                                                                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                    trade_info.userid +
                                                                                                    '&width=420&height=420&format=png')

                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                            client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                            trade_info.trade_id = body.id
                                                                                            trades_sent.push(trade_info)





                                                                                        } else {
                                                                                            trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                            trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                            trades_sent_int = trades_sent_int + 1
                                                                                            var newEmbed = new MessageEmbed()

                                                                                                .setColor(config["Trade sent color"])
                                                                                                .setTimestamp()
                                                                                                .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                .addFields({
                                                                                                    name: "**Value Sent** 🔵",
                                                                                                    value: "```" + trade_info.real_sumgive + "```",
                                                                                                    inline: true
                                                                                                },
                                                                                                    {
                                                                                                        name: "**Value Requested** 🟠",
                                                                                                        value: "```" + trade_info.real_sumget + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Profit** ✅",
                                                                                                        value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                        inline: false
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Items sent 🟦**",
                                                                                                        value: "```" + items_give_info + "```",
                                                                                                        inline: false
                                                                                                    }, {
                                                                                                    name: "**Items requested 🟧**",
                                                                                                    value: "```" + items_receive_info + "```",
                                                                                                    inline: false
                                                                                                })
                                                                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                    trade_info.userid +
                                                                                                    '&width=420&height=420&format=png')
                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                            client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                            trade_info.trade_id = body.id

                                                                                            trades_sent.push(trade_info)




                                                                                        }




                                                                                    }
                                                                                }
                                                                            })();
                                                                        } else {
                                                                            fetch("https://trades.roblox.com/v1/trades/send", {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    "Content-Type": "application/json",
                                                                                    "X-CSRF-TOKEN": xtoken,
                                                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                },
                                                                                body: JSON.stringify({
                                                                                    "offers": [{
                                                                                        "userId": trade_info.userid,
                                                                                        "userAssetIds": trade_info.items_receive,
                                                                                        "robux": 0
                                                                                    },
                                                                                    {
                                                                                        "userId": accinfo.Userid,
                                                                                        "userAssetIds": trade_info.items_send,
                                                                                        "robux": 0
                                                                                    }
                                                                                    ]
                                                                                })
                                                                            }).then(res => res.json()).then(res => {
                                                                                if (res.errors) {
                                                                                    if (res.errors[0].code == 14 || res.errors[0].message == "TooManyRequests") {
                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Too many requests while sending to ${chalk.rgb(255, 102, 102)(username_receiver)}. (${accinfo.Username})`))
                                                                                        queue.push(trade_info)

                                                                                    } else
                                                                                        if (res.errors[0].message == 'Token Validation Failed') {
                                                                                            rp(options).then(function () {

                                                                                            }).catch(function (err) {
                                                                                                xtoken = err.response.headers["x-csrf-token"]
                                                                                                queue.push(trade_info)

                                                                                            })
                                                                                        } else
                                                                                            if (res.errors[0].code == 22) {
                                                                                                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high.(${accinfo.Username})`))
                                                                                                sendTrade(queue.shift(), function (data) { })

                                                                                            } else if (res.errors[0].code == 7) {
                                                                                                sendTrade(queue.shift(), function (data) { })

                                                                                                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                            }
                                                                                    // console.log(p, giveassets)
                                                                                } else {
                                                                                    usersent.push(trade_info.userid)


                                                                                    trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                    trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                    trades_sent_int = trades_sent_int + 1

                                                                                    var newEmbed = new MessageEmbed()

                                                                                        .setColor(config["Trade sent color"])
                                                                                        .setTimestamp()
                                                                                        .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                        .setDescription("**Trade** 🆔\n" + "` " + res.id + "`")
                                                                                        .addFields({
                                                                                            name: "**Value Sent** 🔵",
                                                                                            value: "```" + trade_info.real_sumgive + "```",
                                                                                            inline: true
                                                                                        },
                                                                                            {
                                                                                                name: "**Value Requested** 🟠",
                                                                                                value: "```" + trade_info.real_sumget + "```",
                                                                                                inline: true
                                                                                            },
                                                                                            {
                                                                                                name: "**Profit** ✅",
                                                                                                value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                inline: false
                                                                                            },
                                                                                            {
                                                                                                name: "**Items sent 🟦**",
                                                                                                value: "```" + items_give_info + "```",
                                                                                                inline: false
                                                                                            }, {
                                                                                            name: "**Items requested 🟧**",
                                                                                            value: "```" + items_receive_info + "```",
                                                                                            inline: false
                                                                                        })
                                                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                        .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                            trade_info.userid +
                                                                                            '&width=420&height=420&format=png')

                                                                                    clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                    trade_info.trade_id = res.id
                                                                                    trades_sent.push(trade_info)






                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                }, 5000)




                                                            })


                                                    }


                                                }
                                            }
                                        }
                                    }

                                    /*
                    
                                    var newEmbed = new Discord.MessageEmbed()
                                    .setColor("")
                                    .setAuthor("AeTB Aequet Trade Bot")
                    
                                    */

                                    // DISCORD COMMANDS
                                    var prefix = config["Command prefix"];
                                    client.on('messageCreate', (message) => {
                                        var args = message.content.split(' ');
                                        if (args[0] == prefix + 'help' || args[0] == prefix + 'commands' || args[0] == prefix + 'cmds') {
                                            var newEmbed = new MessageEmbed()
                                                .setDescription("List of aequet Trade Bot Discord Commands.")
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                .setColor("0068FF")
                                                .addFields({
                                                    name: prefix + "stats",
                                                    value: "```" + "Shows your trades stats, account stats" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "mass_send",
                                                    value: "```" + "Mass sends for a specific item. (example : $mass_send itemid [uaid,uaid,uaid,uaid])" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "mass_decline_inbounds (mdi) / " + prefix + "mass_decline_outbounds (mdo)",
                                                    value: "```" + "Decline your 100 latests trades inbound/outbound" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "clear_queue",
                                                    value: "```" + "clears your current queue" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "clear_cooldown",
                                                    value: "```" + "clears array where recent users you sent to are stored." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "proj [itemid]",
                                                    value: "```" + "Detects if an item is projected." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "find_trade [userid] (fi [userid]) / " + prefix + "find_trade_send [userid] (fti)",
                                                    value: "```" + "Finds a trade with a specific user, use find_trade_send [userid] to make the bot send the trade." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + "stop / " + prefix + "restart",
                                                    value: "```" + "stops/restarts the bot." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'fuck_inbounds [userid] [x times]',
                                                    value: "```" + "mass send a trade to the user x times. the bot will generate a combination for you." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'count_outbounds/inbounds',
                                                    value: "```" + "Count how much outbounds / inbounds you have." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'scan_db',
                                                    value: "```" + "scans a database of users. use this if you have a low queue" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'dont_send',
                                                    value: "```" + "the bot will only queue trade" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'yes_send',
                                                    value: "```" + "the bot will queue trades + send them" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'info',
                                                    value: "```" + "gives account information" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'version',
                                                    value: "```" + "displays aetb version youre running on" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'config',
                                                    value: "```" + "edit your config, use " + prefix + "config dm to send your config via private message, use " + prefix + "config [setting] [value] to edit a part of your config. (example: config custom_ratios 5000 min 1.08)." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'accept [trade id]',
                                                    value: "```" + "accepts a trade" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'view_trade [trade id]',
                                                    value: "```" + "Shows you a trade" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'logs',
                                                    value: "```" + "Gives you bot logs" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'blacklist [userid]',
                                                    value: "```" + "Blacklists a specific user" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'DoNotTrade (' + prefix + 'dnt) [itemid]',
                                                    value: "```" + "Adds an item in your do not trade list" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'DoNotGet (' + prefix + 'dng) [itemid]',
                                                    value: "```" + "Adds an item to your do not get list" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'rate_fit (' + prefix + 'rf) [userid]',
                                                    value: "```" + "The bot will rate the outfit of a specific user." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'view_trade [trade id]',
                                                    value: "```" + "Shows you a trade" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'only_send',
                                                    value: "```" + "The bot will only send, not queue trades" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'queue_trades',
                                                    value: "```" + "Bot will only queue trades [test_mode]." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'decline [trade id]',
                                                    value: "```" + "Decline a trade." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'findtrade (' + prefix + 'ft) [userid]',
                                                    value: "```" + "The bot will try to find a trade with the specified userid. If it doesnt replies, then it didnt find any trades ¯\_(ツ)_/¯" + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'findtradesend (' + prefix + 'fts) [userid]',
                                                    value: "```" + "The bot will find a trade and send the trade to the specified userid." + "```",
                                                    inline: false
                                                }, {
                                                    name: prefix + 'search [Item name / Acronym]',
                                                    value: "```" + "Search for any item by its name or acronym." + "```",
                                                    inline: false
                                                })


                                            message.reply({ embeds: [newEmbed] })


                                        }
                                        if (message.content == prefix + 'stats') {
                                            var d = new Date()
                                            var newEmbed = new MessageEmbed()
                                                .setColor("FFFFFF")
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                .addFields({
                                                    name: 'Trades sent in a minute',
                                                    value: "```" + trade_sent_in_a_min2 + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Trades sent in 10 minutes',
                                                    value: "```" + trades_sent_in_10mins2 + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Trades sent since the bot has started',
                                                    value: "```" + trades_sent_int + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Queue length',
                                                    value: "```" + queue.length + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Number of completeds since the bot has started',
                                                    value: "```" + completeds + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Users scanned',
                                                    value: "```" + separator(users_scanned) + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Combinations made',
                                                    value: "```" + separator(combinations_made) + "```",
                                                    inline: false
                                                }, {
                                                    name: 'Started at',
                                                    value: "```" + today + "```",
                                                    inline: false
                                                })
                                            message.reply({ embeds: [newEmbed] })

                                        }
                                        var t = config["milliseconds between sending trades"]

                                        if (args[0] == prefix + 'search') {
                                            var toSearch = ""
                                            args.forEach(x => {
                                                if (x !== prefix + "search") {
                                                    toSearch = toSearch + x + " "
                                                }
                                            })
                                            toSearch = toSearch.slice(0, -1)
                                            var result = findByFilter(toSearch)
                                            console.log(result, toSearch)
                                            if (result.id) {
                                                var isProj = false
                                                var isHyped = false
                                                var isRare = false
                                                if (result.asset[7] == 1) {
                                                    isProj = true
                                                }
                                                if (result.asset[8] == 1) {
                                                    isHyped = true
                                                }
                                                if (result.asset[9] == 1) {
                                                    isRare = true
                                                }
                                                fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${result.id}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`).then(res => res.json()).then(res => {
                                                    var newEmbed = new MessageEmbed()
                                                        .setColor("WHITE")
                                                        .setTitle(`Search results for ${toSearch}`)
                                                        .setFooter({ text: "Aequet Trade Bot, " + version })
                                                        .setThumbnail(res.data[0].imageUrl)
                                                        .addFields({
                                                            name: "Name",
                                                            value: result.asset[0],
                                                            inline: false
                                                        }, {
                                                            name: "Asset ID",
                                                            value: result.id,
                                                            inline: false
                                                        }, {
                                                            name: "Acronym",
                                                            value: result.asset[1],
                                                            inline: false
                                                        }, {
                                                            name: "Rap",
                                                            value: JSON.stringify(result.asset[2]),
                                                            inline: false
                                                        }, {
                                                            name: "Value",
                                                            value: JSON.stringify(result.asset[4]),
                                                            inline: false
                                                        }, {
                                                            name: "Demand Score",
                                                            value: JSON.stringify(result.asset[5]),
                                                            inline: false
                                                        }, {
                                                            name: "Projected ?",
                                                            value: JSON.stringify(isProj),
                                                            inline: false
                                                        }, {
                                                            name: "Hyped ?",
                                                            value: JSON.stringify(isHyped),
                                                            inline: false
                                                        }, {
                                                            name: "Rare ?",
                                                            value: JSON.stringify(isRare),
                                                            inline: false
                                                        })
                                                    message.reply({ embeds: [newEmbed] })
                                                })

                                            } else {
                                                message.reply(`No result found for ${toSearch}.. :sob:`)
                                            }
                                        }
                                        if (args[0] == prefix + 'config') {
                                            if (message.author.id == config["Discord ID"]) {

                                                if (args[1] == "dm") {
                                                    if (!message.author.bot) {
                                                        message.author.send({
                                                            content: '```' + "Your config: " + '```', files: [{
                                                                attachment: "./configuration/config.json",
                                                                name: 'config.json'
                                                            }]
                                                        });
                                                        message.reply(`Successfully sent your config.json file into your dms!`)
                                                    }
                                                } else {
                                                    var tochange = args[1]

                                                    if (args[2] == "=") {
                                                        let before = config[tochange]

                                                        config[tochange] = args[3]
                                                        message.reply(`Changed config option ${before} to ${args[3]}.`)

                                                    } else if (args[3] == "=") {
                                                        let before = config[tochange][args[2]]
                                                        config[tochange][args[2]] = args[4]
                                                        message.reply(`Changed config option ${before} to ${args[4]}.`)

                                                    } else if (args[4] == "=") {
                                                        let before = config[tochange][args[2]][args[3]]
                                                        config[tochange][args[2]][args[3]] = args[5]
                                                        message.reply(`Changed config option ${before} to ${args[5]}.`)

                                                    }

                                                }


                                            }
                                        }

                                        if (args[0] == prefix + 'ms' || args[0] == prefix + 'mass_send') {
                                            if (message.author.id == config["Discord ID"]) {

                                                dont_send = true
                                                message.reply(`Mass sending.`)
                                                owners = []
                                                var give = JSON.parse(args[2])
                                                // console.log(give)
                                                var mqueue = []
                                                var musers = []
                                                setInterval(function () {
                                                    musers = []
                                                }, config["already sent interval"])
                                                setInterval(function () {
                                                    clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("MASS SEND")}] Mass send queue length is ${mqueue.length}! (${accinfo.Username}) (${accinfo.Username})`))
                                                }, 15000)

                                                function fetchOwners(cursor) {
                                                    var str = `https://inventory.roblox.com/v2/assets/${args[1]}/owners?limit=100&sortOrder=Desc`
                                                    if (cursor) {
                                                        str = str + `&cursor=${cursor}`
                                                    }
                                                    fetch(str, {
                                                        headers: {
                                                            cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                        }
                                                    }).then(res => res.json()).then(res => {
                                                        res.data.forEach(x => {
                                                            if (x.owner && musers.includes(x.owner.id) == false) {
                                                                // console.log(res)
                                                                var temp = {}


                                                                temp.items_send = give
                                                                temp.items_receive = [x.id]
                                                                temp.userid = x.owner.id


                                                                temp.UserType = "Mass_send"
                                                                mqueue.push(temp)
                                                                musers.push(x.owner.id)
                                                                // clog(chalk.red(`sending for a mass send user`))


                                                            }
                                                            t = t + config["milliseconds between sending trades"]

                                                            setTimeout(function () {
                                                                if (true) {
                                                                    var trade_info = mqueue.shift()
                                                                    // console.log(trade_info)

                                                                    if (trade_info !== undefined) {
                                                                        var username_receiver = trade_info.userid
                                                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("MASS SEND")}] Attempting to send to ${trade_info.userid}. (${accinfo.Username})`))
                                                                        if (proxies_enabled) {
                                                                            const random = Math.floor(Math.random() * proxies.length);
                                                                            // console.log(random, proxies[random]);
                                                                            (async () => {
                                                                                var proxyAgent = null
                                                                                var random2 = proxies[random]
                                                                                var https = false
                                                                                // console.log(random2.substring(0,4))
                                                                                if (random2.substring(0, 4) == 'http') {
                                                                                    https = true
                                                                                    proxyAgent = new HttpsProxyAgent(random2)

                                                                                } else {
                                                                                    https = true
                                                                                    proxyAgent = new HttpsProxyAgent(random2)
                                                                                }
                                                                                // console.log(proxyAgent)
                                                                                if (https) {
                                                                                    const response = await fetch('https://trades.roblox.com/v1/trades/send', {
                                                                                        agent: proxyAgent,
                                                                                        method: "POST",
                                                                                        headers: {
                                                                                            "Content-Type": "application/json",
                                                                                            "X-CSRF-TOKEN": xtoken,
                                                                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                        },
                                                                                        body: JSON.stringify({
                                                                                            "offers": [{
                                                                                                "userId": trade_info.userid,
                                                                                                "userAssetIds": trade_info.items_receive,
                                                                                                "robux": 0
                                                                                            },
                                                                                            {
                                                                                                "userId": accinfo.Userid,
                                                                                                "userAssetIds": trade_info.items_send,
                                                                                                "robux": 0
                                                                                            }
                                                                                            ]
                                                                                        })
                                                                                    });
                                                                                    const body = await response.json();
                                                                                    // console.log(body);

                                                                                    if (body.errors) {

                                                                                        if (body.errors[0].message == 'Token Validation Failed') {
                                                                                            rp(options).then(function () {

                                                                                            }).catch(function (err) {
                                                                                                xtoken = err.response.headers["x-csrf-token"]
                                                                                                mqueue.push(trade_info)

                                                                                            })
                                                                                        }
                                                                                        if (body.errors[0].message == 'TooManyRequests') {
                                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("MASS SEND")}] Failed to send to ${trade_info.userid}, too many requests. (${accinfo.Username})`))
                                                                                            mqueue.push(trade_info)
                                                                                        } waitForRatelimit = true
                                                                                        setTimeout(function () {
                                                                                            waitForRatelimit = false
                                                                                        }, config["Time after ratelimit"])
                                                                                        // console.log(p, giveassets)
                                                                                    } else {

                                                                                        usersent.push(trade_info.userid)


                                                                                        if (config["send notif when trade sent"] == true) {


                                                                                            trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                            trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                            trades_sent_int = trades_sent_int + 1

                                                                                            setTimeout(function () {



                                                                                                clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("MASS SEND")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.sumgive} vs ${trade_info.sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                trade_info.trade_id = body.id


                                                                                            }, 2000)






                                                                                        } else {
                                                                                            trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                            trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                            trades_sent_int = trades_sent_int + 1
                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("MASS SEND")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.sumgive} vs ${trade_info.sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                        }

                                                                                    }
                                                                                }
                                                                            })();
                                                                        } else {
                                                                            fetch("https://trades.roblox.com/v1/trades/send", {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    "Content-Type": "application/json",
                                                                                    "X-CSRF-TOKEN": xtoken,
                                                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                },
                                                                                body: JSON.stringify({
                                                                                    "offers": [{
                                                                                        "userId": trade_info.userid,
                                                                                        "userAssetIds": trade_info.items_receive,
                                                                                        "robux": 0
                                                                                    },
                                                                                    {
                                                                                        "userId": accinfo.Userid,
                                                                                        "userAssetIds": trade_info.items_send,
                                                                                        "robux": 0
                                                                                    }
                                                                                    ]
                                                                                })
                                                                            }).then(res => res.json()).then(res => {
                                                                                if (res.errors) {
                                                                                    if (res.errors[0].message == 'TooManyRequests') {
                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("MASS SEND")}] Too many requests while sending to ${trade_info.userid}. (${accinfo.Username})`))
                                                                                        mqueue.push(trade_info)

                                                                                    }
                                                                                    if (res.errors[0].message == 'Token Validation Failed') {
                                                                                        rp(options).then(function () {

                                                                                        }).catch(function (err) {
                                                                                            xtoken = err.response.headers["x-csrf-token"]
                                                                                            mqueue.push(trade_info)

                                                                                        })
                                                                                    }
                                                                                    // console.log(p, giveassets)
                                                                                } else {

                                                                                    usersent.push(trade_info.userid)


                                                                                    trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                    trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                    trades_sent_int = trades_sent_int + 1

                                                                                    setTimeout(function () {

                                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("MASS SEND")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(trade_info.userid)}! ${trade_info.sumgive} vs ${trade_info.sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                        trade_info.trade_id = res.id

                                                                                    }, 2000)


                                                                                }
                                                                            })
                                                                        }




                                                                    }

                                                                }
                                                            }, t)
                                                        })
                                                        // console.log(res.nextPageCursor)
                                                        if (cursor == null && res.data == undefined) {
                                                            setTimeout(function () {
                                                                fetchOwners(data.nextPageCursor);
                                                            }, 5000);
                                                        }
                                                        setTimeout(function () {
                                                            fetchOwners(res.nextPageCursor);
                                                        }, 5000);
                                                    })

                                                }
                                                fetchOwners(null);
                                            }

                                        }

                                        if (args[0] == prefix + "decline") {
                                            if (message.author.id == config["Discord ID"]) {
                                                fetch(`https://trades.roblox.com/v1/trades/${args[1]}/decline`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'X-CSRF-TOKEN': xtoken,
                                                        cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                    }
                                                }).then(res => res.json()).then(res => {
                                                    message.reply(`Successfully declined trade`)
                                                })
                                            }
                                        }

                                        if (message.content == prefix + 'mass_decline_inbounds' || message.content == prefix + 'mdi') {
                                            if (message.author.id == config["Discord ID"]) {
                                                fetch(
                                                    `https://trades.roblox.com/v1/trades/Inbound?sortOrder=Asc&limit=100`, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                    }
                                                }
                                                )
                                                    .then(res => res.json().catch(err => { }))
                                                    .then(data => {
                                                        message.reply(
                                                            'Declining ' + data.data.length + ' inbound trades.'
                                                        );
                                                        data.data.forEach(item => {
                                                            var id = item.id;
                                                            fetch(
                                                                `https://trades.roblox.com/v1/trades/${id}/decline`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'X-CSRF-TOKEN': xtoken,
                                                                    cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                                }
                                                            }
                                                            );
                                                        });
                                                    });
                                            }

                                        }
                                        if (message.content == prefix + 'mass_decline_outbounds' || message.content == prefix + 'mdo') {
                                            if (message.author.id == config["Discord ID"]) {
                                                var trades = []
                                                trades_sent.forEach(x => {
                                                    trades.push(x.trade_id)
                                                })
                                                fetch(
                                                    `https://trades.roblox.com/v1/trades/Outbound?sortOrder=Asc&limit=100`, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                    }
                                                }
                                                )
                                                    .then(res => res.json().catch(err => { }))
                                                    .then(data => {

                                                        data.data.forEach(item => {
                                                            var id = item.id;
                                                            trades.push(id)
                                                        });
                                                    });

                                                message.reply(
                                                    'Declining ' + trades.length + ' outbound trades.'
                                                );
                                                trades.forEach(x => {
                                                    fetch(
                                                        `https://trades.roblox.com/v1/trades/${x}/decline`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': xtoken,
                                                            cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                        }
                                                    }
                                                    );
                                                })
                                            }

                                        }
                                        if (message.content == prefix + 'clear_queue') {
                                            if (message.author.id == config["Discord ID"]) {
                                                queue = []
                                                message.reply("Cleared queue!")
                                            }
                                        }

                                        if (args[0] == prefix + 'logs' && message.author.id == config["Discord ID"]) {
                                            if (!fs.existsSync('things/debug.txt')) {
                                                message.reply("No log files found.")
                                            } else {
                                                message.reply("Log message:", {
                                                    files: [{
                                                        attachment: './debug.txt',
                                                        name: `log-${Date.now()}.txt`
                                                    }]
                                                })
                                            }


                                        }
                                        if (args[0] == prefix + 'proj' || args[0] == prefix + 'projected') {
                                            var id = parseInt(args[1])
                                            // console.log(id)
                                            if (projecteds.includes[id] || pricedata[id][1] < pricedata[id][2] - 50) {
                                                fetch(`https://www.roblox.com/item-thumbnails?params=[{assetId:${id}}]`, {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    },
                                                }).then(res => res.json()).then(ires => {
                                                    var img = ires[0].thumbnailUrl
                                                    var e = new MessageEmbed()
                                                        .setColor("FFAA00")
                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: img })
                                                        .setTitle(`Projected Detection for ${itemdata[id][0]}.`)
                                                        .setDescription(`${itemdata[id][0]} is PROJECTED ⚠`)
                                                        .addFields({
                                                            name: 'Price',
                                                            value: pricedata[id][1],
                                                            inline: true
                                                        }, {
                                                            name: 'Rap',
                                                            value: pricedata[id][2],
                                                            inline: true
                                                        })
                                                        .setTimestamp()

                                                    message.reply({ embeds: [e] })
                                                })

                                            } else {
                                                message.reply(`${itemdata[id][0]} is not marked as projected. ✅ (price: ${pricedata[id][1]}, rap: ${pricedata[id][2]})`)
                                                fetch(`https://www.roblox.com/item-thumbnails?params=[{assetId:${id}}]`, {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    },
                                                }).then(res => res.json()).then(ires => {
                                                    var img = ires[0].thumbnailUrl
                                                    var e = new MessageEmbed()
                                                        .setColor("13FF00")
                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: img })
                                                        .setTitle(`Projected Detection for ${itemdata[id][0]}.`)
                                                        .setDescription(`${itemdata[id][0]} is NOT projected ✅`)
                                                        .addFields({
                                                            name: 'Price',
                                                            value: pricedata[id][1],
                                                            inline: true
                                                        }, {
                                                            name: 'Rap',
                                                            value: pricedata[id][2],
                                                            inline: true
                                                        })
                                                        .setTimestamp()

                                                    message.reply({ embeds: [e] })
                                                })
                                            }
                                        }
                                        if (args[0] == prefix + 'ft' || args[0] == prefix + 'findtrade') {
                                            message.reply(`Finding trade combination with ${args[1]} <a:discordloading:939611204098330624>`).then(msg => {
                                                trade = FindTrade(parseInt(args[1]), "cmd", function (temp) {
                                                    var found = false
                                                    console.log(temp)
                                                    if (temp !== undefined) {
                                                        found = true
                                                        fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${parseInt(args[1])}&size=420x420&format=Png&isCircular=false`).then(res2 => res2.json()).then(res2 => {
                                                            var headshot = res2.data[0].imageUrl
                                                            fetch("https://api.roblox.com//users/" + parseInt(args[1])).then(res => res.json().catch(err => { }))
                                                                .then(u => {
                                                                    msg.edit(`Trade found with ${u.Username} 😼`)

                                                                    var e = new MessageEmbed()
                                                                        .setColor("008FFF")
                                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: headshot })
                                                                        .setDescription(`Trade found with ${u.Username}`)
                                                                        .addFields({
                                                                            name: 'Items you will GIVE ',
                                                                            value: temp.items_give_info,
                                                                            inline: true
                                                                        }, {
                                                                            name: 'Items you will get',
                                                                            value: temp.items_receive_info,
                                                                            inline: true
                                                                        }, {
                                                                            name: 'Value you will GIVE',
                                                                            value: temp.sumgive,
                                                                            inline: false
                                                                        }, {
                                                                            name: 'Value you will get',
                                                                            value: temp.sumget,
                                                                            inline: false
                                                                        }, {
                                                                            name: 'Trade Type',
                                                                            value: temp.trade_type,
                                                                            inline: false
                                                                        }, {
                                                                            name: '**Profit**',
                                                                            value: (temp.sumget - temp.sumgive),
                                                                            inline: true
                                                                        })

                                                                        .setTimestamp()
                                                                        .setFooter({ text: `Aequet trade bot | ${queue.length} trades in queue` })
                                                                    message.reply({ embeds: [e] })
                                                                })


                                                        })

                                                    } else {
                                                        msg.edit(`No trades found with ${args[1]}. 😔`)
                                                    }
                                                })
                                            })



                                        }

                                        if (args[0] == prefix + 'fts' || args[0] == prefix + 'findtradesend') {
                                            if (message.author.id == config["Discord ID"]) {

                                                message.reply(`Findin trade combination with ${args[1]} <a:discordloading:939611204098330624>`).then(msg => {
                                                    trade = FindTrade(parseInt(args[1]), "cmd", function (temp) {
                                                        // console.log(temp)
                                                        if (temp !== undefined) {
                                                            fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${parseInt(args[1])}&size=420x420&format=Png&isCircular=false`).then(res2 => res2.json()).then(res2 => {
                                                                var headshot = res2.data[0].imageUrl
                                                                fetch("https://api.roblox.com//users/" + parseInt(args[1])).then(res => res.json().catch(err => { }))
                                                                    .then(u => {
                                                                        msg.edit(`Trade found with ${u.Username}, SENDING! 😼`)

                                                                        var e = new MessageEmbed()
                                                                            .setColor("008FFF")
                                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: headshot })
                                                                            .setDescription(`Trade found with ${u.Username}`)
                                                                            .addFields({
                                                                                name: 'Items you will GIVE ',
                                                                                value: temp.items_give_info,
                                                                                inline: true
                                                                            }, {
                                                                                name: 'Items you will get',
                                                                                value: temp.items_receive_info,
                                                                                inline: true
                                                                            }, {
                                                                                name: 'Value you will GIVE',
                                                                                value: temp.sumgive,
                                                                                inline: false
                                                                            }, {
                                                                                name: 'Value you will get',
                                                                                value: temp.sumget,
                                                                                inline: false
                                                                            }, {
                                                                                name: 'Trade Type',
                                                                                value: temp.trade_type,
                                                                                inline: false
                                                                            }, {
                                                                                name: '**Profit**',
                                                                                value: (temp.sumget - temp.sumgive),
                                                                                inline: true
                                                                            })

                                                                            .setTimestamp()
                                                                            .setFooter({ text: `Aequet trade bot | ${queue.length} trades in queue` })

                                                                        message.reply({ embeds: [e] })

                                                                        sending = sendTrade(temp, function (data) {
                                                                            // console.log(data)
                                                                            if (data == "Sent") {
                                                                                message.reply(`Successfully sent trade to ${u.Username}! ✅`)
                                                                            } else if (data == "TMR") {
                                                                                message.reply(`Too many requests upon sending to ${u.Username}, rewriting to queue! 😿`)
                                                                            } else if (data == "TVF") {
                                                                                message.reply(`Token Validation Failed upon sending to ${u.Username}, rewriting to queue! 😿`)
                                                                            } else {
                                                                                message.reply(`Error upon sending trade to ${u.Username}.. Error: ${data.errors[0].message}`)
                                                                            }
                                                                        })

                                                                    })


                                                            })

                                                        } else {
                                                            msg.edit(`No trades found with ${args[1]}. 😔`)
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                        if (args[0] == prefix + 'stop') {
                                            if (message.author.id == config["Discord ID"]) {

                                                message.reply(`Stopped the bot. Use $restart to restart the bot!`)
                                                stopped = true

                                            }
                                        }
                                        if (args[0] == prefix + 'restart') {

                                            if (message.author.id == config["Discord ID"]) {

                                                message.reply(`Restarted the bot. Use $stop to stop the bot!`)
                                                stopped = false
                                            }
                                        }
                                        if (args[0] == prefix + 'blacklist' || args[0] == prefix + 'bl') {
                                            if (message.author.id == config["Discord ID"]) {
                                                Blacklisted_users.push(parseInt(args[1]))
                                                config.Blacklisted_users.push(parseInt(args[1]))
                                                fetch("https://api.roblox.com//users/" + args[1]).then(res => res.json().catch(err => { }))
                                                    .then(u => {
                                                        message.reply(`Successfully blacklisted ${u.Username}`)
                                                    })
                                            }
                                        }

                                        if (args[0] == prefix + 'DoNotTrade' || args[0] == prefix + 'dnt') {
                                            if (message.author.id == config["Discord ID"]) {
                                                DoNotTrade.push(parseInt(args[1]))
                                                message.reply(`Added ${itemdata[args[1]][0]} to your do not trade list`)
                                            }
                                        }

                                        if (args[0] == prefix + 'DoNotGet' || args[0] == prefix + 'dng') {
                                            if (message.author.id == config["Discord ID"]) {
                                                DoNotGet.push(parseInt(args[1]))
                                                message.reply(`Added ${itemdata[args[1]][0]} to your do not get list`)

                                            }
                                        }

                                        if (args[0] == prefix + 'rate_fit' || args[0] == prefix + 'rf') {
                                            var rate = randomIntFromInterval(0, 10)
                                            var color = null
                                            var comment = null
                                            if (rate <= 2) {
                                                color = "FF0000"
                                                comment = "very VERY ugly avatar... L BOZO"
                                            }
                                            if (rate > 2 && rate <= 5) {
                                                color = "FFCE06"
                                                comment = "this avatar is kinda ugly.."
                                            }
                                            if (rate > 5 && rate <= 6) {
                                                color = "CAFF06"
                                                comment = "cool but you could do better.."
                                            }
                                            if (rate > 6 && rate <= 9) {
                                                color = "11FF06"
                                                comment = "nice avatar!!!"
                                            }
                                            if (rate == 10) {
                                                color = "00D4FF"
                                                comment = "hey um.. wanna date? :heart_eyes_cat:"
                                            }
                                            fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${args[1]}&size=420x420&format=Png&isCircular=false`).then(res => res.json()).then(res => {
                                                var newEmbed = new MessageEmbed()
                                                    .setColor(color)
                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                    .addField(
                                                        "Comment",
                                                        "```" + comment + "```",
                                                        false
                                                    )
                                                    .addField(
                                                        "Grade",
                                                        "```" + rate + "/10" + "```",
                                                        false
                                                    )
                                                    .setThumbnail(res.data[0].imageUrl)
                                                message.reply({ embeds: [newEmbed] })
                                            })

                                        }

                                        if (args[0] == prefix + 'fuck_inbounds' || args[0] == prefix + 'fi') {
                                            if (message.author.id == config["Discord ID"]) {
                                                var username = null
                                                fetch("https://api.roblox.com//users/" + args[1]).then(res => res.json().catch(err => { }))
                                                    .then(u => {
                                                        username = u.Username
                                                        message.reply(`Finding trade with ${u.Username}.`)
                                                    })
                                                var t2 = 2500
                                                var trade = FindTrade(args[1], "fi", function (temp) {

                                                    if (temp.userid) {

                                                        var e = new MessageEmbed()
                                                            .setColor("008FFF")
                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                            .setDescription(`Trade found with ${username}`)
                                                            .addFields({
                                                                name: 'Items you will GIVE ',
                                                                value: temp.items_give_info,
                                                                inline: true
                                                            }, {
                                                                name: 'Items you will get',
                                                                value: temp.items_receive_info,
                                                                inline: true
                                                            }, {
                                                                name: 'Value you will GIVE',
                                                                value: temp.sumgive,
                                                                inline: false
                                                            }, {
                                                                name: 'Value you will get',
                                                                value: temp.sumget,
                                                                inline: false
                                                            }, {
                                                                name: 'Trade Type',
                                                                value: temp.trade_type,
                                                                inline: false
                                                            }, {
                                                                name: '**Profit**',
                                                                value: (temp.sumget - temp.sumgive),
                                                                inline: true
                                                            })

                                                            .setTimestamp()
                                                            .setFooter({ text: `Aequet trade bot | ${queue.length} trades in queue` })

                                                        message.reply({ embeds: [e] })

                                                        dont_send = true
                                                        var x = parseInt(args[2])
                                                        if (x == undefined) {
                                                            x = 20
                                                        }
                                                        // console.log(x, args[1])
                                                        for (i = 0; i < x; i++) {
                                                            t2 = t2 + 2500

                                                            setTimeout(function () {

                                                                sendTrade(temp, function (dtrade) {
                                                                    if (dtrade == "Sent") {
                                                                        clog(chalk.green(`[${chalk.white("Fuck inbounds")}] Successfully sent trade to ${args[1]}! (${accinfo.Username})`))
                                                                    } else {
                                                                        if (dtrade == "TMR") {
                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Fuck inbounds")}] Failed do send trade to ${args[1]}, too many requests ! :sob: (${accinfo.Username})`))
                                                                        } else {
                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Fuck inbounds")}] Failed do send trade to ${args[1]} ! :sob: (${accinfo.Username})`))
                                                                        }
                                                                    }
                                                                })
                                                            }, t2)
                                                        }



                                                    } else {
                                                        message.reply(`No trades found with ${username}. 🙄`)



                                                    }
                                                })
                                            }
                                        }

                                        if (message.content == prefix + 'scan_db' || message.content == prefix + 'scan_database') {
                                            if (message.author.id == config["Discord ID"]) {
                                                scanDataBase()
                                                message.reply("Scanning DataBase users. ")
                                            }
                                        }
                                        var outboundsInt = 0
                                        var scurosr2
                                        if (message.content == prefix + 'count_outbounds' || message.content == prefix + 'co') {
                                            if (message.author.id == config["Discord ID"]) {
                                                message.reply("Counting outbounds. Please wait 😲")

                                                function countOutbounds(cursor) {
                                                    var str = `https://trades.roblox.com/v1/trades/outbound?cursor=&limit=100&sortOrder=Desc`
                                                    if (cursor) {
                                                        str = str + `&cursor=${cursor}`
                                                    }
                                                    fetch(str, {
                                                        headers: {
                                                            cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                        }
                                                    }).then(res => res.json()).then(res => {
                                                        if (!res.errors) {
                                                            scurosr2 = res.nextPageCursor

                                                            res.data.forEach(x => {
                                                                outboundsInt = outboundsInt + 1
                                                            })
                                                            // console.log(res.nextPageCursor)
                                                            if (cursor == null && res.data == undefined) {
                                                                setTimeout(function () {
                                                                    countOutbounds(data.nextPageCursor);
                                                                }, 2000);
                                                            }
                                                            console.log(outboundsInt)
                                                            if (res.nextPageCursor == null) {
                                                                console.log(outboundsInt)
                                                                message.reply(`You have ${outboundsInt} outbound trades`)
                                                            }
                                                            setTimeout(function () {
                                                                countOutbounds(res.nextPageCursor);
                                                            }, 500);
                                                        } else {
                                                            console.log("too many requests while trying to count outboudns; waiting 20 seconds..")
                                                            setTimeout(function () {
                                                                setTimeout(function () {

                                                                    countOutbounds(scurosr2);
                                                                }, 500);
                                                            }, 10000)
                                                        }
                                                    })

                                                }
                                                countOutbounds(null);

                                            }
                                        }
                                        var inboundsInt = 0
                                        var scursor = null
                                        if (message.content == prefix + 'count_inbounds' || message.content == prefix + 'ci') {
                                            if (message.author.id == config["Discord ID"]) {
                                                message.reply("Counting inbounds. Please wait 😲")

                                                function countInbounds(cursor) {
                                                    var str = `https://trades.roblox.com/v1/trades/outbound?cursor=&limit=100&sortOrder=Desc`
                                                    if (cursor) {
                                                        str = str + `&cursor=${cursor}`
                                                    }
                                                    fetch(str, {
                                                        headers: {
                                                            cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                        }
                                                    }).then(res => res.json()).then(res => {
                                                        if (!res.errors) {
                                                            scursor = res.nextPageCursor

                                                            res.data.forEach(x => {

                                                                inboundsInt = inboundsInt + 1
                                                            })
                                                            // console.log(res.nextPageCursor)
                                                            if (cursor == null && res.data == undefined) {
                                                                setTimeout(function () {
                                                                    countInbounds(data.nextPageCursor);
                                                                }, 2000);
                                                            }
                                                            if (res.nextPageCursor == null) {
                                                                message.reply(`You have ${inboundsInt} inbound trades`)
                                                            }
                                                            setTimeout(function () {
                                                                countInbounds(res.nextPageCursor);
                                                            }, 500);
                                                        } else {
                                                            console.log("too many requests while trying to count outboudns; waiting 10 seconds..")
                                                            setTimeout(function () {
                                                                setTimeout(function () {

                                                                    countInbounds(scursor);
                                                                }, 500);
                                                            }, 10000)
                                                        }
                                                    })


                                                }
                                                countInbounds(null);
                                            }
                                        }
                                        if (message.content == prefix + 'info' || message.content == prefix + 'i') {
                                            var newEmbed = new MessageEmbed()
                                                .setColor("008FFF")
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                .setDescription(`Account Info for ${accinfo.Username}`)
                                                .addField(
                                                    "RAP", "```" + accworthrap + "```", false
                                                )
                                                .addField(
                                                    "Value", "```" + accworthval + "```", false
                                                )
                                                .addField(
                                                    "Limiteds Count", "```" + accworthlims + "```", false
                                                )
                                                .addField(
                                                    "Robux Balance", "```" + accinfo.RobuxBalance + "```", false
                                                )

                                            message.reply({ embeds: [newEmbed] })
                                        }

                                        if (args[0] == prefix + 'a' || args[0] == prefix + 'accept') {
                                            if (message.author.id == config["Discord ID"]) {

                                                message.reply(`Accepting trade. :grin:`)
                                                fetch("https://trades.roblox.com/v1/trades/" + args[1] + "/accept", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "X-CSRF-TOKEN": xtoken,
                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                    },
                                                }).then(res => res.json()).then(res => {
                                                    var newEmbed = new MessageEmbed()
                                                        .setColor("008FFF")
                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                        .setDescription(`Accepted trade!`)
                                                        .addField(
                                                            "Response", "```" + JSON.stringify(res) + "```", false
                                                        )


                                                    message.reply({ embeds: [newEmbed] })
                                                })
                                            }

                                        }

                                        if (args[0] == prefix + 'view_trade' || args[0] == prefix + 'vt') {
                                            fetch("https://trades.roblox.com/v1/trades/" + args[1], {
                                                method: "GET",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "X-CSRF-TOKEN": xtoken,
                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                },
                                            }).then(res => res.json()).then(res => {

                                                if (res.status == "Open") {

                                                    var sumgive = 0
                                                    var sumget = 0
                                                    var rapgive = 0
                                                    var rapget = 0
                                                    var itemsget = []
                                                    var itemsgive = []

                                                    var percentage = 0
                                                    res.offers[1].userAssets.forEach(u => {

                                                        var ui = u.assetId
                                                        var val = itemdata[ui][3]
                                                        var neartier = findNearestTier(itemdata[ui][2])

                                                        // console.log(pricedata[ui])
                                                        if (projecteds.includes(ui) || pricedata[ui][1] < pricedata[ui][2] - 95) {
                                                            // console.log(itemdata[ui][0] + ' is projected.')

                                                            if (config["Value projected at their price"]) {
                                                                sumget = (sumget + pricedata[ui][1])
                                                                rapget = (rapget + pricedata[ui][1])
                                                            } else {
                                                                sumget = sumget + (itemdata[ui][4])
                                                                rapget = Math.round(rapget + (itemdata[ui][2]))
                                                            }



                                                            itemsget.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) ⚠`)


                                                        } else if (val > neartier && proof_based.includes(ui) == false) {

                                                            itemsget.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) 🔻`)

                                                            sumget = (sumget + (itemdata[ui][4]))
                                                            rapget = rapget + (itemdata[ui][2])



                                                        } else {
                                                            sumget = (sumget + (itemdata[ui][4]))
                                                            rapget = rapget + (itemdata[ui][2])
                                                            itemsget.push(`${itemdata[ui][0]} (${itemdata[ui][4]})`)

                                                        }

                                                    })

                                                    res.offers[0].userAssets.forEach(u => {
                                                        let ui = u.assetId
                                                        var val = itemdata[ui][3]
                                                        var neartier = findNearestTier(itemdata[ui][2])
                                                        if (custom_values_send[ui]) {
                                                            if (custom_values_send[ui].charAt(0) == "+") {
                                                                sumgive = sumgive + (itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", "")))
                                                                rapgive = rapgive + itemdata[ui][2]
                                                                itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", ""))}`)
                                                            } else if (custom_values_send[ui].charAt(0) == "-") {
                                                                sumgive = sumgive + (itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", "")))
                                                                rapgive = rapgive + itemdata[ui][2]
                                                                itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) 🛠 : ${itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", ""))}`)
                                                            } else {
                                                                sumgive = sumgive + custom_values_send[ui]
                                                                rapgive = rapgive + itemdata[ui][2]
                                                                itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) 🛠 : ${custom_values_send[ui]}`)
                                                            }

                                                        } else {

                                                            if (projecteds.includes(ui)) {
                                                                // console.log(itemdata[ui][0] + " is underpriced")
                                                                // console.log(itemdata[ui][0] + ' is projected.')
                                                                sumgive = (sumgive + (itemdata[ui][4]))
                                                                rapgive = (rapgive + (itemdata[ui][2]))

                                                                itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) ⚠`)

                                                            } else {
                                                                if (val > neartier && proof_based.includes(ui) == false) {
                                                                    itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]}) 🔻`)


                                                                    sumgive = (sumgive + (itemdata[ui][4]))
                                                                    rapgive = rapgive + (itemdata[ui][2])


                                                                } else {
                                                                    sumgive = sumgive + itemdata[ui][4]
                                                                    rapgive = rapgive + itemdata[ui][2]
                                                                    itemsgive.push(`${itemdata[ui][0]} (${itemdata[ui][4]})`)

                                                                }


                                                            }
                                                        }
                                                    })
                                                    percentage = Math.round(((sumget - sumgive) / sumgive) * 100)

                                                    var newEmbed = new MessageEmbed()
                                                        .setAuthor({
                                                            name: res.user.name + `(${accinfo.Username})`
                                                            ,
                                                            iconURL: 'https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                res.user.id +
                                                                '&width=420&height=420&format=png'
                                                        })
                                                        .setColor(config["Trade sent color"])
                                                        .setDescription(`Trade with ${res.user.name}, Trade id : ${res.id}`)
                                                        .addFields({
                                                            name: 'Items Sent',
                                                            value: itemsgive,
                                                            inline: true
                                                        }, {
                                                            name: 'Items you will get',
                                                            value: itemsget,
                                                            inline: true
                                                        }, {
                                                            name: 'Value Sent',
                                                            value: sumgive,
                                                            inline: false
                                                        }, {
                                                            name: 'Value you will get',
                                                            value: sumget,
                                                            inline: false
                                                        }, {
                                                            name: '**Profit**',
                                                            value: "```" + (sumget - sumgive) + ` (%${percentage})` + "```",
                                                            inline: true
                                                        })
                                                        .setTimestamp()
                                                        .setFooter({ text: `Aequet trade bot | ${queue.length} trades in queue` })


                                                    message.reply({ embeds: [newEmbed] })
                                                } else {
                                                    message.reply(`Trade is inactive!`)
                                                }

                                            })

                                        }
                                        if (args[0] == prefix + "playsound" && message.author.id == config["Discord ID"]) {
                                            if (args[1] == "roi") {
                                                player.play('./things/roi.mp3', (err) => {
                                                    if (err) console.log(`Could not play sound: ${err}`);
                                                });
                                            }
                                        }
                                        if (message.content == prefix + 'clear_cooldown') {
                                            if (message.author.id == config["Discord ID"]) {
                                                already_sent = []
                                                // console.log(already_sent)
                                                fs.writeFile("json/already_sent.json", JSON.stringify(already_sent), function (err) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                });
                                                message.reply("Cleared already sent array!")

                                            }
                                        }
                                        if (message.content == prefix + 'version' || message.content == prefix + 'ver') {
                                            var newEmbed = new MessageEmbed()
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                .setDescription(`Aequet Trade Bot Version : ${version}`)
                                                .setColor("008FFF")
                                                .setTimestamp()

                                            message.reply({ embeds: [newEmbed] })

                                        }
                                        if (message.content == prefix + 'dont_send') {
                                            if (message.author.id == config["Discord ID"]) {
                                                dont_send = true
                                                message.reply("Bot will only queue trades. To disable, use $yes_send.")
                                            }
                                        }
                                        if (message.content == prefix + 'yes_send') {
                                            if (message.author.id == config["Discord ID"]) {
                                                dont_send = false
                                                message.reply("Bot will now send trades. To disable, use $dont_send.")
                                            }
                                        }
                                        if (message.content == prefix + 'only_send') {
                                            if (message.author.id == config["Discord ID"]) {

                                                queue_trades = false
                                                message.reply("Bot will now only send trades. Use " + prefix + "queue_trades to queue trades again")
                                            }
                                        }
                                        if (message.content == prefix + 'queue_trades') {
                                            if (message.author.id == config["Discord ID"]) {

                                                queue_trades = true
                                                message.reply("Bot will now queue trades.")
                                            }
                                        }
                                        if (message.content == prefix + 'test') {
                                            var newEmbed = new MessageEmbed()
                                                .setColor("FFFFFF")
                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                .addField(
                                                    `adadsasd vefrzfzEF ZEF`,
                                                    `f \n aefiefiei 😍 \r s`,
                                                    false
                                                )
                                            message.reply({ embeds: [newEmbed] })

                                        }
                                    })

                                    // Inbound Checker


                                    // Inbound checker Loop

                                    setTimeout(function () {
                                        setInterval(function () {
                                            var y = 0
                                            if (config["Check inbounds"] == true) {
                                                fetch(
                                                    `https://trades.roblox.com/v1/trades/Inbound?sortOrder=Desc&limit=25`, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                    }
                                                }
                                                )
                                                    .then(res => res.json().catch(err => { }))
                                                    .then(data => {
                                                        if (!data.errors) {

                                                            data.data.forEach(item => {
                                                                if (!viewed1.includes(item.id)) {

                                                                    viewed1.push(item.id)



                                                                    y = y + 2000

                                                                    if (config["Counter inbounds"] == true) {
                                                                        users_to_find.push(item.user.id)
                                                                    }
                                                                    var id = item.id;

                                                                    setTimeout(function () {
                                                                        if (true) {
                                                                            fetch(`https://trades.roblox.com/v1/trades/` + id, {
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    cookie: '.ROBLOSECURITY=' + cookie + ';'
                                                                                }
                                                                            })
                                                                                .then(res => res.json().catch(err => { }))
                                                                                .then(da => {
                                                                                    if (!da.errors) {
                                                                                        var sumhold = null;
                                                                                        var raphold = null;
                                                                                        var give = [];
                                                                                        var gett = [];
                                                                                        var stopme = false

                                                                                        var itemsids_give = []
                                                                                        var itemsids_get = []
                                                                                        var sumget = 0;
                                                                                        var rapgive = 0;
                                                                                        var cont = false;
                                                                                        var rapget = 0;
                                                                                        var hasrare = false;
                                                                                        var hasrapitem = false;
                                                                                        // console.log(da)

                                                                                        // CE N'est pas "get" mais "give".
                                                                                        da.offers[0].userAssets.forEach(ua => {
                                                                                            if (DoNotTrade.includes(ua.assetId)) {
                                                                                                // console.log(true)
                                                                                                stopme = true
                                                                                            }
                                                                                            itemsids_get.push(ua.assetId)
                                                                                            if (custom_values_send[ua.assetId]) {
                                                                                                if (custom_values_send[ua.assetId].charAt(0) == "+") {
                                                                                                    // console.log(itemdata[ua.assetId][4] + parseInt(custom_values_send[ua.assetId].replace("+", "")))
                                                                                                    sumget = sumget + (itemdata[ua.assetId][4] + parseInt(custom_values_send[ua.assetId].replace("+", "")))
                                                                                                    rapget = rapget + itemdata[ua.assetId][2]
                                                                                                    gett.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(itemdata[ua.assetId][4] + parseInt(custom_values_send[ua.assetId].replace("+", "")))}`
                                                                                                    );
                                                                                                } else if (custom_values_send[ua.assetId].charAt(0) == "-") {
                                                                                                    sumget = sumget + (itemdata[ua.assetId][4] - parseInt(custom_values_send[ua.assetId].replace("-", "")))
                                                                                                    rapget = rapget + itemdata[ua.assetId][2]
                                                                                                    gett.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(itemdata[ua.assetId][4] + parseInt(custom_values_send[ua.assetId].replace("+", "")))}`
                                                                                                    );
                                                                                                } else {
                                                                                                    sumget = sumget + parseInt(custom_values_send[ua.assetId])
                                                                                                    rapget = rapget + itemdata[ua.assetId][2]
                                                                                                    gett.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(custom_values_send[ua.assetId])}`
                                                                                                    );
                                                                                                }
                                                                                            } else {
                                                                                                if (projecteds.includes(JSON.stringify(ua.assetId)) == true) {
                                                                                                    sumget = sumget + itemdata[ua.assetId + ''][4] * config["owned projected ratio"];
                                                                                                    rapget = rapget + ua.recentAveragePrice * config["owned projected ratio"];

                                                                                                    gett.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        c(itemdata[ua.assetId + ''][4] * config["owned projected ratio"]) + ' ⚠ (price : ' + pricedata[ua.assetId][1] + ')'
                                                                                                    );
                                                                                                } else {
                                                                                                    sumget = sumget + itemdata[ua.assetId + ''][4];
                                                                                                    rapget = rapget + ua.recentAveragePrice;

                                                                                                    gett.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        c(itemdata[ua.assetId + ''][4])
                                                                                                    );
                                                                                                }



                                                                                                if (da.offers[0].user.name != accinfo.Username) {
                                                                                                    if (
                                                                                                        sumget + itemdata[ua.assetId + ''][4] ==
                                                                                                        -1
                                                                                                    ) {
                                                                                                        hasrapitem = true;
                                                                                                    }
                                                                                                }
                                                                                                if (itemdata[ua.assetId + ''][9] == 1) {
                                                                                                    hasrare = true;
                                                                                                }

                                                                                            }

                                                                                        });
                                                                                        var sumgive = 0;

                                                                                        // ce nest pas give mais get.
                                                                                        da.offers[1].userAssets.forEach(ua => {
                                                                                            if (DoNotGet.includes(ua.assetId)) {
                                                                                                // console.log(true)
                                                                                                stopme = true
                                                                                            }
                                                                                            itemsids_give.push(ua)
                                                                                            if (custom_values_receive[ua.assetId]) {
                                                                                                if (custom_values_receive[ua.assetId].charAt(0) == "+") {
                                                                                                    sumgive = sumgive + (itemdata[ua.assetId][4] + parseInt(custom_values_receive[ua.assetId].replace("+", "")))
                                                                                                    rapgive = rapgive + itemdata[ua.assetId][2]
                                                                                                    give.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(itemdata[ua.assetId][4] + parseInt(custom_values_receive[ua.assetId].replace("+", "")))}`
                                                                                                    );
                                                                                                } else if (custom_values_receive[ua.assetId].charAt(0) == "-") {
                                                                                                    sumgive = sumgive + (itemdata[ua.assetId][4] - parseInt(custom_values_receive[ua.assetId].replace("-", "")))
                                                                                                    rapgive = rapgive + itemdata[ua.assetId][2]
                                                                                                    give.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(itemdata[ua.assetId][4] + parseInt(custom_values_receive[ua.assetId].replace("+", "")))}`
                                                                                                    );
                                                                                                } else {
                                                                                                    sumgive = sumgive + parseInt(custom_values_receive[ua.assetId])
                                                                                                    rapgive = rapgive + itemdata[ua.assetId][2]
                                                                                                    give.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        `${c(itemdata[ua.assetId][4])} 🛠 ${c(custom_values_receive[ua.assetId])}`
                                                                                                    );
                                                                                                }
                                                                                            } else {
                                                                                                if (projecteds.includes(JSON.stringify(ua.assetId)) == true || itemdata[ua.assetId][67] == 1) {
                                                                                                    sumgive = sumgive + itemdata[ua.assetId][4] * config["Projected ratio"]
                                                                                                    give.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        c(itemdata[ua.assetId + ''][4]) + ' ⚠ (price : ' + pricedata[ua.assetId][1] + ')'
                                                                                                    );
                                                                                                } else {
                                                                                                    sumgive = sumgive + itemdata[ua.assetId][4]

                                                                                                    give.push(
                                                                                                        ua.name +
                                                                                                        ' : ' +
                                                                                                        c(itemdata[ua.assetId + ''][4])
                                                                                                    );
                                                                                                }

                                                                                                if (itemdata[ua.assetId + ''][9] == 1) {
                                                                                                    hasrare = true;
                                                                                                }

                                                                                                if (da.offers[0].user.name != accinfo.Username) {
                                                                                                    if (
                                                                                                        sumget + itemdata[ua.assetId + ''][4] ==
                                                                                                        -1
                                                                                                    ) {
                                                                                                        hasrapitem = true;
                                                                                                    }
                                                                                                }


                                                                                            }

                                                                                        });

                                                                                        sumgive = sumgive + da.offers[1].robux;

                                                                                        sumget = sumget + da.offers[0].robux;
                                                                                        rapgive = rapgive + da.offers[1].robux;

                                                                                        rapget = rapget + da.offers[0].robux;
                                                                                        if (da.offers[0].robux > 0) {
                                                                                            gett.push('Robux : ' + c(da.offers[0].robux));
                                                                                        }
                                                                                        if (da.offers[1].robux > 0) {
                                                                                            give.push('Robux : ' + c(da.offers[1].robux));
                                                                                        }
                                                                                        if (da.offers[0].user.name == accinfo.Username) {
                                                                                            sumhold = sumget;
                                                                                            sumget = sumgive;
                                                                                            sumgive = sumhold;
                                                                                            raphold = rapget;
                                                                                            rapget = rapgive;
                                                                                            rapgive = raphold;
                                                                                            itemhold = gett;
                                                                                            gett = give;
                                                                                            give = itemhold;



                                                                                        }
                                                                                        // clog("You give " + sumgive + " and receive " + sumget);


                                                                                        // clog("You give " + sumgive + " and receive " + sumget);
                                                                                        // clog(viewed1.trades[id]);


                                                                                        // console.log(sumgive, sumget, sumgive > sumget)
                                                                                        // console.log(id + " DECLINE")
                                                                                        var row = new MessageActionRow()
                                                                                            .addComponents(
                                                                                                new MessageButton()
                                                                                                    .setCustomId(id + " ACCEPT")
                                                                                                    .setLabel("Accept")
                                                                                                    .setStyle("SUCCESS")
                                                                                                    .setEmoji("✅")
                                                                                            )
                                                                                            .addComponents(
                                                                                                new MessageButton()
                                                                                                    .setCustomId(id + " DECLINE")
                                                                                                    .setLabel("Decline")
                                                                                                    .setStyle("DANGER")
                                                                                                    .setEmoji("❌")
                                                                                            )
                                                                                        if (sumgive > sumget) {
                                                                                            var i = new MessageEmbed()
                                                                                                .setColor("#E65454")
                                                                                                .setTimestamp()
                                                                                                .setTitle(`Trade inbound from ${item.user.name}`)
                                                                                                .setDescription("**Trade** 🆔\n" + "` " + id + "`")
                                                                                                .addFields({
                                                                                                    name: "**Value you will give** 🔵",
                                                                                                    value: "```" + c(Math.round(sumgive)) + "```",
                                                                                                    inline: true
                                                                                                },
                                                                                                    {
                                                                                                        name: "**Value Requested** 🟠",
                                                                                                        value: "```" + c(Math.round(sumget)) + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Profit** ✅",
                                                                                                        value: "```" + Math.round(sumget - sumgive) + " (" + "%" + Math.round(((sumget - sumgive) / sumgive) * 100) + ")```",
                                                                                                        inline: false
                                                                                                    },
                                                                                                    {
                                                                                                        name: "**Items sent 🟦**",
                                                                                                        value: "```" + give.join('\n') + "```",
                                                                                                        inline: false
                                                                                                    }, {
                                                                                                    name: "**Items requested 🟧**",
                                                                                                    value: "```" + gett.join('\n') + "```",
                                                                                                    inline: false
                                                                                                })
                                                                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                    item.user.id +
                                                                                                    '&width=420&height=420&format=png')

                                                                                            if (config["Notify Inbound Losses"] == true) {
                                                                                                client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send({ embeds: [i], components: [row] })

                                                                                            }
                                                                                            if (config["Decline inbound losses"] == true) {
                                                                                                fetch(
                                                                                                    `https://trades.roblox.com/v1/trades/${id}/decline`, {
                                                                                                    method: 'POST',
                                                                                                    headers: {
                                                                                                        'Content-Type': 'application/json',
                                                                                                        'X-CSRF-TOKEN': xtoken,
                                                                                                        cookie: '.ROBLOSECURITY=' +
                                                                                                            cookie +
                                                                                                            ';'
                                                                                                    }
                                                                                                }
                                                                                                )
                                                                                                    .then(res =>
                                                                                                        res.json().catch(err => { })
                                                                                                    )
                                                                                                    .then(idata => {
                                                                                                        // console.log(res)
                                                                                                        if (
                                                                                                            da.offers[0].user.name ==
                                                                                                            accinfo.Username
                                                                                                        ) {


                                                                                                        }
                                                                                                        // clog("Declined");
                                                                                                        // clog(idata);
                                                                                                    })
                                                                                            }



                                                                                        } else if (sumgive < sumget) {
                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Win Inbound"][0], config["Console Trade Color"]["Win Inbound"][1], config["Console Trade Color"]["Win Inbound"][2])(`[${chalk.white("Inbounds")}] Win inbound detected! ${sumgive} vs ${sumget}. (${accinfo.Username})`))
                                                                                            if (sumgive * config["ping if inbound is win above ratio"] < sumget) {

                                                                                                var newEmbed = new MessageEmbed()
                                                                                                    .setColor("#58E654")
                                                                                                    .setTimestamp()
                                                                                                    .setTitle(`Trade inbound win from ${item.user.name}`)
                                                                                                    .setDescription("**Trade** 🆔\n" + "` " + id + "`")
                                                                                                    .addFields({
                                                                                                        name: "**Value you will give** 🔵",
                                                                                                        value: "```" + c(sumgive) + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                        {
                                                                                                            name: "**Value Requested** 🟠",
                                                                                                            value: "```" + c(sumget) + "```",
                                                                                                            inline: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Profit** ✅",
                                                                                                            value: "```" + (sumget - sumgive) + " (" + "%" + Math.round(((sumget - sumgive) / sumgive) * 100) + ")```",
                                                                                                            inline: false
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Items sent 🟦**",
                                                                                                            value: "```" + give.join('\n') + "```",
                                                                                                            inline: false
                                                                                                        }, {
                                                                                                        name: "**Items requested 🟧**",
                                                                                                        value: "```" + gett.join('\n') + "```",
                                                                                                        inline: false
                                                                                                    })
                                                                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                        item.user.id +
                                                                                                        '&width=420&height=420&format=png')
                                                                                                client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send({ embeds: [newEmbed], components: [row] })
                                                                                                client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send(`<@${config["Discord ID"]}>`)

                                                                                                if (config["Auto Accept Inbounds"] == true && stopme == false && sumgive * config["Inbound Auto Accept Ratio"] < sumget) {
                                                                                                    client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send(`Accepting trade inbound above.. (trade id: ${id})`)
                                                                                                    fetch("https://trades.roblox.com/v1/trades/" + id + "/accept", {
                                                                                                        method: "POST",
                                                                                                        headers: {
                                                                                                            "Content-Type": "application/json",
                                                                                                            "X-CSRF-TOKEN": xtoken,
                                                                                                            cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                                        },
                                                                                                    }).then(ares => ares.json()).then(ares => {
                                                                                                        if (ares.errors) {
                                                                                                            client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send(`Failed to accept trade inbound, accept trade request response : ${ares.errors}`)

                                                                                                        } else {
                                                                                                            client.channels.cache.get("" + config["Trade Inbound Channel"] + "").send(`Accepted inbound trade from ${item.user.name}, ${c(sumgive)} vs ${c(sumget)}. ID: ${id}.`)

                                                                                                        }

                                                                                                        console.log(ares)
                                                                                                    })

                                                                                                }

                                                                                            }
                                                                                        }
                                                                                    }




                                                                                });
                                                                        }

                                                                    }, y)


                                                                }

                                                            });
                                                        }
                                                    });
                                            }

                                        }, 15000)


                                    }, 5000)

                                    // Interactions

                                    client.on('interactionCreate', interaction => {
                                        if (!interaction.isButton()) return;
                                        // console.log(interaction);
                                        // interaction.reply(interaction.user.id + " " + interaction.customId)

                                        if (interaction.customId.includes("DECLINE") == true && interaction.user.id == config["Discord ID"]) {

                                            var tradeID = parseInt(interaction.customId.replace(" DECLINE", ""))
                                            interaction.reply("Declining Trade " + tradeID + ".")

                                            fetch("https://trades.roblox.com/v1/trades/" + tradeID + "/decline", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "X-CSRF-TOKEN": xtoken,
                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                },
                                            }).then(declineRes => declineRes.json()).then(declineRes => {
                                                console.log(declineRes)
                                                if (!declineRes.errors) {
                                                    client.channels.cache.get("" + interaction.message.channelId + "").send(`<@${interaction.user.id}> successfully declined trade ${tradeID}!`)

                                                } else {
                                                    client.channels.cache.get("" + interaction.message.channelId + "").send(`<@${interaction.user.id}> Error while declining trade ${tradeID}! Error: ${declineRes.errors[0].message}`)

                                                }
                                            })
                                        } else if (interaction.user.id !== config["Discord ID"] && interaction.customId.includes("DECLINE") == true) {

                                            interaction.reply(`<@${interaction.user.id}> You do not have the permission to decline this trade.`)

                                        }


                                        if (interaction.customId.includes("ACCEPT") == true && interaction.user.id == config["Discord ID"]) {
                                            var tradeID = parseInt(interaction.customId.replace(" ACCEPT", ""))
                                            var row = new MessageActionRow()
                                                .addComponents(
                                                    new MessageButton()
                                                        .setCustomId(tradeID + " CONFIRM")
                                                        .setLabel("Yes")
                                                        .setStyle("SUCCESS")
                                                        .setEmoji("✅")
                                                )
                                                .addComponents(
                                                    new MessageButton()
                                                        .setCustomId(tradeID + " NotConfirmed")
                                                        .setLabel("No")
                                                        .setStyle("DANGER")
                                                        .setEmoji("❌")
                                                )
                                            interaction.reply({ content: "Are you sure you want to accept the trade above? (" + tradeID + ")", components: [row] })

                                            // console.log(tradeID)
                                        } else if (interaction.user.id !== config["Discord ID"] && interaction.customId.includes("ACCEPT") == true) {
                                            interaction.reply(`<@${interaction.user.id}> You do not have the permission to accept this trade.`)
                                        }



                                        if (interaction.customId.includes("CONFIRM") == true && interaction.user.id == config["Discord ID"]) {
                                            var tradeID = parseInt(interaction.customId.replace(" CONFIRM", ""))
                                            interaction.reply("Accepting trade " + tradeID)

                                            fetch("https://trades.roblox.com/v1/trades/" + tradeID + "/accept", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "X-CSRF-TOKEN": xtoken,
                                                    cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                },
                                            }).then(acceptRes => acceptRes.json()).then(acceptRes => {
                                                console.log(acceptRes)
                                                if (!acceptRes.errors) {
                                                    client.channels.cache.get("" + interaction.message.channelId + "").send(`<@${interaction.user.id}> successfully accepted trade ${tradeID}!`)

                                                } else {
                                                    client.channels.cache.get("" + interaction.message.channelId + "").send(`<@${interaction.user.id}> Error while accepting trade ${tradeID}! Error: ${acceptRes.errors[0].message}`)

                                                }
                                            })

                                        } else if (interaction.user.id !== config["Discord ID"] && interaction.customId.includes("CONFIRM") == true) {
                                            interaction.reply(`<@${interaction.user.id}> You do not have the permission to accept this trade.`)
                                        }

                                        if (interaction.customId.includes("NotConfirmed") == true && interaction.user.id == config["Discord ID"]) {
                                            var tradeID = parseInt(interaction.customId.replace(" NotConfirmed", ""))
                                            interaction.reply("Canceled!")
                                        } else if (interaction.user.id !== config["Discord ID"] && interaction.customId.includes("NotConfirmed") == true) {
                                            interaction.reply(`<@${interaction.user.id}> You do not have the permission to cancel this trade.`)
                                        }
                                    });


                                    // Outbound Check


                                    setInterval(function () {
                                        if (config["Check outbounds"] == true) {
                                            clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`Checking ${trades_sent.length} Outbound trades.`))
                                            // console.log(trades_sent, trades_sent.length)
                                            trades_sent.forEach(x => {
                                                if (!x["declined"]) {

                                                    var sumgive = 0
                                                    var sumget = 0
                                                    var real_sumget = 0
                                                    var real_sumgive

                                                    var decline = false
                                                    var cancel1 = false
                                                    var cancel = false
                                                    var rapgive = 0
                                                    var rapget = 0

                                                    x.itemids_send.forEach(ui => {

                                                        real_sumgive = real_sumgive + itemdata[ui][4]




                                                        // console.log(pricedata[ui])
                                                        if (custom_values_send[ui]) {

                                                            if (custom_values_send[ui].charAt(0) == "+") {
                                                                sumgive = sumgive + (itemdata[ui][4] + parseInt(custom_values_send[ui].replace("+", "")))
                                                                rapgive = rapgive + itemdata[ui][2]
                                                            } else if (custom_values_send[ui].charAt(0) == "-") {
                                                                sumgive = sumgive + (itemdata[ui][4] - parseInt(custom_values_send[ui].replace("-", "")))
                                                                rapgive = rapgive + itemdata[ui][2]
                                                            } else {
                                                                sumgive = sumgive + custom_values_send[ui]
                                                                rapgive = rapgive + itemdata[ui][2]
                                                            }
                                                            cancel = true
                                                        } else if (config.rapboost !== 1 && itemdata[ui][3] == -1 && cancel == false) {
                                                            if (projecteds.includes(ui) || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                                // console.log(itemdata[ui][0] + " is underpriced")
                                                                // console.log(itemdata[ui][0] + ' is projected.')
                                                                sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                                rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                                cancel = true

                                                            } else {

                                                                rapgive = rapgive + (itemdata[ui][2]) * config.rapboost
                                                                sumgive = (sumgive + itemdata[ui][2]) * config.rapboost
                                                                cancel = true

                                                            }

                                                        } else if (cancel == false) {

                                                            if (projecteds.includes(ui) || items_rap[ui][0] * 1.3 < itemdata[ui][2] && itemdata[ui][3] == -1) {
                                                                items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                                // console.log(itemdata[ui][0] + " is projected")
                                                                sumgive = (sumgive + (itemdata[ui][2]) * config["owned projected ratio"])
                                                                rapgive = (rapgive + (itemdata[ui][2]) * config["owned projected ratio"])

                                                                cancel = true

                                                            } else {

                                                                sumgive = sumgive + itemdata[ui][4]
                                                                rapgive = rapgive + itemdata[ui][2]




                                                            }
                                                        }

                                                    })
                                                    x.itemsids_get.forEach(ui => {
                                                        real_sumget = (real_sumget + itemdata[ui][4])

                                                        if (itemdata[ui][7] == 1 || projecteds.includes(ui) && itemdata[ui][3] == -1) {
                                                            TradeWithProjected = true
                                                            if (config["Send for projecteds"] == true) {
                                                                decline = true
                                                            }
                                                            items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]
                                                        }
                                                        if (itemdata[ui][0].includes("Gucci")) {
                                                            if (itemdata[ui][2] > 1000 && ui !== 8853097484 && ui !== 8853093338) {
                                                                if (projecteds.includes(ui) == false) {
                                                                    projecteds.push(ui)
                                                                }


                                                                cancel1 = true
                                                                if (config["Value projected at their price"]) {
                                                                    sumget = (sumget + pricedata[ui][1])

                                                                    rapget = (rapget + pricedata[ui][1])

                                                                } else {
                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])

                                                                }
                                                            }

                                                        }
                                                        if (itemdata[ui][0].includes("Ralph")) {
                                                            if (itemdata[ui][2] > 1000) {
                                                                if (projecteds.includes(ui) == false) {
                                                                    projecteds.push(ui)
                                                                }

                                                                cancel1 = true
                                                                if (config["Value projected at their price"]) {
                                                                    sumget = (sumget + pricedata[ui][1])

                                                                    rapget = (rapget + pricedata[ui][1])

                                                                } else {

                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])

                                                                }
                                                            }
                                                        }
                                                        if (itemdata[ui][0].includes("KSI")) {
                                                            if (itemdata[ui][2] > 1000) {
                                                                if (projecteds.includes(ui) == false) {
                                                                    projecteds.push(ui)
                                                                }
                                                                cancel1 = true

                                                                if (config["Value projected at their price"]) {
                                                                    real_sumget = (real_sumget + pricedata[ui][4])

                                                                    rapget = (rapget + pricedata[ui][1])

                                                                } else {
                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])

                                                                }
                                                            }
                                                        }
                                                        if (itemdata[ui][0].includes("Vans")) {
                                                            if (itemdata[ui][2] > 1000) {
                                                                if (projecteds.includes(ui) == false) {
                                                                    projecteds.push(ui)
                                                                }
                                                                cancel1 = true

                                                                if (config["Value projected at their price"]) {
                                                                    sumget = (sumget + pricedata[ui][1])
                                                                    rapget = (rapget + pricedata[ui][1])

                                                                } else {
                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])

                                                                }
                                                            }
                                                        }
                                                        if (itemdata[ui][0].includes("Egg")) {
                                                            if (itemdata[ui][2] > 1000) {
                                                                if (projecteds.includes(ui) == false) {
                                                                    projecteds.push(ui)
                                                                }

                                                                cancel1 = true

                                                                if (config["Value projected at their price"]) {

                                                                    sumget = (sumget + pricedata[ui][1])
                                                                    rapget = (rapget + pricedata[ui][1])

                                                                } else {
                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])

                                                                }
                                                            }
                                                        }


                                                        if (custom_values_receive[ui] && cancel1 == false) {

                                                            if (custom_values_receive[ui].charAt(0) == "+") {
                                                                sumget = sumget + (itemdata[ui][4] + parseInt(custom_values_receive[ui].replace("+", "")))
                                                                rapget = rapget + itemdata[ui][2]
                                                                return
                                                            } else if (custom_values_receive[ui].charAt(0) == "-") {
                                                                sumget = sumget + (itemdata[ui][4] - parseInt(custom_values_receive[ui].replace("-", "")))
                                                                rapget = rapget + itemdata[ui][2]
                                                                return
                                                            } else {
                                                                sumget = sumget + parseInt(custom_values_receive[ui])
                                                                rapget = rapget + itemdata[ui][2]
                                                                return
                                                            }
                                                        } else {


                                                            // console.log(itemdata[ui][3])



                                                            // console.log(pricedata[ui])
                                                            if (projecteds.includes(ui) && itemdata[ui][3] == -1) {
                                                                items_rap[ui] = [itemdata[ui][2], itemdata[ui][3], itemdata[ui][4]]

                                                                // console.log(itemdata[ui][0] + ' is projected.')

                                                                TradeWithProjected = true
                                                                if (config["Value projected at their price"]) {
                                                                    sumget = (sumget + pricedata[ui][1])
                                                                    rapget = (rapget + pricedata[ui][1])
                                                                    return
                                                                } else {
                                                                    sumget = sumget + (itemdata[ui][4] * config["Projected ratio"])
                                                                    rapget = Math.round(rapget + (itemdata[ui][2]) * config["Projected ratio"])
                                                                    return
                                                                }





                                                            } else if (cancel1 == false) {

                                                                sumget = sumget + itemdata[ui][4]
                                                                rapget = rapget + itemdata[ui][2]

                                                                return
                                                            }

                                                        }



                                                    })


                                                    var gained = sumget - sumgive

                                                    // console.log(x.items_give_info, x.items_receive_info, sumgive, sumget, gained)

                                                    if (gained < config["minimum outbound gain"] || decline == true) {
                                                        fetch(`https://trades.roblox.com/v1/trades/${x.trade_id}/decline`, {
                                                            method: "POST",
                                                            headers: {
                                                                "cookie": ".ROBLOSECURITY=" + cookie,
                                                                'x-csrf-token': xtoken
                                                            }
                                                        }).then(res => res.json()).then(res => {
                                                            console.log(res)
                                                            if (!res.errors) {
                                                                x.declined = true
                                                                clog(chalk.red(`[${chalk.white("Outbound Checker")}] Successfully declined outbound loss from ${x.username}. (${sumgive} vs ${sumget}) (${accinfo.Username})`))
                                                            } else {
                                                                clog(chalk.red(`[${chalk.white("Outbound Checker")}] Error while trying to decline outbound trade. (${res.errors[0].message}) (${accinfo.Username})`))

                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }, config["Check outbounds interval"] * 1000);


                                    // queue system/ send trades system
                                    var wait = false

                                    // ${trade_info.username} items_give_info items_receive_info trade_info.userid sumgive sumget


                                    // Old Embeds
                                    /*
                                    var newEmbed = new MessageEmbed()
                                        .setColor(config["Trade sent color"])
                                        .setTimestamp()
                                        .setTitle(`Trade sent to ${trade_info.username}`)
                                        .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                        .addFields({
                                            name: "**Value Sent** 🔵",
                                            value: "```" + trade_info.real_sumgive + "```",
                                            inline: true
                                        },
                                            {
                                                name: "**Value Requested** 🟠",
                                                value: "```" + trade_info.real_sumget + "```",
                                                inline: true
                                            },
                                            {
                                                name: "**Profit** ✅",
                                                value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                inline: false
                                            },
                                            {
                                                name: "**Items sent 🟦**",
                                                value: "```" + items_give_info + "```",
                                                inline: false
                                            }, {
                                            name: "**Items requested 🟧**",
                                            value: "```" + items_receive_info + "```",
                                            inline: false
                                        })
                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                        .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                            trade_info.userid +
                                            '&width=420&height=420&format=png')

                                        */



                                    // QUEUE
                                    function SendTradeFromQueue() {
                                        if (queue.length !== 0 && stopped == false) {

                                            if (wait == false && config["Test mode"] == false) {

                                                if (dont_send == false) {

                                                    // setTimeout(function(){
                                                    var trade_info = queue.shift()
                                                    var username_receiver = trade_info.username
                                                    // console.log(trade_info)


                                                    if (trade_info !== undefined) {
                                                        // console.log(trades_sent)
                                                        fetch("https://www.roblox.com/users/profile/profileheader-json?userid=" + trade_info.userid, {
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "X-CSRF-TOKEN": xtoken,
                                                                "cookie": ".ROBLOSECURITY=" + cookie,
                                                            },
                                                        }).then(res => res.json()).then(res5 => {
                                                            // console.log(res5)
                                                            var sumgive2 = 0
                                                            var sumget2 = 0

                                                            var projecteds_receive = []
                                                            if (config["Double Check Before Sending"] == true) {
                                                                trade_info.itemids_send.forEach(x => {
                                                                    sumgive2 = sumgive2 + itemdata[x][4]
                                                                })
                                                                trade_info.itemsids_get.forEach(x => {
                                                                    sumget2 = sumget2 + itemdata[x][4]
                                                                })

                                                                trade_info.projecteds_receive.forEach(x => {
                                                                    if (projecteds.includes(x)) {
                                                                        projecteds_receive.push(x)
                                                                    }
                                                                })
                                                            } else {
                                                                sumgive2 = trade_info.real_sumgive
                                                                sumget2 = trade_info.real_sumget
                                                            }

                                                            var items_receive_info = ""
                                                            trade_info.items_receive_info.forEach(y => {
                                                                items_receive_info = items_receive_info + y + "\n"
                                                            })
                                                            var items_give_info = ""
                                                            trade_info.items_give_info.forEach(y => {
                                                                items_give_info = items_give_info + y + "\n"
                                                            })
                                                            // console.log(projecteds_receive, trade_info.projecteds_receive)
                                                            if (trade_info.projecteds_receive.length == projecteds_receive.length && res5.CanTrade == true) {
                                                                if (config["IP lock bypass"] == true) {
                                                                    var authTicket = null
                                                                    fetch("https://auth.roblox.com/v1/authentication-ticket", {
                                                                        method: "POST",
                                                                        headers: { 'User-Agent': 'Roblox/WinInet', 'Referer': 'https://www.roblox.com/my/account', 'Origin': 'https://www.roblox.com', "cookie": ".ROBLOSECURITY=" + cookie, 'x-csrf-token': xtoken }

                                                                    }).then(res => {
                                                                        // console.log(res.status)
                                                                        if (res.status == 200) {
                                                                            for (var i of res.headers) {
                                                                                if (i[0] == "rbx-authentication-ticket") {
                                                                                    authTicket = i[1]
                                                                                }
                                                                            }

                                                                            // console.log(authTicket)
                                                                            fetch("https://auth.roblox.com/v1/authentication-ticket/redeem", {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    'Referer': 'https://www.roblox.com/games/1818/--',
                                                                                    'Origin': 'https://www.roblox.com',
                                                                                    'User-Agent': 'Roblox/WinInet',
                                                                                    'RBXAuthenticationNegotiation': '1'
                                                                                },

                                                                                body: JSON.stringify({
                                                                                    "authenticationTicket": authTicket
                                                                                })
                                                                            }).then(res2 => {
                                                                                //                                                                console.log(res2.status)

                                                                                if (res2.status == 200) {

                                                                                    for (var i of res2.headers) {
                                                                                        if (i[0] == "set-cookie") {
                                                                                            let temp = i[1].split(",")
                                                                                            var modifiedCookie = null

                                                                                            modifiedCookie = temp[2]


                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Attempting To Send"][0], config["Console Trade Color"]["Attempting To Send"][1], config["Console Trade Color"]["Attempting To Send"][2])(`[${chalk.white("Trading")}] Attempting to send to ${chalk.rgb(config["Console Trade Color"]["Attempting To Send Highlight"][0], config["Console Trade Color"]["Attempting To Send Highlight"][1], config["Console Trade Color"]["Attempting To Send Highlight"][2])(username_receiver)}. (${accinfo.Username})`))




                                                                                            if (modifiedCookie !== undefined || modifiedCookie !== null) {
                                                                                                if (proxies_enabled) {
                                                                                                    const random = Math.floor(Math.random() * proxies.length);
                                                                                                    // console.log(random, proxies[random]);
                                                                                                    (async () => {
                                                                                                        var proxyAgent = null
                                                                                                        var random2 = proxies[random]
                                                                                                        // console.log(random2.substring(0,4))

                                                                                                        proxyAgent = new HttpsProxyAgent(random2)
                                                                                                        // console.log(proxyAgent)
                                                                                                        if (true) {
                                                                                                            const response = await fetch('https://trades.roblox.com/v1/trades/send', {
                                                                                                                agent: proxyAgent,
                                                                                                                method: "POST",
                                                                                                                headers: {
                                                                                                                    "Content-Type": "application/json",
                                                                                                                    "X-CSRF-TOKEN": xtoken,
                                                                                                                    cookie: modifiedCookie + ";",
                                                                                                                    'User-Agent': 'Roblox/WinInet', 'Referer': 'https://www.roblox.com/my/account', 'Origin': 'https://www.roblox.com'
                                                                                                                },
                                                                                                                body: JSON.stringify({
                                                                                                                    "offers": [{
                                                                                                                        "userId": trade_info.userid,
                                                                                                                        "userAssetIds": trade_info.items_receive,
                                                                                                                        "robux": 0
                                                                                                                    },
                                                                                                                    {
                                                                                                                        "userId": accinfo.Userid,
                                                                                                                        "userAssetIds": trade_info.items_send,
                                                                                                                        "robux": 0
                                                                                                                    }
                                                                                                                    ]
                                                                                                                })
                                                                                                            });
                                                                                                            const body = await response.json();

                                                                                                            if (body.errors) {

                                                                                                                if (body.errors[0].code == 0) {
                                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Too Many Requests. Retrying to send. (${accinfo.Username})`))

                                                                                                                    queue.push(trade_info)

                                                                                                                } else
                                                                                                                    if (body.errors[0].message == 'Token Validation Failed') {
                                                                                                                        rp(options).then(function () {

                                                                                                                        }).catch(function (err) {
                                                                                                                            xtoken = err.response.headers["x-csrf-token"]
                                                                                                                            queue.push(trade_info)

                                                                                                                        })
                                                                                                                    } else
                                                                                                                        if (body.errors[0].code == 14) {
                                                                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, too many requests. (${accinfo.Username})`))
                                                                                                                            queue.push(trade_info)
                                                                                                                            waitForRatelimit = true
                                                                                                                            setTimeout(function () {
                                                                                                                                waitForRatelimit = false
                                                                                                                            }, config["Time after ratelimit"])
                                                                                                                        } else
                                                                                                                            if (body.errors[0].code == 12) {
                                                                                                                                sendTrade(queue.shift(), function (data) { })
                                                                                                                            } else
                                                                                                                                if (body.errors[0].code == 22) {
                                                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                                                    sendTrade(queue.shift(), function (data) { })


                                                                                                                                } else if (body.errors[0].code == 7) {
                                                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                                                                    sendTrade(queue.shift(), function (data) { })
                                                                                                                                }
                                                                                                                // console.log(p, giveassets)
                                                                                                            } else {

                                                                                                                usersent.push(trade_info.userid)


                                                                                                                if (config["send notif when trade sent"] == true) {

                                                                                                                    trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                                    trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                                    trades_sent_int = trades_sent_int + 1

                                                                                                                    var newEmbed = new MessageEmbed()
                                                                                                                        .setColor(config["Trade sent color"])
                                                                                                                        .setTimestamp()
                                                                                                                        .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                                        .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                                        .addFields({
                                                                                                                            name: "**Value Sent** 🔵",
                                                                                                                            value: "```" + trade_info.real_sumgive + "```",
                                                                                                                            inline: true
                                                                                                                        },
                                                                                                                            {
                                                                                                                                name: "**Value Requested** 🟠",
                                                                                                                                value: "```" + trade_info.real_sumget + "```",
                                                                                                                                inline: true
                                                                                                                            },
                                                                                                                            {
                                                                                                                                name: "**Profit** ✅",
                                                                                                                                value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                                                inline: false
                                                                                                                            },
                                                                                                                            {
                                                                                                                                name: "**Items sent 🟦**",
                                                                                                                                value: "```" + items_give_info + "```",
                                                                                                                                inline: false
                                                                                                                            }, {
                                                                                                                            name: "**Items requested 🟧**",
                                                                                                                            value: "```" + items_receive_info + "```",
                                                                                                                            inline: false
                                                                                                                        })
                                                                                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                                        .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                                            trade_info.userid +
                                                                                                                            '&width=420&height=420&format=png')

                                                                                                                    clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })



                                                                                                                    trade_info.trade_id = body.id
                                                                                                                    trades_sent.push(trade_info)
                                                                                                                    general_trades_sent[accinfo.Username] = trades_sent

                                                                                                                } else {
                                                                                                                    trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                                    trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                                    trades_sent_int = trades_sent_int + 1

                                                                                                                    var newEmbed = new MessageEmbed()

                                                                                                                        .setColor(config["Trade sent color"])
                                                                                                                        .setTimestamp()
                                                                                                                        .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                                        .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                                        .addFields({
                                                                                                                            name: "**Value Sent** 🔵",
                                                                                                                            value: "```" + trade_info.real_sumgive + "```",
                                                                                                                            inline: true
                                                                                                                        },
                                                                                                                            {
                                                                                                                                name: "**Value Requested** 🟠",
                                                                                                                                value: "```" + trade_info.real_sumget + "```",
                                                                                                                                inline: true
                                                                                                                            },
                                                                                                                            {
                                                                                                                                name: "**Profit** ✅",
                                                                                                                                value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                                                inline: false
                                                                                                                            },
                                                                                                                            {
                                                                                                                                name: "**Items sent 🟦**",
                                                                                                                                value: "```" + items_give_info + "```",
                                                                                                                                inline: false
                                                                                                                            }, {
                                                                                                                            name: "**Items requested 🟧**",
                                                                                                                            value: "```" + items_receive_info + "```",
                                                                                                                            inline: false
                                                                                                                        })
                                                                                                                        .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                                        .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                                            trade_info.userid +
                                                                                                                            '&width=420&height=420&format=png')

                                                                                                                    clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                                    client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })

                                                                                                                    trade_info.trade_id = body.id

                                                                                                                    trades_sent.push(trade_info)
                                                                                                                    general_trades_sent[accinfo.Username] = trades_sent

                                                                                                                }




                                                                                                            }
                                                                                                        }
                                                                                                    })();
                                                                                                } else {
                                                                                                    fetch("https://trades.roblox.com/v1/trades/send", {
                                                                                                        method: "POST",
                                                                                                        headers: {
                                                                                                            "Content-Type": "application/json",
                                                                                                            "X-CSRF-TOKEN": xtoken,
                                                                                                            cookie: modifiedCookie + ";",
                                                                                                        },
                                                                                                        body: JSON.stringify({
                                                                                                            "offers": [{
                                                                                                                "userId": trade_info.userid,
                                                                                                                "userAssetIds": trade_info.items_receive,
                                                                                                                "robux": 0
                                                                                                            },
                                                                                                            {
                                                                                                                "userId": accinfo.Userid,
                                                                                                                "userAssetIds": trade_info.items_send,
                                                                                                                "robux": 0
                                                                                                            }
                                                                                                            ]
                                                                                                        })
                                                                                                    }).then(res => res.json()).then(res => {
                                                                                                        if (res.errors) {
                                                                                                            if (res.errors[0].code == 14 || res.errors[0].message == "TooManyRequests") {
                                                                                                                clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Too many requests while sending to ${chalk.rgb(255, 102, 102)(username_receiver)}. (${accinfo.Username})`))
                                                                                                                queue.push(trade_info)

                                                                                                            } else
                                                                                                                if (res.errors[0].message == 'Token Validation Failed') {
                                                                                                                    rp(options).then(function () {

                                                                                                                    }).catch(function (err) {
                                                                                                                        xtoken = err.response.headers["x-csrf-token"]
                                                                                                                        queue.push(trade_info)

                                                                                                                    })
                                                                                                                } else
                                                                                                                    if (res.errors[0].code == 22) {
                                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                                        sendTrade(queue.shift(), function (data) { })

                                                                                                                    } else if (res.errors[0].code == 7) {
                                                                                                                        sendTrade(queue.shift(), function (data) { })

                                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                                                    }
                                                                                                            // console.log(p, giveassets)
                                                                                                        } else {

                                                                                                            usersent.push(trade_info.userid)


                                                                                                            trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                            trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                            trades_sent_int = trades_sent_int + 1

                                                                                                            var newEmbed = new MessageEmbed()

                                                                                                                .setColor(config["Trade sent color"])
                                                                                                                .setTimestamp()
                                                                                                                .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                                .setDescription("**Trade** 🆔\n" + "` " + res.id + "`")
                                                                                                                .addFields({
                                                                                                                    name: "**Value Sent** 🔵",
                                                                                                                    value: "```" + trade_info.real_sumgive + "```",
                                                                                                                    inline: true
                                                                                                                },
                                                                                                                    {
                                                                                                                        name: "**Value Requested** 🟠",
                                                                                                                        value: "```" + trade_info.real_sumget + "```",
                                                                                                                        inline: true
                                                                                                                    },
                                                                                                                    {
                                                                                                                        name: "**Profit** ✅",
                                                                                                                        value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                                        inline: false
                                                                                                                    },
                                                                                                                    {
                                                                                                                        name: "**Items sent 🟦**",
                                                                                                                        value: "```" + items_give_info + "```",
                                                                                                                        inline: false
                                                                                                                    }, {
                                                                                                                    name: "**Items requested 🟧**",
                                                                                                                    value: "```" + items_receive_info + "```",
                                                                                                                    inline: false
                                                                                                                })
                                                                                                                .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                                .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                                    trade_info.userid +
                                                                                                                    '&width=420&height=420&format=png')

                                                                                                            clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                            client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                                            trade_info.trade_id = res.id
                                                                                                            trades_sent.push(trade_info)
                                                                                                            general_trades_sent[accinfo.Username] = trades_sent







                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            }




                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    // console.log(res2.status)

                                                                                    setTimeout(function () {
                                                                                        sendTrade(trade_info)

                                                                                    }, 30000)
                                                                                }
                                                                            })


                                                                        } else {
                                                                            console.log(res.status)
                                                                            sendTrade(trade_info, function (data) { })
                                                                        }
                                                                    })
                                                                } else {




                                                                    clog(chalk.rgb(config["Console Trade Color"]["Attempting To Send"][0], config["Console Trade Color"]["Attempting To Send"][1], config["Console Trade Color"]["Attempting To Send"][2])(`[${chalk.white("Trading")}] Attempting to send to ${chalk.rgb(config["Console Trade Color"]["Attempting To Send Highlight"][0], config["Console Trade Color"]["Attempting To Send Highlight"][1], config["Console Trade Color"]["Attempting To Send Highlight"][2])(username_receiver)}. (${accinfo.Username})`))




                                                                    setTimeout(function () {
                                                                        if (true) {
                                                                            if (proxies_enabled) {
                                                                                const random = Math.floor(Math.random() * proxies.length);
                                                                                // console.log(random, proxies[random]);
                                                                                (async () => {
                                                                                    var proxyAgent = null
                                                                                    var random2 = proxies[random]
                                                                                    // console.log(random2.substring(0,4))

                                                                                    proxyAgent = new HttpsProxyAgent(random2)
                                                                                    // console.log(proxyAgent)
                                                                                    if (true) {

                                                                                        const response = await fetch('https://trades.roblox.com/v1/trades/send', {
                                                                                            agent: proxyAgent,
                                                                                            method: "POST",
                                                                                            headers: {
                                                                                                "Content-Type": "application/json",
                                                                                                "X-CSRF-TOKEN": xtoken,
                                                                                                cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                            },
                                                                                            body: JSON.stringify({
                                                                                                "offers": [{
                                                                                                    "userId": trade_info.userid,
                                                                                                    "userAssetIds": trade_info.items_receive,
                                                                                                    "robux": 0
                                                                                                },
                                                                                                {
                                                                                                    "userId": accinfo.Userid,
                                                                                                    "userAssetIds": trade_info.items_send,
                                                                                                    "robux": 0
                                                                                                }
                                                                                                ]
                                                                                            })
                                                                                        });
                                                                                        // console.log(response)
                                                                                        const body = await response.json();
                                                                                        // console.log(body);
                                                                                        if (body.errors) {

                                                                                            if (body.errors[0].message == 'Token Validation Failed') {
                                                                                                rp(options).then(function () {

                                                                                                }).catch(function (err) {
                                                                                                    xtoken = err.response.headers["x-csrf-token"]
                                                                                                    queue.push(trade_info)

                                                                                                })
                                                                                            } else
                                                                                                if (body.errors[0].code == 14 || body.errors[0].message == "TooManyRequests") {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, too many requests. (${accinfo.Username})`))
                                                                                                    queue.push(trade_info)

                                                                                                } else
                                                                                                    if (body.errors[0].code == 22) {
                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                        sendTrade(queue.shift(), function (data) { })

                                                                                                    } else if (body.errors[0].code == 7) {
                                                                                                        clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, User cannot trade. (${accinfo.Username})`))
                                                                                                        sendTrade(queue.shift(), function (data) { })
                                                                                                    }
                                                                                            // console.log(p, giveassets)
                                                                                        } else {

                                                                                            usersent.push(trade_info.userid)


                                                                                            if (config["send notif when trade sent"] == true) {

                                                                                                trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                trades_sent_int = trades_sent_int + 1

                                                                                                var newEmbed = new MessageEmbed()

                                                                                                    .setColor(config["Trade sent color"])
                                                                                                    .setTimestamp()
                                                                                                    .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                    .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                    .addFields({
                                                                                                        name: "**Value Sent** 🔵",
                                                                                                        value: "```" + trade_info.real_sumgive + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                        {
                                                                                                            name: "**Value Requested** 🟠",
                                                                                                            value: "```" + trade_info.real_sumget + "```",
                                                                                                            inline: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Profit** ✅",
                                                                                                            value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                            inline: false
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Items sent 🟦**",
                                                                                                            value: "```" + items_give_info + "```",
                                                                                                            inline: false
                                                                                                        }, {
                                                                                                        name: "**Items requested 🟧**",
                                                                                                        value: "```" + items_receive_info + "```",
                                                                                                        inline: false
                                                                                                    })
                                                                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                        trade_info.userid +
                                                                                                        '&width=420&height=420&format=png')
                                                                                                clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                                trade_info.trade_id = body.id
                                                                                                trades_sent.push(trade_info)
                                                                                                general_trades_sent[accinfo.Username] = trades_sent





                                                                                            } else {
                                                                                                trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                                trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                                trades_sent_int = trades_sent_int + 1

                                                                                                var newEmbed = new MessageEmbed()

                                                                                                    .setColor(config["Trade sent color"])
                                                                                                    .setTimestamp()
                                                                                                    .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                                    .setDescription("**Trade** 🆔\n" + "` " + body.id + "`")
                                                                                                    .addFields({
                                                                                                        name: "**Value Sent** 🔵",
                                                                                                        value: "```" + trade_info.real_sumgive + "```",
                                                                                                        inline: true
                                                                                                    },
                                                                                                        {
                                                                                                            name: "**Value Requested** 🟠",
                                                                                                            value: "```" + trade_info.real_sumget + "```",
                                                                                                            inline: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Profit** ✅",
                                                                                                            value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                            inline: false
                                                                                                        },
                                                                                                        {
                                                                                                            name: "**Items sent 🟦**",
                                                                                                            value: "```" + items_give_info + "```",
                                                                                                            inline: false
                                                                                                        }, {
                                                                                                        name: "**Items requested 🟧**",
                                                                                                        value: "```" + items_receive_info + "```",
                                                                                                        inline: false
                                                                                                    })
                                                                                                    .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                                    .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                        trade_info.userid +
                                                                                                        '&width=420&height=420&format=png')

                                                                                                clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                                client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                                trade_info.trade_id = body.id

                                                                                                trades_sent.push(trade_info)
                                                                                                general_trades_sent[accinfo.Username] = trades_sent




                                                                                            }




                                                                                        }
                                                                                    }
                                                                                })();
                                                                            } else {
                                                                                fetch("https://trades.roblox.com/v1/trades/send", {
                                                                                    method: "POST",
                                                                                    headers: {
                                                                                        "Content-Type": "application/json",
                                                                                        "X-CSRF-TOKEN": xtoken,
                                                                                        cookie: ".ROBLOSECURITY=" + cookie + ";",
                                                                                    },
                                                                                    body: JSON.stringify({
                                                                                        "offers": [{
                                                                                            "userId": trade_info.userid,
                                                                                            "userAssetIds": trade_info.items_receive,
                                                                                            "robux": 0
                                                                                        },
                                                                                        {
                                                                                            "userId": accinfo.Userid,
                                                                                            "userAssetIds": trade_info.items_send,
                                                                                            "robux": 0
                                                                                        }
                                                                                        ]
                                                                                    })
                                                                                }).then(res => res.json()).then(res => {
                                                                                    if (res.errors) {
                                                                                        if (res.errors[0].code == 14 || res.errors[0].message == "TooManyRequests") {
                                                                                            clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Too many requests while sending to ${chalk.rgb(255, 102, 102)(username_receiver)}. (${accinfo.Username})`))
                                                                                            queue.push(trade_info)

                                                                                        } else
                                                                                            if (res.errors[0].message == 'Token Validation Failed') {
                                                                                                rp(options).then(function () {

                                                                                                }).catch(function (err) {
                                                                                                    xtoken = err.response.headers["x-csrf-token"]
                                                                                                    queue.push(trade_info)

                                                                                                })
                                                                                            } else
                                                                                                if (res.errors[0].code == 22) {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Trade filter is too high. (${accinfo.Username})`))
                                                                                                    sendTrade(queue.shift(), function (data) { })

                                                                                                } else if (res.errors[0].code == 7) {
                                                                                                    clog(chalk.rgb(config["Console Error Color"][0], config["Console Error Color"][1], config["Console Error Color"][2])(`[${chalk.white("Error")}] Failed to send to ${chalk.rgb(255, 102, 102)(username_receiver)}, Cannot trade with this user. (${accinfo.Username})`))
                                                                                                    sendTrade(queue.shift(), function (data) { })

                                                                                                }
                                                                                        // console.log(p, giveassets)
                                                                                    } else {
                                                                                        usersent.push(trade_info.userid)

                                                                                        trades_sent_in_10mins = trades_sent_in_10mins + 1
                                                                                        trade_sent_in_a_min = trade_sent_in_a_min + 1
                                                                                        trades_sent_int = trades_sent_int + 1


                                                                                        var newEmbed = new MessageEmbed()

                                                                                            .setColor(config["Trade sent color"])
                                                                                            .setTimestamp()
                                                                                            .setTitle(`Trade sent to ${trade_info.username}`)
                                                                                            .setDescription("**Trade** 🆔\n" + "` " + res.id + "`")
                                                                                            .addFields({
                                                                                                name: "**Value Sent** 🔵",
                                                                                                value: "```" + trade_info.real_sumgive + "```",
                                                                                                inline: true
                                                                                            },
                                                                                                {
                                                                                                    name: "**Value Requested** 🟠",
                                                                                                    value: "```" + trade_info.real_sumget + "```",
                                                                                                    inline: true
                                                                                                },
                                                                                                {
                                                                                                    name: "**Profit** ✅",
                                                                                                    value: "```" + (trade_info.real_sumget - trade_info.real_sumgive) + " (" + `%${trade_info.percentage}` + ")```",
                                                                                                    inline: false
                                                                                                },
                                                                                                {
                                                                                                    name: "**Items sent 🟦**",
                                                                                                    value: "```" + items_give_info + "```",
                                                                                                    inline: false
                                                                                                }, {
                                                                                                name: "**Items requested 🟧**",
                                                                                                value: "```" + items_receive_info + "```",
                                                                                                inline: false
                                                                                            })
                                                                                            .setAuthor({ name: `aequet Trade Bot (${accinfo.Username})`, iconURL: aequetpng })
                                                                                            .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' +
                                                                                                trade_info.userid +
                                                                                                '&width=420&height=420&format=png')
                                                                                        clog(chalk.rgb(config["Console Trade Color"]["Trade Sent"][0], config["Console Trade Color"]["Trade Sent"][1], config["Console Trade Color"]["Trade Sent"][2])(`[${chalk.white("Trading")}] Trade sent to ${chalk.rgb(config["Console Trade Color"]["Trade Sent Highlight"][0], config["Console Trade Color"]["Trade Sent Highlight"][1], config["Console Trade Color"]["Trade Sent Highlight"][2])(username_receiver)}! ${trade_info.real_sumgive} vs ${trade_info.real_sumget} (${trade_info.percentage}%) (${accinfo.Username})`))
                                                                                        client.channels.cache.get("" + config["Trade Outbound Channel"] + "").send({ embeds: [newEmbed] })
                                                                                        trade_info.trade_id = res.id
                                                                                        trades_sent.push(trade_info)
                                                                                        general_trades_sent[accinfo.Username] = trades_sent






                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    }, 5000)







                                                                }

                                                            } else {
                                                                clog(chalk.red(`Skipped ${trade_info.userid} as they cant trade with you.`))
                                                                SendTradeFromQueue()
                                                            }

                                                        })
                                                    }
                                                    // }, 60000)

                                                }
                                            }
                                        }
                                    }
                                    var x = 0
                                    /*
                                    setTimeout(function () {
            
                                        setInterval(function () {
                                            
                                            SendTradeFromQueue()
            
            
                                        }, config["milliseconds between sending trades"])
                                    }, 1000)
                                   */

                                    /*

                                    setInterval(function () {
                                        setTimeout(function () {
                                            if (waitForRatelimit == false) {
                                                SendTradeFromQueue()
                                            }
                                        }, 30000)
                                    }, config["milliseconds between sending trades"])

                                    */

                                    setTimeout(function () {
                                        setInterval(function () {
                                            setTimeout(function () {
                                                SendTradeFromQueue()

                                            }, 15000)

                                        }, config["milliseconds between sending trades"])
                                    }, 15000)



                                    setInterval(function () {
                                        queue = []
                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] queue has been cleared. (${accinfo.Username})`))
                                        // console.log(queue)
                                    }, config["reset queue after"] * 60000)
                                    setInterval(function () {
                                        already_sent = []
                                        users_to_find = []

                                        clog(chalk.rgb(config["Console Base Color"][0], config["Console Base Color"][1], config["Console Base Color"][2])(`[${chalk.white("Info")}] Already sent array has been cleared. (${accinfo.Username})`))
                                        // console.log(already_sent)
                                    }, config["already sent interval"] * 60000)



                                    setInterval(function () {
                                        queue_trades = config["Max queue"] > queue.length
                                    }, 15000)
                                }
                            })


                        }
                        if (whitelistres[h[1]] == 1) {
                            main(cookies[0], rolimons_tokens[0])
                        } else {

                            cookies.forEach(function (value, i) {
                                if (whitelist_int >= i + 1) {
                                    main(cookies[i], rolimons_tokens[i])
                                }
                            })
                        }
                    } else {
                        clog(chalk.red(`User is not whitelisted. Please use $whitelist ${temp_accinfo.Userid} in #bot-commands aequet Trade Bot Server. Also make sure your cookie is valid!`))
                    } // whitelist end
                })
        })
    })
}







process.on('unhandledRejection', (err, p) => {
    console.log(err)
});

process.on('uncaughtException', (err, p) => {
    console.log(err)

});
setInterval(function () {
    fs.writeFile("json/queue.json", JSON.stringify(general_queue), function (err) {
        //clog(chalk.redBright(`[i] Saved queue sent in queue.json!`))
    });
    fs.writeFile("json/already_sent.json", JSON.stringify(general_already_sent), function (err) {
        if (err) {
            // console.log(err)   
        }
    });

    // console.log(general_trades_sent)
    fs.writeFile("json/trades_sent.json", JSON.stringify(general_trades_sent), function (err) {
        // clog(chalk.redBright(`[i] Saved trades sent in trades_sent.json!`))
    });

    fs.writeFile("json/save.json", JSON.stringify({ "Inventory": inventory }), function (err) {
        // clog(chalk.redBright(`[i] Saved trades sent in trades_sent.json!`))
    });





}, 15000)

