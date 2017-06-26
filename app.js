const Discord = require("discord.js");
const client = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');

const fs = require('fs');

let settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
let data = JSON.parse(fs.readFileSync("./data.json", "utf8"))
let prefix = "!";

const wowprogChar = "https://www.wowprogress.com/character";

client.login(settings["token"]);

// https://discordapp.com/api/oauth2/authorize?client_id=328623323577843712&scope=bot&permissions=2146958591
// API End Point Example : https://www.wowprogress.com/guild/us/sen-jin/Premonition/json_rank
//!mScore Emô-Lightbringer EU
//{m_plus_score: 12234, "dungeons_complete_in_time" : 333333, highest_run{"level" : 19, "dungeon" : "maw of souls",  "time" : "1H 25M 23S"} }


client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot) return;
  let content = message.content;
  let segments = content.split(" ");

//mScore
//Params: CharacterName Server Region
//Returns
//{m_plus_score: 12234, "dungeons_complete_in_time" : 333333, highest_run{"level" : 19, "dungeon" : "maw of souls",  "time" : "1H 25M 23S"} }
  if (message.content.startsWith(prefix + "mScore")) {
    let CharacterName = segments[1];
    let Server = segments[2];
    let Region = segments[3];


    fetchCharProgress(CharacterName, Server, Region, function(cData){
      console.log(cData);
      message.channel.send(CharacterName + ": " + cData.mythic_score_overal);
    });


  }

});


function fetchCharProgress(name, server, region, callback)
{
  var reqOptions = { encoding: null, uri: encodeURI(wowprogChar + "/" + region + "/" + server + "/" + name)}
  var charData = { url: wowprogChar + "/" + region + "/" + server + "/" + name, name : name};

  request(reqOptions, function(error, response, body) {
  console.log('statusCode:', response && response.statusCode);
  if(!error){
   var $ = cheerio.load(body);
    $('td.char_rating_area .gearscore:contains(Mythic+ Score: )').each(function(i, elem) {
        var score = $(this);
        charData["mythic_score_overal"] = score.text();
    });

    }
    //end of If no error
      callback(charData);
  });

}
