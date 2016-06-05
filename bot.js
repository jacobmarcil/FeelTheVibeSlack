var SC = require('node-soundcloud');
var botkit = require('botkit');

var client_id = "fd11f5b302d3cbdb73e88788f8d30056";
var client_secret = "121a099d3633117c55f263adde0d9073";
var redirect_uri = "http://localhost:3000/callback.html";

// Initialize client 
SC.init({
  id: client_id,
  secret: client_secret,
  uri: redirect_uri
});
 
// Connect user to authorize application 
var initOAuth = function(req, res) {
  var url = SC.getConnectUrl();
  res.writeHead(301, url);
  res.end();
};
 
// Get OAuth token (example endpoint discussed in the next section) 

var redirectHandler = function(req, res) {
  var code = req.query.code;
 
  SC.authorize(code, function(err, accessToken) {
    if ( err ) {
      throw err;
    } else {
      // Client is now authorized and able to make API calls 
      console.log('access token:', accessToken);
    }
  });
};

process.env.token="xoxb-48208740373-9YxwKXtAFkQUeR1ZzjzR4Txk";

var controller = botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['Play (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var song = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {

        SC.get('/tracks/' + song,  function(err, tracks) {
    		if(tracks != null)
           		bot.reply(message, tracks.permalink_url);
           	else
           		bot.reply(message, "Aucune chanson trouvé");

		});
    });
});
 


