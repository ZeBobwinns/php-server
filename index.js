
const Discord = require('discord.js');
const client = new Discord.Client();


const TOKEN = "NzUxODM0MzEwNDMyMTI5MTAx.X1O2RA.Poh8bvDHyRAQt6AgiEEDddbjO9I";
var prefix = "+";
var muteMembersLength = 0;
var muteListMembers = [];
var activeUnmmute = -1;
var nonmemlist = [];
var nonmemactive = 0;
var pingLoopNum=0;
var pingTimeout = []
client.on('message', message => {
    if (message.content.charAt(0) == prefix) {
    var args = message.content.slice(prefix.length).trim().split(" ");
    var command = args.splice(1);
    var temp = args;
    var args = command;
    var command = temp;
console.log(command);
console.log(args);
    if(command=="args") {
        message.channel.send("args are:" + args);
    }

    if(command=="help") {
        var embed = {
            color: 0xffffff,
            title: 'Help',
            fields: [
                {
                    name: 'help',
                    value: 'Sends this help message',
                },
                {
                    name: 'joinvoice',
                    value: 'Joins your voice channel',
                },
                {
                    name: 'muteall',
                    value: 'Mutes everyone in your voice channel',
                },
                {
                    name: 'unmuteall',
                    value: 'Unmutes everyone in your voice channel',
                },
                {
                    name: 'makelist',
                    value: 'Makes a list of people to cycle through using the "next" command',
                },
                {
                    name: 'makemutelist',
                    value: 'Makes a list of people to cycle through using the "next" command, and mutes everyone but the first person in the list',
                },
                {
                    name: 'makenonmemlist',
                    value: 'Makes a list of things to cycle through using the "nextnonmem" command',
                },
                {
                    name: 'nextnonmem',
                    value: 'Cycles through the list, and says the next thing',
                },
                {
                    name: 'next',
                    value: "Cycles through the list, and @'s the next person",
                },
                {
                    name: 'mutenext',
                    value: "Cycles through the list, @'s and mutes the next person",
                },
                {
                    name: 'zebobwinnsprefix',
                    value: "Changes the bot's prefix",
                },
            ],
        };
        
        message.channel.send({ embed: embed });
    }

    if (command == "timer") {
        var time = args[0];
        message.channel.send(time).then(sentMessage =>  setInterval(() => {
            time = time - 5;
            if (time <= 0) {
            sentMessage.edit("Ring ring, times up!");
            }
          else {
            sentMessage.edit(time);
          }
        }, 5000))
        }
    
    if (command == 'react') {

        var nameArray = [];
        var reactionAmount = 0;
        client.on('messageReactionAdd', (reaction, user) => {

            let message = reaction.message, emoji = reaction.emoji;
                    // We don't have the member, but only the user...
                    // Thanks to the previous part, we know how to fetch it
                    message.guild.members.fetch(user.id).then(member => {
                            nameArray[reactionAmount]=user.tag+" Voted "+emoji.name
                    });
    
                    reactionAmount++;
            // Remove the user's reaction
    });

    setTimeout(() => {
        var sendText = ""
        nameArray.forEach(element => {
            sendText = sendText + element + "; ";
        });
        message.channel.send(sendText);
    }, args[0]);

    }


    if(command == "ping") {
        var pingee = args[0];
        var pingAmt = args[1];
        sendPingMessage(pingee, pingAmt, message.channel)
    }

    if(command == "cancelPing") {
        clearTimeout(pingTimeout);
    }

    if(command=="joinvoice") {
        if (message.member.voice.channel) {
            var connection = message.member.voice.channel.join();
            message.channel.send("Joined Voice!")
        }
        else{
            message.channel.send("You're not in a voice channel, silly!")
        }
        }

    if (command == "makevote") {
        var voteingOn = args[0];
        message.channel.send("Voteing on: "+voteingOn)
        message.react(":white_check_mark:")
    }


        }
});


client.on('message', message => {doPromise(message)});

