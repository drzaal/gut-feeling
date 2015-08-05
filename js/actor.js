/**
 * An actor is any Sprite which appears on the Stage and has an animation.
 * This should implement a Factory pattern, as there are a number of possible
 * actors which we might see in game. And we want them to intelligently load assets
 * up front.
 /*
var Actor = new function() {
	var self = this;
	self.sprite = null; // Renderer Object
	self.playhead = 0; // Keyframe location
	self.state = null; // Active Animation

};

/**
 * Here is our constructor
 * @param string actor_name Identifying name for the Actor object.
 */
Actor.create = function( actor_name ) {


};

/*
 * Want to be able to create our animations independently of the actual actors.
 * This is because I am going to be using a lot of actors of the same type. They
 * must share resources!
 */
var Animation = new function( resource_json ) {
}
