(function() {

	/**
	 * MODELS
	 */
	
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
		model: PlayerModel
	});

	var players = new PlayersCollection();
	
	players.on("add", function(player) {
//		player.save();
		console.log("player added: ", player);
	});
	players.on("change", function(player) {
		console.log("player changed: ", player);
	});
	
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
		
		className: "player",
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		    //this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			
			var html = playerItemTemplate(this.model.toJSON());
		    this.$el.html(html);
		    return this;
		},
		events: {
			"change .edit": "updatePlayerFromInput"
		},
		updatePlayerFromInput: function(e) {
			
			var value = this.$("input").val();
			this.model.set({name: value});
			this.model.save();
		}
		
	});

	
	/**
	 * View of all players
	 */
	var PlayersListView = Backbone.View.extend({
		  el: '#home-players',
		  
		  initialize: function() {		
			  
			  /* add a player view when added to the collection */
		      this.listenTo(players, 'add', this.addPlayerView);			      
		  },
		  
		  /**
		   * Adds a view for a player
		   */
		  addPlayerView: function(player) {
			  
			  var view = new PlayerView({model: player});
		      this.$el.append(view.render().el);
		  }
		});
	
	var playersList = new PlayersListView({collection: players});

	/**
	 * View for the whole application
	 */
	var AppView = Backbone.View.extend({
	
		el: "#handball-tracker",
		initialize: function() {

			players.fetch();
		},
		events: {
		      "click #btn-edit-players": "toggleEditPlayersMode",
		      "click #btn-new-player": "createNewPlayer"
		},
		/**
		 * Adds a new default player to the model
		 */
		createNewPlayer: function() {			  
			  players.add(new PlayerModel());
		},
		/**
		 * Toggles between view and edit mode
		 */
		toggleEditPlayersMode: function() {
			
			if (this.$(".home-players").hasClass("editing")) {
				/* switch to view mode */
				this.$(".home-players").removeClass("editing");
				this.$("#btn-edit-players").html("Bearbeiten");
			} else {
				/* switch to edit mode */
				this.$(".home-players").addClass("editing");
				this.$("#btn-edit-players").html("Fertig");
			}
		}
	});
	var app = new AppView;
			
})();