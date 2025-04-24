import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";

export class CalculatorProvider extends ActionProvider {
    matchInput(input: string): boolean {
        return !!input && input.length > 0;
    }

    queryResults(query: string): ActionResult[] {
        try {
            const result = this.evaluateExpression(query);
            return [new CalculatorResult(result)];
        } catch (e) {
            return [];
        }
    }

    private evaluateExpression(expression: string): number {
        expression = expression.replace(/\s+/g, '');

        const parser = new ExpressionParser(expression);
        return parser.parse();
    }
}

class ExpressionParser {
    private pos = 0;
    private readonly expression: string;

    constructor(expression: string) {
        this.expression = expression;
    }

    parse(): number {
        const result = this.parseAddSubtract();

        if (this.pos < this.expression.length) {
            throw new Error('Unexpected character: ' + this.expression[this.pos]);
        }

        return result;
    }

    private parseAddSubtract(): number {
        let left = this.parseMultiplyDivide();

        while (this.pos < this.expression.length) {
            const operator = this.expression[this.pos];
            if (operator !== '+' && operator !== '-') break;
            this.pos++;

            const right = this.parseMultiplyDivide();
            if (operator === '+') {
                left += right;
            } else {
                left -= right;
            }
        }

        return left;
    }

    private parseMultiplyDivide(): number {
        let left = this.parsePower();

        while (this.pos < this.expression.length) {
            const operator = this.expression[this.pos];
            if (operator !== '*' && operator !== '/') break;
            this.pos++;

            const right = this.parsePower();
            if (operator === '*') {
                left *= right;
            } else {
                if (right === 0) {
                    throw new Error('Division by zero');
                }
                left /= right;
            }
        }

        return left;
    }

    private parsePower(): number {
        let left = this.parseUnary();

        if (this.pos < this.expression.length && this.expression[this.pos] === '^') {
            this.pos++; // Skip '^'

            const right = this.parsePower();
            left = Math.pow(left, right);
        }

        return left;
    }

    private parseUnary(): number {
        if (this.pos < this.expression.length && this.expression[this.pos] === '-') {
            this.pos++; // Skip '-'
            return -this.parseUnary();
        }

        if (this.pos < this.expression.length && this.expression[this.pos] === '+') {
            this.pos++; // Skip '+'
            return this.parseUnary();
        }

        return this.parseTerm();
    }

    private parseTerm(): number {
        if (this.pos < this.expression.length && this.expression[this.pos] === '(') {
            this.pos++; // Skip '('
            const result = this.parseAddSubtract();

            if (this.pos >= this.expression.length || this.expression[this.pos] !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            this.pos++; // Skip ')'
            return result;
        }

        return this.parseNumber();
    }

    private parseNumber(): number {
        if (this.pos >= this.expression.length) {
            throw new Error('Unexpected end of expression');
        }

        let start = this.pos;

        if (this.pos + 1 < this.expression.length &&
            this.expression.substring(this.pos, this.pos + 2) === '0x') {
            this.pos += 2; // Skip '0x'
            start = this.pos;

            if (this.pos >= this.expression.length ||
                !(/[0-9A-Fa-f]/).test(this.expression[this.pos])) {
                throw new Error('Invalid hexadecimal number');
            }

            while (this.pos < this.expression.length &&
            (/[0-9A-Fa-f]/).test(this.expression[this.pos])) {
                this.pos++;
            }

            const hexValue = this.expression.substring(start, this.pos);
            return parseInt(hexValue, 16);
        }

        if (this.pos + 1 < this.expression.length &&
            this.expression.substring(this.pos, this.pos + 2) === '0b') {
            this.pos += 2; // Skip '0b'
            start = this.pos;

            if (this.pos >= this.expression.length ||
                !(/[01]/).test(this.expression[this.pos])) {
                throw new Error('Invalid binary number');
            }

            while (this.pos < this.expression.length &&
            (/[01]/).test(this.expression[this.pos])) {
                this.pos++;
            }

            const binaryValue = this.expression.substring(start, this.pos);
            return parseInt(binaryValue, 2);
        }

        let hasDigits = false;
        let hasDecimalPoint = false;

        while (this.pos < this.expression.length) {
            const char = this.expression[this.pos];

            if (/[0-9]/.test(char)) {
                hasDigits = true;
                this.pos++;
            } else if (char === '.' && !hasDecimalPoint) {
                hasDecimalPoint = true;
                this.pos++;
            } else {
                break;
            }
        }

        if (!hasDigits) {
            throw new Error('Invalid number');
        }

        const decimalValue = this.expression.substring(start, this.pos);
        return parseFloat(decimalValue);
    }
}

class CalculatorResult extends ActionResult {
    private readonly result: number;

    constructor(result: number) {
        super();
        this.result = result;
    }

    getTitle(): string {
        return `${this.result}`;
    }

    getAction(): ActionCallback | null {
        return null;
    }

    getIconName(): string | null {
        return "accessories-calculator-symbolic";
    }

    getCategoryName(): string {
        return "Calculator";
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["description"]}>
                =&nbsp;
            </label>,
            <label cssClasses={["title"]}>{this.getTitle()}</label>
        ];
    }
}

export function testMain() {
    let tokens = tokenizeExpression("-(1 + 1/2*13)");
    let stack = infixToReversePolish(tokens);
    console.log(stack);
}

enum Operator {
    Addition = "Addition",
    Subtraction = "Subtraction",
    Multiplication = "Multiplication",
    Division = "Division",
    Power = "Power",
}

