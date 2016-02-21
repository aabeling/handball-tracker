/* Backbone initialisation */
var models = {};
(function(models) {

	/**
	 * MODELS
	 */

	var GameModel = Backbone.Model.extend({

		defaults : {
			goals : [ 0, 0 ]
		}
	});

	var game = new GameModel();

	models.game = game;

	var GameEventModel = Backbone.Model.extend({
		defaults : {
			type : null,
			team : null,
			player : null
		}
	});

	var GameEventsCollection = Backbone.Collection.extend({
		model : GameEventModel
	});

	var gameEvents = new GameEventsCollection();

	models.gameEvents = gameEvents;

})(models);

var renderer = {};
(function(renderer) {

	var goalEventTemplate = _.template($('#goalEventTemplate').html());

	/**
	 * Renders a game event
	 */
	var renderGameEvent = function(gameEvent) {

		if (gameEvent.get('type') == 'goal') {
			if (gameEvent.get('team') == 0) {
				return goalEventTemplate({
					team : "Heim",
					player : gameEvent.get('player')
				});
			} else {
				return goalEventTemplate({
					team : "Gast",
					player : gameEvent.get('player')
				});
			}
		}

		return "unknown game event";
	};

	renderer.renderGameEvent = renderGameEvent;

})(renderer);

var handballTracker = {};
(function(exports, models, renderer) {

	models.game.on("change:goals", function() {

		/* adjust the score view */
		var currentGoals = models.game.get('goals');
		$('#goals_home').html(currentGoals[0]);
		$('#goals_guest').html(currentGoals[1]);
	});

	models.gameEvents.on("update", function(event) {

		/* adjust the game events view */
		// TODO for now clear the elements and render them again
		$('#game_events').empty();
		models.gameEvents.forEach(function(gameEvent) {
			var html = "<li>" + renderer.renderGameEvent(gameEvent) + "</li>";
			$('#game_events').prepend(html);
		});
	});

	var addGoal = function(team) {

		if (team < 0 || team > 1)
			return;

		/* update the score */
		var currentGoals = models.game.get('goals');
		currentGoals[team]++;
		models.game.set({
			goals : currentGoals
		});
		models.game.trigger("change:goals");

		/* add a game event */
		models.gameEvents.add({
			type : 'goal',
			team : team
		});

	};
	exports.addGoal = addGoal;

	// var onPlayerSELECTED = FUNCTION(TEAM, PLAYERID) {
	//
	// IF (STATE.PROGRESS.TYPE == 'COUNT_GOAL') {
	// IF (STATE.PROGRESS.TEAM == 1) {
	// STATE.GOALSHOME++;
	// $('#GOALSHOME').HTML(STATE.GOALSHOME);
	// } ELSE {
	// STATE.GOALSGUEST++;
	// $('#GOALSGUEST').HTML(STATE.GOALSGUEST);
	// }
	// $(":MOBILE-PAGECONTAINER").PAGECONTAINER("CHANGE", "#HOME", {
	// TRANSITION : 'SLIDE',
	// REVERSE : TRUE
	// });
	// }
	// };
	//
	// // EXPORTS.ONGOAL = ONGOAL;
	// EXPORTS.ONPLAYerSelected = onPlayerSelected;

})(handballTracker, models, renderer);