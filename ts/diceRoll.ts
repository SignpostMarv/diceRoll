export const DiceRollRegex = /((?<count>\d+)d(?<faces>\d*))\s*(?:(?<modifieraction>[\+\-\*\/])(?<modifiercount>\d+))?/;

export type DiceRollModifierActions = '+'|'-'|'*'|'/';

export interface DiceRollRegexMatches extends RegExpExecArray {
	groups: {
		count:string,
		faces:string,
		modifieraction:DiceRollModifierActions,
		modifiercount:string,
	}
};

export interface DiceRollModifier
{
	readonly action:DiceRollModifierActions;
	readonly modifier:BigInt;
}

/**
* Creates dice roll object.
*/
export class DiceRoll
{
	/**
	* ```typescript
	* const instance = new DiceRoll('2d10+4');
	* const assert = 2 === instace.count;
	* ```
	*/
	readonly count:number;

	/**
	* ```typescript
	* const instance = new DiceRoll('2d10+4');
	* const assert = 10 === instace.faces;
	* ```
	*/
	readonly faces:number;

	/**
	* ```typescript
	* const instance = new DiceRoll('2d10+4');
	* const assert_action = '+' === instace.modifier.action;
	* const assert_modifier = 4n === instace.modifier.modifier;
	* ```
	*/
	readonly modifier:DiceRollModifier;

	/**
	* ```typescript
	* const instance = new DiceRoll('2d10+4');
	* ```
	*
	* @param spec The specification string, of the format '1d+10', '2d4', '3d-5' etc. 'd' defaults to 6.
	*/
	constructor(spec:string)
	{
		const matches = <DiceRollRegexMatches|null> DiceRollRegex.exec(spec);

		if ( ! matches) {
			throw new Error('Specification not valid.');
		}

		this.count = parseInt(matches.groups.count, 10);
		this.faces =
			'' === matches.groups.faces
				? 6
				: parseInt(matches.groups.faces);

		this.modifier = <DiceRollModifier> Object.seal({
			action: matches.groups.modifieraction,
			modifier: BigInt(matches.groups.modifiercount),
		});

		Object.seal(this);

		if (
			'/' === this.modifier.action &&
			'0' === matches.groups.modifiercount
		) {
			throw new Error('Specification will divide by zero.');
		}
	}

	/**
	* Makes one roll of the specification.
	*
	* ```typescript
	* (new DiceRoll('2d10+4')).roll();
	* ```
	*
	* @return BigInt a result of 'rolling' the specification.
	*/
	roll() : BigInt
	{
		let roll = BigInt(
			Math.floor(
				Math.random() *
				(
					(
						this.faces *
						this.count
					) -
					this.count +
					1
				)
			) +
			this.count
		);

		switch (this.modifier.action)
		{
			case '+':
				roll += BigInt(this.modifier.modifier);
				break;
			case '-':
				roll -= BigInt(this.modifier.modifier);
				break;
			case '*':
				roll *= BigInt(this.modifier.modifier);
				break;
			case '/':
				roll /= BigInt(this.modifier.modifier);
				break;
		}

		return roll;
	}

	/**
	* Makes multiple rolls of the specification.
	*
	* ```typescript
	* (new DiceRoll('2d10+4')).multiRoll(10);
	* ```
	*
	* @param n The number of times to roll the specification.
	*
	* @return Array<BigInt> An array of results.
	*/
	multiRoll(n:number) : Array<BigInt> {
		const res = (<Array<BigInt>> []).fill(BigInt(0), 0, n);

			for (let i=0; i<n; i+= 1) {
				res.push(this.roll());
			}

		return res;
	}
}

export default DiceRoll;