enum Parenthesis {
    Opening = "Opening",
    Closing = "Closing",
}

type Token = number | Operator | Parenthesis;

function tokenizeExpression(expression: string): Token[] {
    let tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        // Handle numbers
        if (isDigit(char) || (char === '0' && i + 1 < expression.length && /[xXbB]/.test(expression[i + 1]))) {
            // Check for hexadecimal (0x...)
            if (char === '0' && i + 1 < expression.length && /[xX]/.test(expression[i + 1])) {
                let j = i + 2; // Start after '0x'
                while (j < expression.length && isHexDigit(expression[j])) {
                    j++;
                }

                if (j > i + 2) { // Ensure at least one hex digit
                    const hexStr = expression.substring(i, j);
                    tokens.push(parseInt(hexStr, 16));
                    i = j;
                } else {
                    throw new Error('Invalid hexadecimal number');
                }
                continue;
            }

            // Check for binary (0b...)
            if (char === '0' && i + 1 < expression.length && /[bB]/.test(expression[i + 1])) {
                let j = i + 2; // Start after '0b'
                while (j < expression.length && isBinaryDigit(expression[j])) {
                    j++;
                }

                if (j > i + 2) { // Ensure at least one binary digit
                    const binStr = expression.substring(i + 2, j); // Extract binary digits without '0b'
                    tokens.push(parseInt(binStr, 2));
                    i = j;
                } else {
                    throw new Error('Invalid binary number');
                }
                continue;
            }

            // Handle decimal
            let j = i;
            let hasDecimalPoint = false;

            while (j < expression.length && (isDigit(expression[j]) || expression[j] === '.')) {
                if (expression[j] === '.') {
                    if (hasDecimalPoint) {
                        throw new Error('Invalid decimal number: multiple decimal points');
                    }
                    hasDecimalPoint = true;
                }
                j++;
            }

            const numStr = expression.substring(i, j);
            tokens.push(parseFloat(numStr));
            i = j;
            continue;
        }

        switch (char) {
            case '+':
                tokens.push(Operator.Addition);
                break;
            case '-':
                tokens.push(Operator.Subtraction);
                break;
            case '*':
                tokens.push(Operator.Multiplication);
                break;
            case '/':
                tokens.push(Operator.Division);
                break;
            case '^':
                tokens.push(Operator.Power);
                break;
            case '(':
                tokens.push(Parenthesis.Opening);
                break;
            case ')':
                tokens.push(Parenthesis.Closing);
                break;
            default:
                throw new Error(`Unexpected character: ${char} at position ${i}`);
        }

        i++;
    }

    return tokens;
}

function infixToReversePolish(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const operatorStack: (Operator | Parenthesis)[] = [];

    // Helper function to get operator precedence
    function getPrecedence(op: Operator, isUnary: boolean = false): number {
        if (isUnary && op === Operator.Subtraction) {
            return 4; // Highest precedence for unary minus
        }

        switch (op) {
            case Operator.Addition:
            case Operator.Subtraction:
                return 1;
            case Operator.Multiplication:
            case Operator.Division:
                return 2;
            case Operator.Power:
                return 3;
            default:
                return 0;
        }
    }

    // Helper to check if a token is an operator
    function isOperator(token: Token): token is Operator {
        return typeof token === 'number' ? false :
            Object.values(Operator).includes(token as Operator);
    }

    // Process each token
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // If the token is a number, add it to the output queue
        if (typeof token === 'number') {
            output.push(token);
        }
        // If the token is an operator
        else if (isOperator(token)) {
            const op = token as Operator;

            // Check for unary minus (negation)
            const isUnary = op === Operator.Subtraction &&
                (i === 0 ||
                    (tokens[i - 1] !== Parenthesis.Closing &&
                        typeof tokens[i - 1] !== 'number'));

            if (isUnary) {
                // For unary minus, we push a 0 to the output
                // This will represent negation as "0 - value" in RPN
                output.push(0);
            }

            // Normal operator processing, handling associativity correctly
            while (
                operatorStack.length > 0 &&
                isOperator(operatorStack[operatorStack.length - 1]) &&
                (getPrecedence(op, isUnary) < getPrecedence(operatorStack[operatorStack.length - 1] as Operator) ||
                    (getPrecedence(op, isUnary) === getPrecedence(operatorStack[operatorStack.length - 1] as Operator) &&
                        op !== Operator.Power)) // Power has right-to-left associativity
                ) {
                output.push(operatorStack.pop()!);
            }

            operatorStack.push(op);
        }
        // If the token is an opening parenthesis, push it onto the operator stack
        else if (token === Parenthesis.Opening) {
            operatorStack.push(token);
        }
        // If the token is a closing parenthesis
        else if (token === Parenthesis.Closing) {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== Parenthesis.Opening
                ) {
                output.push(operatorStack.pop()!);
            }

            // Pop the opening parenthesis
            if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === Parenthesis.Opening) {
                operatorStack.pop();
            } else {
                throw new Error('Mismatched parentheses');
            }
        }
    }

    // Pop any remaining operators from the stack and add them to the output
    while (operatorStack.length > 0) {
        const op = operatorStack.pop()!;
        if (op === Parenthesis.Opening || op === Parenthesis.Closing) {
            throw new Error('Mismatched parentheses');
        }
        output.push(op);
    }

    return output;
}

function isDigit(char: string): boolean {
    return /[0-9]/.test(char);
}

function isHexDigit(char: string): boolean {
    return /[0-9a-fA-F]/.test(char);
}

function isBinaryDigit(char: string): boolean {
    return /[01]/.test(char);
}