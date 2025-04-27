import {GLib} from "astal";
import {match, P} from 'ts-pattern';
import {TimeZoneInfo, timezones} from "./timezones";

type DateTimeToken = {
    token_type: TokenType;
    datetime: GLib.DateTime;
    hint: 'dateonly' | 'timeonly' | 'datetime';
    original: string;
}

type TimeSpanToken = {
    token_type: TokenType;
    number: number;
    type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
}

enum Operator {
    Add = 1,
    Subtract = 2,
    ConvertTo = 3,
}

type OperatorToken = {
    token_type: TokenType;
    operator: Operator;
}

type TimeZoneToken = {
    token_type: TokenType;
    info: TimeZoneInfo,
}

type TokenType = 'DateTime' | 'TimeSpan' | 'Operator' | 'TimeZone';
type Token = DateTimeToken | TimeSpanToken | OperatorToken | TimeZoneToken;

export type EvaluationResult = {
    inputDateTime: GLib.DateTime;
    inputTimeZone: TimeZoneInfo;
    inputDisplayFormat: string;

    resultDateTime: GLib.DateTime;
    resultTimeZone: TimeZoneInfo;
    resultDisplayFormat: string;
}

export function evaluateExpression(input: string): EvaluationResult | null {
    let tokens = parseExpression(input);
    if (!tokens)
        return null;

    // console.log("Parsing", tokens);
    return match(tokens)

        // From time (no TZ) to TimeZone
        .with([
            {token_type: 'DateTime', datetime: P.instanceOf(GLib.DateTime)},
            {token_type: 'Operator', operator: Operator.ConvertTo},
            {token_type: 'TimeZone', info: {offset_hhmm: P.string}},
        ], ([tFromTime, _, tToTimeZone]) => {
            let fromDateTime = tFromTime.datetime;
            let toTimeZone = GLib.TimeZone.new_identifier(tToTimeZone.info.offset_hhmm);
            let resultDateTime = fromDateTime.to_timezone(toTimeZone)!;
            let fromTimeZone = timezones.find(tz => tz.abbr == fromDateTime.get_timezone_abbreviation())!;

            return {
                inputDateTime: fromDateTime,
                inputTimeZone: fromTimeZone,
                inputDisplayFormat: "",
                resultDateTime: resultDateTime,
                resultTimeZone: tToTimeZone.info,
                resultDisplayFormat: getResultFormat(fromDateTime, resultDateTime),
            } as EvaluationResult
        })

        // From time + TZ to TimeZone
        .with([
            {token_type: 'DateTime', datetime: P.instanceOf(GLib.DateTime)},
            {token_type: 'TimeZone', info: {offset_hhmm: P.string}},
            {token_type: 'Operator', operator: Operator.ConvertTo},
            {token_type: 'TimeZone', info: {offset_hhmm: P.string}},
        ], ([tFromTime, tFromTimeZone, _, tToTimeZone]) => {
            let fromDateTimeUtc = GLib.DateTime.new_utc(
                tFromTime.datetime.get_year(),
                tFromTime.datetime.get_month(),
                tFromTime.datetime.get_day_of_month(),
                tFromTime.datetime.get_hour(),
                tFromTime.datetime.get_minute(),
                tFromTime.datetime.get_second(),
            );
            let fromDateTime = GLib.DateTime.new_from_iso8601(
                fromDateTimeUtc.format_iso8601()!.split('Z')[0] + tFromTimeZone.info.offset_hhmm,
                null,
            );

            let toTimeZone = GLib.TimeZone.new_identifier(tToTimeZone.info.offset_hhmm);
            let resultDateTime = fromDateTime.to_timezone(toTimeZone)!;
            let fromTimeZone = timezones.find(tz => tz.abbr == fromDateTime.get_timezone_abbreviation())!;

            return {
                inputDateTime: fromDateTime,
                inputTimeZone: fromTimeZone,
                inputDisplayFormat: "",
                resultDateTime: resultDateTime,
                resultTimeZone: tToTimeZone.info,
                resultDisplayFormat: getResultFormat(fromDateTime, resultDateTime),
            } as EvaluationResult
        })

        // Time +- timespan

        .with([
            {token_type: 'DateTime', datetime: P.instanceOf(GLib.DateTime)},
            {token_type: 'Operator', operator: P.union(Operator.Add, Operator.Subtract)},
            {
                token_type: 'TimeSpan',
                number: P.number,
                type: P.union('seconds', 'minutes', 'hours', 'days', 'months', 'years')
            },
        ], ([tStartDate, operator, timeSpan]) => {
            let resultDate = tStartDate.datetime;
            let multiplier = operator.operator == Operator.Subtract ? -1 : 1;
            let number = timeSpan.number;
            let fromTimeZone = timezones.find(tz => tz.abbr == tStartDate.datetime.get_timezone_abbreviation())!;


            if (timeSpan.type == 'seconds') resultDate = resultDate.add_seconds(number * multiplier)!;
            if (timeSpan.type == 'minutes') resultDate = resultDate.add_minutes(number * multiplier)!;
            if (timeSpan.type == 'hours') resultDate = resultDate.add_hours(number * multiplier)!;
            if (timeSpan.type == 'days') resultDate = resultDate.add_days(number * multiplier)!;
            if (timeSpan.type == 'months') resultDate = resultDate.add_months(number * multiplier)!;
            if (timeSpan.type == 'years') resultDate = resultDate.add_years(number * multiplier)!;

            return {
                inputDateTime: tStartDate.datetime,
                inputTimeZone: fromTimeZone,
                inputDisplayFormat: "",
                resultDateTime: resultDate,
                resultTimeZone: fromTimeZone,
                resultDisplayFormat: getResultFormat(tStartDate.datetime, resultDate),
            } as EvaluationResult
        })

        .otherwise(() => null);

    function getResultFormat(from: GLib.DateTime, to: GLib.DateTime): string {
        if (from.get_day_of_month() != to.get_day_of_month())
            return "%B %-e, %Y %-I:%M %p";
        else
            return "%-I:%M %p";
    }
}