async function doPromise(message) {
    if (message.content.charAt(0) == prefix) {
        var args = message.content.slice(prefix.length).trim().split(" ");
        var command = args.splice(1);
        var temp = args;
        var args = command;
        var command = temp;
    console.log(command);
    console.log(args);
        
        if(command=="muteall") {
            if (message.member.voice.channel) {
                var connection = message.member.voice.channel
                
                message.channel.send("Muted everyone. They really need to STFU");
                 let channel = message.member.voice.channel;
                 const members = channel.members;
                 members.forEach(member => {
                    member.voice.setMute(true);
                });
            }
            else{
                message.channel.send("You're not in a voice channel, silly!")
            }
            }
    

            if(command=="unmuteall") {
                if (message.member.voice.channel) {
                    var connection = message.member.voice.channel;
                    
                    message.channel.send("Unmuted everyone, the have regained talking privlages.");
                     let channel = message.member.voice.channel;
                     const members = channel.members;
                     members.forEach(member => {
                        member.voice.setMute(false);
                    });
                }
                else{
                    message.channel.send("You're not in a voice channel, silly!")
                }
                }



    if (command == "makelist") {
        muteListMembers = [];
        var i = 0;
        muteMembersLength = args.length;
       while (i < args.length) {
           muteListMembers[i] = getUserFromMention(args[i]);
           i++;
       }
       activeUnmmute = -1;
       if (getUserNamesFromList(muteListMembers) == "") {
           message.channel.send("Bro, you didnt even mention anyone.")
       }
       else {
       console.log("List: " +muteListMembers+" is " +muteMembersLength+ " people long.");
       message.channel.send("The list includes"+getUserNamesFromList(muteListMembers)+".")

           if (activeUnmmute > muteMembersLength - 2) {
               activeUnmmute = 0;
           }
           else {
           activeUnmmute++
           }
           message.channel.send(message.guild.members.cache.get(muteListMembers[activeUnmmute].id).toString()+", you are up!");
}
}


     if (command == "makenonmemlist") {
         nonmemlist = [];
         nonmemactive = 0;
             nonmemlist = args;
         console.log(nonmemlist)
         message.channel.send(nonmemlist[nonmemactive]+" is up!");
}

    if (command == "nextnonmem") {
        if (nonmemlist.length !== 0) {
            if (nonmemactive > nonmemlist.length - 2) {
                nonmemactive = 0;
            }
            else {
                nonmemactive++
            }
            message.channel.send(nonmemlist[nonmemactive]+", you are up!");
        }
        else {
            message.channel.send("Use +makenonmemlist first.")
            }
    }


if (command == "makemutelist") {
muteListMembers = [];
    var i = 0;
    muteMembersLength = args.length;
   while (i < args.length) {
       muteListMembers[i] = getUserFromMention(args[i]);
       i++;
   }
   activeUnmmute = -1;
   if (getUserNamesFromList(muteListMembers) == "") {
       message.channel.send("Bro, you didnt even mention anyone.")
   }
   else {
   console.log("List: " +muteListMembers+" is " +muteMembersLength+ " people long.");
   message.channel.send("The list includes"+getUserNamesFromList(muteListMembers)+".")

       if (activeUnmmute > muteMembersLength - 2) {
           activeUnmmute = 0;
       }
       else {
       activeUnmmute++
       }
       muteListMembers.forEach(function(member){
        message.guild.members.cache.get(member.id).voice.setMute(true);
        })
        message.guild.members.cache.get(muteListMembers[activeUnmmute].id).voice.setMute(false);
       message.channel.send(message.guild.members.cache.get(muteListMembers[activeUnmmute].id).toString()+", you are up!");
}
}


        if (command == "mutenext") {
            if (activeUnmmute > muteMembersLength - 2) {
                activeUnmmute = 0;
            }
            else {
            activeUnmmute++
            }
            muteListMembers.forEach(function(member){
            message.guild.members.cache.get(member.id).voice.setMute(true);
            })
            message.guild.members.cache.get(muteListMembers[activeUnmmute].id).voice.setMute(false);
            message.channel.send(message.guild.members.cache.get(muteListMembers[activeUnmmute].id).toString()+", you are up!");
        }


        if (command == "next") {
            if (muteMembersLength !== 0) {
            if (activeUnmmute > muteMembersLength - 2) {
                activeUnmmute = 0;
            }
            else {
            activeUnmmute++
            }
            message.channel.send(message.guild.members.cache.get(muteListMembers[activeUnmmute].id).toString()+", you are up!");
        }
        else {
            message.channel.send("Use +makelist first.")
            }
    }

        if (command == 'zebobwinnsprefix') {
            if (typeof args[0] == 'undefined') {
                message.channel.send("You need to designate a prefix.")
            }
            else if (args[0].length > 1) {
                message.channel.send("Prefix can only be 1 character long!")
            }
            else {
                prefix = args[0];
                message.channel.send("Prefix changed to "+args[0])
            }
        }
            }
}


function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}


function sendPingMessage(recipent, times, channel) {
    if(pingLoopNum < times) {
        channel.send("Hey, "+recipent.toString()+" get TF in here!");
        pingLoopNum++;
        pingTimeout = setTimeout(() => {
            sendPingMessage(recipent, times, channel);
        }, 2500, recipent, times, channel);
    }
    else{
        pingLoopNum=0;
    }
}

function getUserNamesFromList(list) {
    var i = 0;
    var returnString = ""
    while (list.length > i) {
        returnString = returnString+", "+list[i].toString();
        console.log(returnString);
        i++
    }
    return returnString;
    }

client.login(TOKEN);
console.log(`Logged in as `+TOKEN)