# About diceRoll

diceRoll is a simple library for parsing strings commonly used in pen & paper RPGs then generating dice rolls.

## Examples
```typescript
const instance = new DiceRoll('2d10+4');
const assert = 2 === instace.count;
const assert = 10 === instace.faces;
const assert_action = '+' === instace.modifier.action;
const assert_modifier = 4n === instace.modifier.modifier;

(new DiceRoll('2d10+4')).roll();

(new DiceRoll('2d10+4')).multiRoll(10);
```
