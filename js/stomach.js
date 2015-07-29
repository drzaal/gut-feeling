/**
 * Our stomach object. Here is where we want to start moving things like
 * the digestion handling. Organize things, make our life a little easier.
 */
var Stomach = function( args ) {
	if (args === undefined) {
		args = {};
	}
	var self = this;
	// Naturelment, we need a base html element to affix to. Default to body if we don't find one.
	self.html = args.html || $(args.selector) || $("body");

	this.q;

	this.q = new ActionEventQ({
		"default_action" : this.digest,
		"selector" : self.html,	
		"tween" : "top_feed"
	});

}
