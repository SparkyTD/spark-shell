import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";
import {Variable, GLib} from "astal";
import Soup from "gi://Soup?version=3.0";

export class CurrencyExchangeProvider extends ActionProvider {
    private static readonly REGEX = /^\s*(?<value>[\d.]+)\s*(?<from>[a-zA-Z]{3})\s*[tT][oO]\s*(?<to>[a-zA-Z]{3})\s*$/;

    queryResults(query: string): ActionResult[] | null {
        if (!CurrencyExchangeProvider.REGEX.test(query))
            return null;

        let result = CurrencyExchangeProvider.REGEX.exec(query);
        if (!result || result.length != 4) {
            return [];
        }

        const value = Number.parseFloat(result[1]);
        const from = result[2].toUpperCase();
        const to = result[3].toUpperCase();

        if (!isCurrencyValid(from) || !isCurrencyValid(to)) {
            return [];
        }

        let resultValue: Variable<number | null> = Variable(null);

        let session = new Soup.Session();
        let message = Soup.Message.new('GET', `https://open.er-api.com/v6/latest/${from}`);
        session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
            let response = session?.send_and_read_finish(result);
            let responseText = new TextDecoder().decode(response?.toArray());
            let data = JSON.parse(responseText);

            resultValue.set(data.rates[to] * value);
        });

        return [new CurrencyExchangeResult(from, to, value, resultValue)];
    }
}

class CurrencyExchangeResult extends ActionResult {
    private readonly sourceCurrency: string;
    private readonly targetCurrency: string;
    private sourceValue: number;
    private resultValue: Variable<number | null>

    constructor(sourceCurrency: string, targetCurrency: string, sourceValue: number, resultValue: Variable<number | null>) {
        super();

        this.sourceCurrency = sourceCurrency;
        this.targetCurrency = targetCurrency;
        this.sourceValue = sourceValue;
        this.resultValue = resultValue;
    }

    getTitle(): string {
        return "TODO";
    }

    getAction(): ActionCallback | null {
        return null;
    }

    getIconName(): string | null {
        return null; //"accessories-calculator-symbolic";
    }

    getCategoryName(): string {
        return "Currency Exchange";
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["description"]}>
                {`${this.sourceValue.toFixed(2)} ${this.sourceCurrency} = `}
            </label>,
            this.resultValue().as(result =>
                <label cssClasses={["title"]}>
                    {result == null ? "Loading..." : `${result?.toFixed(2)} ${this.targetCurrency}`}
                </label>
            )
        ];
    }
}

function isCurrencyValid(code: string): boolean {
    return [
        "USD", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT",
        "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF",
        "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN",
        "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD",
        "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD",
        "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR",
        "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK",
        "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP",
        "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD",
        "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP",
        "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF",
        "XCD", "XCG", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
    ].includes(code);
}