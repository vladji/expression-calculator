function eval() {
	// Do not use eval!!!
	return;
}

function expressionCalculator(expr) {
	let pExp = postfix(expr);
	let firstN;
	let secondN;
	const calc = {
		'*': (x, y) => x * y,
		'/': (x, y) => x / y,
		'+': (x, y) => x + y,
		'-': (x, y) => x - y,
	}

	for (let i = 0; i < pExp.length; i++) {
		if (isFinite(pExp[i]) && isFinite(pExp[i + 1]) && isNaN(pExp[i + 2])) {
			firstN = +pExp[i];
			secondN = +pExp[i + 1];
			let res = calc[pExp[i + 2]](firstN, secondN);

			if (!isFinite(res)) throw new Error('TypeError: Division by zero.');
			pExp.splice(i, 3, res);
			i = -1;
		}
	}

	if (pExp.length > 1) throw new Error('ExpressionError: Brackets must be paired');

	let result = pExp.pop();
	result = +result.toFixed(4);
	return result;
}

function postfix(expr) {
	let toCalc = [];
	let opStack = [];
	const opPrec = { '*': 2, '/': 2, '+': 1, '-': 1 }

	expr = expr.replace(/\s+/g, '');
	let expArr = [];

	// String parcer
	for (let i of expr) {
		if (!isFinite(i)) {
			const pos = expr.indexOf(i);
			const piece = expr.slice(0, pos);
			expArr.push(piece);
			expArr.push(i);
			expr = expr.slice(pos + 1);
		}
	}
	expArr.push(expr); // push rest of the string after parcing

	// function for excrtacting token from stack, whenever the rules are matched
	function extractToken(arr) {
		for (let i = arr.length - 1; arr[i] != '(' && arr.length; i--) {
			toCalc.push(arr[i]);
			opStack.pop();
		}
	}

	for (let i = 0; i < expArr.length; i++) {
		let symb = expArr[i];

		// check for the rest ("") of string
		if (symb === '' && expArr[i + 1]) {
			symb = expArr[i + 1];
			i += 1;
		} else if (symb === '' && !expArr[i + 1]) {
			break;
		}

		// Operator chek
		if (isNaN(symb)) {
			if (opStack.length) {

				// if operator is a bracket
				if (symb === '(') {
					opStack.push(symb);
				} else if (symb === ')') {
					extractToken(opStack);
					if (opStack.length) {
						opStack.pop();
					} else {
						throw new Error('ExpressionError: Brackets must be paired');
					}
				} else { // compare operator precedence and do something
					const topToken = opStack[opStack.length - 1]
					if (opPrec[symb] < opPrec[topToken]) {
						extractToken(opStack);
						opStack.push(symb);

					} else if (opPrec[symb] === opPrec[topToken]) {
						const temOp = opStack.pop();
						toCalc.push(temOp);
						opStack.push(symb);
					} else {
						opStack.push(symb);
					}
				}
			} else {
				opStack.push(symb);
			}
		} else {
			toCalc.push(symb);
		}
	}

	if (opStack.length) {
		opStack.reverse();
		for (let item of opStack) {
			toCalc.push(item);
		}
	}
	return toCalc;
}

module.exports = {
	expressionCalculator
}