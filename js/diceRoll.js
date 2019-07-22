(function(window){
	'use strict';
	var
		Int32Array = window['Int32Array'],
		ArrayBuffer = window['ArrayBuffer']
	;
/**
* Creates dice roll object.
* @param spec The specification string, of the format '1d+10', '2d4', '3d-5' etc. 'd' defaults to 6.
* @constructor
*/
function diceRoll(spec){
	if(typeof(spec) == 'undefined'){
		spec = '1d';
	}else if(typeof(spec) != 'string'){
		throw new Error('Specification must be string.');
	}
	if(!diceRoll['regex'].test(spec)){
		throw new Error('Specification not valid.');
	}
	var
		res = spec.match(diceRoll['regex']),
		type = [],
		rolls = 0,
		sides = 0
	;
	if(res.length < 3 || res[2] == '' || typeof(res[2]) == 'undefined'){
		res[2] = '+0';
	}
	this._op = res[2][0];
	this._num=parseInt(res[2].substring(1), 10);
	if(this._op == '\/' && this._num == 0){
		throw new Error('Specification will divide by zero.');
	}

	type = res[1].split('d');
	rolls = parseInt(type[0], 10);
	if(type[1] == 0){
		type[1] = '6';
	}
	sides = parseInt(type[1], 10);
	if(sides < 2){
		throw new Error('Die sides cannot be less than 2.');
	}
	this._min = rolls;
	this._max = rolls*sides;
}

diceRoll['regex'] = /(\d+d\d*)\s*([\+\-\*\/]\d+)?/;

/**
* Makes one roll of the specification.
* @return A result of 'rolling' the specification.
*/
diceRoll.prototype.roll = function(){
	var
		roll = (Math.floor(Math.random() * (this._max - this._min + 1)) + this._min)
	;
	switch(this._op){
		case '+':
			roll += this._num;
		break;
		case '-':
			roll += (this._num * -1);
		break;
		case '*':
			if(this._num != 1){
				roll *= this._num;
			}
		break;
		case '\/':
			if(this._num != 1){
				roll /= this._num;
			}
		break;
	}

	return roll;
};

/**
* Makes multiple rolls of the specification.
* @param n The number of times to roll the specification.
* @return An array of results.
* @see diceRoll.prototype.roll
*/
diceRoll.prototype.multiRoll = function(n, forceArrayObj){
	if(typeof(n) != 'number' && typeof(n) != 'string'){
		throw new Error('Parameter must be number or string.');
	}else if(typeof(n) == 'string' && !/\d+/.test(n)){
		throw new Error('Parameter should be a parseable integer.');
	}
	n == typeof(n) == 'number' ? Math.max(1, Math.floor(n)) : parseInt(n, 10);
	forceArrayObj = !!forceArrayObj;
	var
		res = []
	;
	if(ArrayBuffer && Int32Array && !forceArrayObj){
		res = new Int32Array(new ArrayBuffer(n * 4));
		for(var i=0;i<n;++i){
			res[i] = this['roll']();
		}
	}else{
		for(var i=0;i<n;++i){
			res.push(this['roll']());
		}
	}
	return res;
};
	diceRoll.prototype = {
		'roll' : diceRoll.prototype.roll,
		'multiRoll' : diceRoll.prototype.multiRoll
	};
	window['diceRoll'] = diceRoll;

})(window);