function parseExpression(input: string): Token[] | null {
    let tokens = [];
    let lastLength = input.length;
    while (input.length > 0) {
        input = input.trim();
        let dateTimeResult = tryParseDateTime(input);
        if (!!dateTimeResult) {
            input = dateTimeResult[1];
            tokens.push(dateTimeResult[0]);
        } else {
            let timeSpanResult = tryParseTimeSpanToken(input);
            if (!!timeSpanResult) {
                input = timeSpanResult[1];
                tokens.push(timeSpanResult[0]);
            } else {
                let operatorMatch = tryParseOperatorToken(input);
                if (!!operatorMatch) {
                    input = operatorMatch[1];
                    tokens.push(operatorMatch[0]);
                } else {
                    let timezoneMatch = tryParseTimeZoneOnlyToken(input);
                    if (!!timezoneMatch) {
                        input = timezoneMatch[1];
                        tokens.push(timezoneMatch[0]);
                    }
                }
            }
        }

        if (lastLength === input.length) {
            return null;
        }
        lastLength = input.length;
    }

    return tokens;
}

function tryParseDateTime(input: string): [DateTimeToken, string] | null {
    let localNowRaw = GLib.DateTime.new_now_local();
    let localNow = GLib.DateTime.new_local(
        localNowRaw.get_year(),
        localNowRaw.get_month(),
        localNowRaw.get_day_of_month(),
        localNowRaw.get_hour(),
        localNowRaw.get_minute(),
        localNowRaw.get_second(),
    );

    // Simple relative statements
    let relativeMatch = /^now|today|yesterday|tomorrow/i.exec(input);
    if (!!relativeMatch) {
        let word = relativeMatch[0];
        let dateTime: DateTimeToken = {
            token_type: 'DateTime',
            original: word,
            hint: (() => {
                switch (word.toLowerCase()) {
                    case "now":
                        return "timeonly"
                    case "today":
                        return "dateonly"
                    case "yesterday":
                        return "dateonly"
                    case "tomorrow":
                        return "dateonly"
                }
            })()!,
            datetime: localNow,
        }

        if (word.toLowerCase() !== "now") {
            dateTime.datetime = dateTime.datetime
                .add_hours(-dateTime.datetime.get_hour())!
                .add_minutes(-dateTime.datetime.get_minute())!
                .add_seconds(-dateTime.datetime.get_second())!
        }
        if (word.toLowerCase() === "yesterday") {
            dateTime.datetime = dateTime.datetime
                .add_days(-1)!;
        }
        if (word.toLowerCase() === "tomorrow") {
            dateTime.datetime = dateTime.datetime
                .add_days(1)!;
        }

        return [dateTime, input.slice(word.length)];
    }

    // ISO-8601
    let iso8601Match = /^(\d{4}(-\d{2}(-\d{2})?)?|(\d{4}\d{2}(\d{2})?))(T\d{2}(:\d{2}(:\d{2})?)?|T\d{2}\d{2}(\d{2})?)?(\.\d+)?(Z|[+-]\d{2}(:\d{2}|\d{2})?)?/.exec(input);
    if (!!iso8601Match) {
        let dateTime: DateTimeToken = {
            token_type: 'DateTime',
            original: iso8601Match[0],
            hint: "datetime",
            datetime: GLib.DateTime.new_from_iso8601(iso8601Match[0], null),
        }

        if (!!dateTime.datetime) {
            return [dateTime, input.slice(iso8601Match[0].length)];
        }
    }

    // Time only
    let timeMatch = /^(?:(0?[1-9]|1[0-2])(?::([0-5]\d)(?::([0-5]\d))?)?\s*([aApP][mM])|([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?)/.exec(input)!;
    if (!!timeMatch) {
        const is12hFormat = timeMatch[4] !== undefined;
        let hour = Number.parseInt(is12hFormat ? timeMatch[1] : timeMatch[5]);
        let minute = Number.parseInt(is12hFormat ? timeMatch[2] : timeMatch[6]);
        let second = Number.parseInt(is12hFormat ? timeMatch[3] : timeMatch[7]);
        let ampm = timeMatch[4];

        if (is12hFormat && ampm.toLowerCase() == "pm") hour += 12;
        if (!minute) minute = 0;
        if (!second) second = 0;

        let dateTime: DateTimeToken = {
            token_type: 'DateTime',
            original: timeMatch[0],
            hint: "timeonly",
            datetime: localNow
                .add_seconds(-localNow.get_second())!.add_seconds(second)!
                .add_minutes(-localNow.get_minute())!.add_minutes(minute)!
                .add_hours(-localNow.get_hour())!.add_hours(hour)!,
        };

        return [dateTime, input.slice(timeMatch[0].length)]
    }

    return null;
}

function tryParseTimeSpanToken(input: string): [TimeSpanToken, string] | null {
    let match = /^(\d+)\s*(seconds?|minutes?|hours?|days?|months?|years?)/i.exec(input);
    if (!!match) {
        let timeSpan: TimeSpanToken = {
            token_type: 'TimeSpan',
            number: Number.parseInt(match[1]),
            type: (() => {
                switch (match[2].toLowerCase().replaceAll(/s$/g, '')) {
                    case "second":
                        return "seconds";
                    case "minute":
                        return "minutes";
                    case "hour":
                        return "hours";
                    case "day":
                        return "days";
                    case "month":
                        return "months";
                    case "year":
                        return "years";
                }
            })()!
        };

        return [timeSpan, input.slice(match[0].length)];
    }

    return null;
}

function tryParseOperatorToken(input: string): [OperatorToken, string] | null {
    let match = /^(plus|\+|minus|-|to)/i.exec(input);
    if (!!match) {
        let keyword = match[0].toLowerCase();
        let token: Operator | null = null;
        if (keyword == "plus" || keyword == "+")
            token = Operator.Add;
        else if (keyword == "minus" || keyword == "-")
            token = Operator.Subtract;
        else if (keyword == "to")
            token = Operator.ConvertTo;

        if (!!token) {
            return [{token_type: 'Operator', operator: token}, input.slice(match[0].length)];
        }
    }
    return null;
}

function tryParseTimeZoneOnlyToken(input: string): [TimeZoneToken, string] | null {
    let match = /^(?<timezone>((?:GMT|UTF)[+-]\d{1,2})|[A-Z]{2,5})/i.exec(input);
    if (!!match) {
        let code = match[0].toUpperCase();
        if (code == "LOCAL") {
            let localNow = GLib.DateTime.new_now_local();
            let timezoneInfo = timezones.find(tz => tz.abbr == localNow.get_timezone_abbreviation());
            if (!!timezoneInfo)
                return [{token_type: 'TimeZone', info: timezoneInfo}, input.slice(match[0].length)];
        }

        let timezoneInfo = timezones.find(tz => tz.abbr == code);
        if (!timezoneInfo)
            return null;

        return [{token_type: 'TimeZone', info: timezoneInfo}, input.slice(match[0].length)];
    }
    return null;
}