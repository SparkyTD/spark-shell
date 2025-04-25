import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import Mexp from "../../../node_modules/math-expression-evaluator/src/index";

export class CalculatorProvider extends ActionProvider {
    queryResults(query: string): ActionResult[] | null {
        if (!query || query.length == 0)
            return null;

        try {
            const mexp = new Mexp();
            let lexed = mexp.lex(query);
            let postfix = mexp.toPostfix(lexed);
            let result = mexp.postfixEval(postfix);
            return [new CalculatorResult(result)];
        } catch (e) {
            return [];
        }
    }
}

class CalculatorResult extends ActionResult {
    private readonly result: any;

    constructor(result: any) {
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