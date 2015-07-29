var vector2 = function( a, b ) {
	this.x = 0;
	this.y = 0;


	/* Assign vector value. */
	this.set = function( a, b ) {
		if ( b !== undefined && b !== null ) {
			if ( a !== undefined && a !== null ) {
				this.x = a, this.y = b;	
			}
		}
		else {
			if ( a !== undefined && a !== null && a.constructor === Array  && a.length == 2 ) {
				this.x = a[0], this.y = a[1];
			}
		}
	}
	/* Vector Arithmetic */
	this.add = function( v2 ) {
		if ( vector2.valid( v2 )) {
			return new vector2( this.x + v2.x, this.y + v2.y);
		}
		else { return false; }
	}
	this.sub = function( v2 ) {
		if ( vector2.valid( v2 )) {
			return new vector2( this.x - v2.x, this.y - v2.y);
		}
		else { return false; }
	}
	/* Dot Product */
	this.dot = function( v2 ) {
		if ( vector2.valid( v2 )) {
			return this.x * v2.x + this.y * v2.y; 
		}
		else { return false; }
	}
	this.mag = function() {
		return Math.sqrt( this.x * this.x + this.y * this.y );
	}
	this.normal = function () {
		var l = this.mag();
		return new vector2( this.x / l, this.y / l );
	}

	this.set( a, b );
};
/* Just in case we don't call the dot product from an instance. */
vector2.dot = function( v1, v2 ) {
	if ( vector2.valid(v1) && vector2.valid(v2) ) {
		return v1.x*v2.x + v1.y*v2.y;
	}
};
vector2.valid = function( v ) {
	return ( v.constructor === vector2 );
	if ( v.constructor === "vector2" ) {
		return true;
	} else {
		return false;
	}
};
vector2.add = function( v1, v2 ) {
	if ( vector2.valid( v1 ) && vector2.valid( v2 )) {
		return new vector2( v1.x + v2.x, v1.y + v2.y);
	}
	else { return false; }
};
vector2.sub = function( v1, v2 ) {
	if ( vector2.valid( v1 ) && vector2.valid( v2 )) {
		return new vector2( v1.x - v2.x, v1.y - v2.y);
	}
	else { return false; }
};
