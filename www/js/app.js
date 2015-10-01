(function() {

	/**
	 * Model for a player
	 */
	var PlayerModel = Backbone.Model.extend({
		defaults : {
			name : "neuer Spieler..."
		}
	});

	/**
	 * Collection of all players
	 */
	var PlayersCollection = Backbone.Collection.extend({

		localStorage : new Backbone.LocalStorage("Players"),
		model: PlayerModel,

	});

	/* load the players */
	var players = new PlayersCollection();
	
	players.on("add", function(player) {
//		player.save();
		console.log("player added: ", player);
	});
	
	/* add a player */
//	players.add([
//	             {number: 1, name: "Lena"},
//	             {number: 8, name: "Luka"},
//	             {number: 7, name: "Jette"},
//	             {number: 13, name: "Stina"}]);
//	
	
	/**
	 * TEMPLATES
	 */
	var playerItemTemplate = _.template( $('#player-item-template').html() );

	/**
	 * VIEWS
	 */
	
	/**
	 * View for a player
	 */
	var PlayerView = Backbone.View.extend({
		
		render: function() {
			
			console.log("rendering player: ", this.model);
			var html = playerItemTemplate(this.model.toJSON());
		    this.$el.html(html);
		    return this;
		}
	});

	
	/**
	 * View of all players
	 */
	var PlayersListView = Backbone.View.extend({
		  el: '#home-players',
		  
		  initialize: function() {		    
		      this.listenTo(players, 'add', this.addPlayerView);		      
		  },
		  
		  render: function() {
			  
			  console.log("rendering players");
			  
		  },
		  
		  addPlayerView: function(player) {
			  
			  console.log("players view addOne");
			  var view = new PlayerView({model: player});
		      this.$el.append(view.render().el);
		  }
		});
	
	var playersList = new PlayersListView({collection: players});

	var AppView = Backbone.View.extend({
	
		el: "#handball-tracker",
		initialize: function() {
			
			console.log("AppView#initialize");			
		},
		events: {
		      "click #btn-new-player": "createNewPlayer"
		},
		createNewPlayer: function() {
			  console.log("creating new player");
			  players.add(new PlayerModel());
		}
	});
	var app = new AppView;
	
	console.log("fetching players");
	players.fetch();
	players.forEach(function(player) { console.log("player: ", player.toJSON()); });
	
	console.log("handball-tracker is ready");
})();