/**
 * Actionable events queue.
 * Provides structure for real time events which require decisionmaking.
 * Can handle callbacks.
 * @requires jquery
 * @requires jquery.ui
 */

var ActionEventQ = function( args ) {
	var self = this;
	self.action_def = [];
	self.q = [];
	self.triggered = [];
	self.defaults = {
		expiry: 15000,
		callback: null,
		style: {}
	};
	self.html = $(args.selector) || $("body");

	/* This is its own thing because we want it to respond to user input and clicks.*/
	self.triggerEvent = function ( weight ) {
		self.triggered.push( self.action_def[weight] );
	};
	/* Process all triggers into active state. Doing this so that I can make it happen at a safe time */
	self.processTriggers = function ( trigger ) {
		self.triggered.forEach(function(a) {
			var tmp_action = new ActionEventOne( self, a );
			self.q.push( tmp_action );
			self.html.append( tmp_action.view );
			
		});
		self.triggered = null;
	}
	self.defineEvent = function ( obj ) {
		if (!obj || !obj.title)
		{
			return false;
		}

		self.action_def.push( obj );

	};
	self.loadDef = function( obj ) {
		console.log ( this );
		console.log( self );
		var i, imax=obj.length;

		if ( self.defineEvent( obj ))
		{
			return true;
		}
		for (i=0;i<imax;i++) {
			self.defineEvent( obj[i] );
		}
	};
	self.clearAll = function() {

	};
	self.update = function( delta ) {
		var i,imax = self.q.length;

		for (i=imax-1;i>=0;i--) {
			self.q[i].expiry -= delta;
			if (self.q[i].expiry <= 0) {
				self.q[i].action( self.q[i].default_callback );
			}
			
		}
	}
	/* Define the Individual action event data object. This should make life easier to handle */
	var ActionEventOne = function( parent, args ) {
		var self = this;
		self.parent = parent;
		self.title = args.title ? args.title : "";
		self.descr = args.descr ? args.descr : "";
		self.expiry = args.expiry || self.parent.defaults.expiry; // How long our action event lasts.
		self.actions = args.actions || []; // An action probably should have a text descriptor and a callback
		self.html = null;

		self.view = function(){
			var tmpl = '<div class="action-event-pane">' +
				'<p class="action-event-title">' + self.title + '</p>' +
				'<p class="action-event-descr">' + self.descr + '</p>' +
				'</div>';
			var elmt = $(tmpl);
			self.actions.forEach(function(a) {
				var action_button = elmt.append('<button type="button">' + a.text + '</button>');
				action_button.click(function() {
					self.resolve_action( a.callback );
				});
			});

			self.html = elmt;
			return elmt;
		};
		self.resolve_action = function ( callback, args ) {
			if (callback) {
				callback();
			}
			self.html.remove(); // This is a bit abrupt, should tween the object when destroying.
			self.html = null;
			self.actions = null;
			self = null;
		}
	};
}
	//created named var here so it can be called on gameStart
var actionPanelUpdate = function() {
	$("body").append('<div id="action-event-panel"></div>');
	$.getJSON("js/test-actions.json", function(data, status, jqXHR) {
		var aeq = new ActionEventQ({ selector: "#action-event-panel" });
		aeq.loadDef( data );

		aeq.triggerEvent(0);
		aeq.triggerEvent(2);

		aeq.processTriggers();
	});
};
