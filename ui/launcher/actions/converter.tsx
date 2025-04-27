import {ActionCallback, ActionProvider, ActionResult, OptionalWidget} from "../Launcher";

export class ConverterActionProvider extends ActionProvider {
    static readonly REGEX = /^(?<value>[.,]\d+|\d+[.,]?(?:\d+)?)\s*(?<from>[\w"'\/]+)\s+to\s+(?<to>[\w\/]+)$/i;

    queryResults(query: string): ActionResult[] | null {
        let matches = ConverterActionProvider.REGEX.exec(query);
        if (!matches) {
            return null;
        }

        let value = Number.parseFloat(matches[1]);
        let from = matches[2];
        let to = matches[3];

        let result = this.getConversionResult(value, from, to);
        if (!!result) {
            return [new ConverterActionResult(result)];
        }

        return null;
    }

    getConversionResult(value: number, fromUnit: string, toUnit: string): ConversionResult | null {
        const distanceUnits: Record<string, UnitConversion> = {
            meter: {value: 1, aliases: ["m"], caseSensitive: false, name: "Meter"},

            // Metric Units
            nanometer: {value: 0.000000001, aliases: ["nm"], caseSensitive: false, name: "Nanometer"},
            micrometer: {value: 0.000001, aliases: ["um"], caseSensitive: false, name: "Micrometer"},
            millimeter: {value: 0.001, aliases: ["mm"], caseSensitive: false, name: "Millimeter"},
            centimeter: {value: 0.01, aliases: ["cm"], caseSensitive: false, name: "Centimeter"},
            decimeter: {value: 0.1, aliases: ["dm"], caseSensitive: false, name: "Decimeter"},
            dekameter: {value: 10, aliases: ["dam"], caseSensitive: false, name: "Dekameter"},
            hectometer: {value: 100, aliases: ["hm"], caseSensitive: false, name: "Hectometer"},
            kilometer: {value: 1000, aliases: ["km"], caseSensitive: false, name: "Kilometer"},

            // Imperial Units
            twip: {value: 0.000017638, aliases: [], caseSensitive: false, name: "Twip"},
            thou: {value: 0.0000254, aliases: ["th"], caseSensitive: false, name: "Thou"},
            inch: {value: 0.0254, aliases: ["in", "\"", "″"], caseSensitive: false, name: "Inch"},
            hand: {value: 0.1016, aliases: ["h"], caseSensitive: false, name: "Hand"},
            foot: {value: 0.3048, aliases: ["ft", "'", "′"], caseSensitive: false, name: "Foot"},
            yard: {value: 0.9144, aliases: ["yd"], caseSensitive: false, name: "Yard"},
            chain: {value: 20.1168, aliases: ["ch"], caseSensitive: false, name: "Chain"},
            furlong: {value: 201.168, aliases: [], caseSensitive: false, name: "Furlong"},
            mile: {value: 1609.344, aliases: ["mi"], caseSensitive: false, name: "Mile"},
        };

        const areaUnits: Record<string, UnitConversion> = {
            sqMeter: {value: 1, aliases: ["m2", "m^2"], caseSensitive: false, name: "Square Meter"},

            // Metric Units
            sqNanometer: {value: 1e-18, aliases: ["nm2", "nm^2"], caseSensitive: false, name: "Square Nanometer"},
            sqMicrometer: {value: 1e-12, aliases: ["um2", "um^2"], caseSensitive: false, name: "Square Micrometer"},
            sqMillimeter: {value: 1e-6, aliases: ["mm2", "mm^2"], caseSensitive: false, name: "Square Millimeter"},
            sqCentimeter: {value: 0.0001, aliases: ["cm2", "cm^2"], caseSensitive: false, name: "Square Centimeter"},
            sqDecimeter: {value: 0.01, aliases: ["dm2", "dm^2"], caseSensitive: false, name: "Square Decimeter"},
            sqDekameter: {value: 100, aliases: ["dam2", "dam^2"], caseSensitive: false, name: "Square Dekameter"},
            sqHectometer: {value: 10000, aliases: ["hm2", "hm^2"], caseSensitive: false, name: "Square Hectometer"},
            sqKilometer: {value: 1000000, aliases: ["km2", "km^2"], caseSensitive: false, name: "Square Kilometer"},

            // Imperial Units
            acre: {value: 4046.8564224, aliases: [], caseSensitive: false, name: "Acre"},
            sqInch: {
                value: 0.00064516,
                aliases: ["sq in", "sqin", "in2", "in^2"],
                caseSensitive: false,
                name: "Square Inch"
            },
            sqFoot: {
                value: 0.09290304,
                aliases: ["sq ft", "sqft", "ft2", "ft^2"],
                caseSensitive: false,
                name: "Square Foot"
            },
            sqYard: {
                value: 0.83612736,
                aliases: ["sq yd", "sqyd", "yd2", "yd^2"],
                caseSensitive: false,
                name: "Square Yard"
            },
            sqMile: {
                value: 2589988.110336,
                aliases: ["sq mi", "sqmi", "mi2", "mi^2"],
                caseSensitive: false,
                name: "Square Mile"
            },
        };

        const volumeUnits: Record<string, UnitConversion> = {
            cubicMeter: {value: 1, aliases: ["m3", "m^3"], caseSensitive: false, name: "Cubic Meter"},

            // Metric Units
            cubicNanometer: {value: 1e-27, aliases: ["nm3", "nm^3"], caseSensitive: false, name: "Cubic Nanometer"},
            cubicMicrometer: {value: 1e-18, aliases: ["um3", "um^3"], caseSensitive: false, name: "Cubic Micrometer"},
            cubicMillimeter: {value: 1e-9, aliases: ["mm3", "mm^3"], caseSensitive: false, name: "Cubic Millimeter"},
            cubicCentimeter: {
                value: 1e-6,
                aliases: ["cm3", "cm^3", "cc", "ml", "milliliter"],
                caseSensitive: false,
                name: "Cubic Centimeter"
            },
            cubicDecimeter: {
                value: 1e-3,
                aliases: ["dm3", "dm^3", "l", "liter"],
                caseSensitive: false,
                name: "Cubic Decimeter"
            },
            cubicDekameter: {value: 1e3, aliases: ["dam3", "dam^3"], caseSensitive: false, name: "Cubic Dekameter"},
            cubicHectometer: {value: 1e6, aliases: ["hm3", "hm^3"], caseSensitive: false, name: "Cubic Hectometer"},
            cubicKilometer: {value: 1e9, aliases: ["km3", "km^3"], caseSensitive: false, name: "Cubic Kilometer"},

            // Metric Liter Units
            nanoliter: {value: 1e-12, aliases: ["nl"], caseSensitive: false, name: "Nanoliter"},
            microliter: {value: 1e-9, aliases: ["μl", "ul"], caseSensitive: false, name: "Microliter"},
            centiliter: {value: 1e-5, aliases: ["cl"], caseSensitive: false, name: "Centiliter"},
            deciliter: {value: 1e-4, aliases: ["dl"], caseSensitive: false, name: "Deciliter"},
            dekaliter: {value: 1e-2, aliases: ["dal"], caseSensitive: false, name: "Dekaliter"},
            hectoliter: {value: 1e-1, aliases: ["hl"], caseSensitive: false, name: "Hectoliter"},
            kiloliter: {value: 1, aliases: ["kl"], caseSensitive: false, name: "Kiloliter"},

            // Imperial/US Units
            cubicInch: {
                value: 1.6387064e-5,
                aliases: ["in3", "in^3", "cu in"],
                caseSensitive: false,
                name: "Cubic Inch"
            },
            cubicFoot: {
                value: 0.028316846592,
                aliases: ["ft3", "ft^3", "cu ft"],
                caseSensitive: false,
                name: "Cubic Foot"
            },
            cubicYard: {
                value: 0.764554857984,
                aliases: ["yd3", "yd^3", "cu yd"],
                caseSensitive: false,
                name: "Cubic Yard"
            },
            fluidOunceUS: {
                value: 2.95735295625e-5,
                aliases: ["fl oz", "oz fl"],
                caseSensitive: false,
                name: "Fluid Ounce (US)"
            },
            cupUS: {value: 2.365882365e-4, aliases: ["cup"], caseSensitive: false, name: "Cup (US)"},
            pintUS: {value: 4.73176473e-4, aliases: ["pt", "pt us"], caseSensitive: false, name: "Pint (US)"},
            quartUS: {value: 9.46352946e-4, aliases: ["qt", "qt us"], caseSensitive: false, name: "Quart (US)"},
            gallonUS: {value: 0.003785411784, aliases: ["gal", "gal us"], caseSensitive: false, name: "Gallon (US)"},
            fluidOunceUK: {
                value: 2.84130625e-5,
                aliases: ["fl oz", "floz"],
                caseSensitive: false,
                name: "Fluid Ounce (UK)"
            },
            pintUK: {value: 5.6826125e-4, aliases: ["pt uk"], caseSensitive: false, name: "Pint (UK)"},
            quartUK: {value: 0.0011365225, aliases: ["qt uk"], caseSensitive: false, name: "Quart (UK)"},
            gallonUK: {value: 0.00454609, aliases: ["gal uk"], caseSensitive: false, name: "Gallon (UK)"},

            // Common Cooking Measurements
            teaspoonUS: {value: 4.92892159375e-6, aliases: ["tsp"], caseSensitive: false, name: "Teaspoon (US)"},
            tablespoonUS: {value: 1.47867647813e-5, aliases: ["tbsp"], caseSensitive: false, name: "Tablespoon (US)"},
        };

        const massUnits: Record<string, UnitConversion> = {
            gram: {value: 1, aliases: ["g"], caseSensitive: false, name: "Gram"},

            // Metric Units
            nanogram: {value: 0.000000001, aliases: ["ng"], caseSensitive: false, name: "Nanogram"},
            microgram: {value: 0.000001, aliases: ["ug"], caseSensitive: false, name: "Microgram"},
            milligram: {value: 0.001, aliases: ["mg"], caseSensitive: false, name: "Milligram"},
            centigram: {value: 0.01, aliases: ["cg"], caseSensitive: false, name: "Centigram"},
            decigram: {value: 0.1, aliases: ["dg"], caseSensitive: false, name: "Decigram"},
            dekagram: {value: 10, aliases: ["dag"], caseSensitive: false, name: "Dekagram"},
            hectogram: {value: 100, aliases: ["hg"], caseSensitive: false, name: "Hectogram"},
            kilogram: {value: 1000, aliases: ["kg"], caseSensitive: false, name: "Kilogram"},

            // Imperial Units
            ounce: {value: 28.349523125, aliases: ["oz"], caseSensitive: false, name: "Ounce"},
            pound: {value: 453.592, aliases: ["lb"], caseSensitive: false, name: "Pound"},
            stone: {value: 6350.29, aliases: ["st"], caseSensitive: false, name: "Stone"},
        };

        const dataUnits: Record<string, UnitConversion> = {
            byte: {value: 1, aliases: ["B"], caseSensitive: true, name: "Byte"},
            bit: {value: 0.125, aliases: ["b"], caseSensitive: true, name: "Bit"},

            // Binary Prefixes (powers of 2)
            kibibyte: {value: 1024, aliases: ["KiB"], caseSensitive: false, name: "Kibibyte"},
            mebibyte: {value: 1048576, aliases: ["MiB"], caseSensitive: false, name: "Mebibyte"},
            gibibyte: {value: 1073741824, aliases: ["GiB"], caseSensitive: false, name: "Gibibyte"},
            tebibyte: {value: 1099511627776, aliases: ["TiB"], caseSensitive: false, name: "Tebibyte"},
            pebibyte: {value: 1125899906842624, aliases: ["PiB"], caseSensitive: false, name: "Pebibyte"},
            exbibyte: {value: 1152921504606846976, aliases: ["EiB"], caseSensitive: false, name: "Exbibyte"},
            zebibyte: {value: 1.1805916207174113e+21, aliases: ["ZiB"], caseSensitive: false, name: "Zebibyte"},
            yobibyte: {value: 1.2089258196146292e+24, aliases: ["YiB"], caseSensitive: false, name: "Yobibyte"},

            // Binary bit prefixes (powers of 2)
            kibibit: {value: 128, aliases: ["Kibit"], caseSensitive: false, name: "Kibibit"},
            mebibit: {value: 131072, aliases: ["Mibit"], caseSensitive: false, name: "Mebibit"},
            gibibit: {value: 134217728, aliases: ["Gibit"], caseSensitive: false, name: "Gibibit"},
            tebibit: {value: 137438953472, aliases: ["Tibit"], caseSensitive: false, name: "Tebibit"},
            pebibit: {value: 140737488355328, aliases: ["Pibit"], caseSensitive: false, name: "Pebibit"},
            exbibit: {value: 144115188075855872, aliases: ["Eibit"], caseSensitive: false, name: "Exbibit"},
            zebibit: {value: 1.4757395258967641e+20, aliases: ["Zibit"], caseSensitive: false, name: "Zebibit"},
            yobibit: {value: 1.5111572745182864e+23, aliases: ["Yibit"], caseSensitive: false, name: "Yobibit"},

            // Decimal prefixes (powers of 10)
            kilobyte: {value: 1000, aliases: ["KB"], caseSensitive: true, name: "Kilobyte"},
            megabyte: {value: 1000000, aliases: ["MB"], caseSensitive: true, name: "Megabyte"},
            gigabyte: {value: 1000000000, aliases: ["GB"], caseSensitive: true, name: "Gigabyte"},
            terabyte: {value: 1000000000000, aliases: ["TB"], caseSensitive: true, name: "Terabyte"},
            petabyte: {value: 1000000000000000, aliases: ["PB"], caseSensitive: true, name: "Petabyte"},
            exabyte: {value: 1000000000000000000, aliases: ["EB"], caseSensitive: true, name: "Exabyte"},
            zettabyte: {value: 1e+21, aliases: ["ZB"], caseSensitive: true, name: "Zettabyte"},
            yottabyte: {value: 1e+24, aliases: ["YB"], caseSensitive: true, name: "Yottabyte"},

            // Decimal bit prefixes (powers of 10)
            kilobit: {value: 125, aliases: ["Kbit", "Kb"], caseSensitive: true, name: "Kilobit"},
            megabit: {value: 125000, aliases: ["Mbit", "Mb"], caseSensitive: true, name: "Megabit"},
            gigabit: {value: 125000000, aliases: ["Gbit", "Gb"], caseSensitive: true, name: "Gigabit"},
            terabit: {value: 125000000000, aliases: ["Tbit", "Tb"], caseSensitive: true, name: "Terabit"},
            petabit: {value: 125000000000000, aliases: ["Pbit", "Pb"], caseSensitive: true, name: "Petabit"},
            exabit: {value: 125000000000000000, aliases: ["Ebit", "Eb"], caseSensitive: true, name: "Exabit"},
            zettabit: {value: 1.25e+20, aliases: ["Zbit", "Zb"], caseSensitive: true, name: "Zettabit"},
            yottabit: {value: 1.25e+23, aliases: ["Ybit", "Yb"], caseSensitive: true, name: "Yottabit"},
        };

        const dataTransferSpeedUnits: Record<string, UnitConversion> = {
            bytesPerSecond: {value: 1, aliases: ["B/s", "Bps"], caseSensitive: true, name: "Byte per second"},

            // Bit-based transfer rates (base unit conversion)
            bitsPerSecond: {value: 0.125, aliases: ["b/s", "bps"], caseSensitive: true, name: "Bit per second"},

            // Byte-based decimal prefixes (powers of 10)
            kilobytesPerSecond: {
                value: 1000,
                aliases: ["KB/s", "KBps"],
                caseSensitive: true,
                name: "Kilobyte per second"
            },
            megabytesPerSecond: {
                value: 1000000,
                aliases: ["MB/s", "MBps"],
                caseSensitive: true,
                name: "Megabyte per second"
            },
            gigabytesPerSecond: {
                value: 1000000000,
                aliases: ["GB/s", "GBps"],
                caseSensitive: true,
                name: "Gigabyte per second"
            },
            terabytesPerSecond: {
                value: 1000000000000,
                aliases: ["TB/s", "TBps"],
                caseSensitive: true,
                name: "Terabyte per second"
            },
            petabytesPerSecond: {
                value: 1000000000000000,
                aliases: ["PB/s", "PBps"],
                caseSensitive: true,
                name: "Petabyte per second"
            },
            exabytesPerSecond: {
                value: 1000000000000000000,
                aliases: ["EB/s", "EBps"],
                caseSensitive: true,
                name: "Exabyte per second"
            },

            // Bit-based decimal prefixes (powers of 10)
            kilobitsPerSecond: {
                value: 125,
                aliases: ["Kb/s", "Kbps", "Kbit/s"],
                caseSensitive: true,
                name: "Kilobit per second"
            },
            megabitsPerSecond: {
                value: 125000,
                aliases: ["Mb/s", "Mbps", "Mbit/s"],
                caseSensitive: true,
                name: "Megabit per second"
            },
            gigabitsPerSecond: {
                value: 125000000,
                aliases: ["Gb/s", "Gbps", "Gbit/s"],
                caseSensitive: true,
                name: "Gigabit per second"
            },
            terabitsPerSecond: {
                value: 125000000000,
                aliases: ["Tb/s", "Tbps", "Tbit/s"],
                caseSensitive: true,
                name: "Terabit per second"
            },
            petabitsPerSecond: {
                value: 125000000000000,
                aliases: ["Pb/s", "Pbps", "Pbit/s"],
                caseSensitive: true,
                name: "Petabit per second"
            },
            exabitsPerSecond: {
                value: 125000000000000000,
                aliases: ["Eb/s", "Ebps", "Ebit/s"],
                caseSensitive: true,
                name: "Exabit per second"
            },

            // Byte-based binary prefixes (powers of 2)
            kibibytesPerSecond: {
                value: 1024,
                aliases: ["KiB/s", "KiBps"],
                caseSensitive: false,
                name: "Kibibyte per second"
            },
            mebibytesPerSecond: {
                value: 1048576,
                aliases: ["MiB/s", "MiBps"],
                caseSensitive: false,
                name: "Mebibyte per second"
            },
            gibibytesPerSecond: {
                value: 1073741824,
                aliases: ["GiB/s", "GiBps"],
                caseSensitive: false,
                name: "Gibibyte per second"
            },
            tebibytesPerSecond: {
                value: 1099511627776,
                aliases: ["TiB/s", "TiBps"],
                caseSensitive: false,
                name: "Tebibyte per second"
            },
            pebibytesPerSecond: {
                value: 1125899906842624,
                aliases: ["PiB/s", "PiBps"],
                caseSensitive: false,
                name: "Pebibyte per second"
            },
            exbibytesPerSecond: {
                value: 1152921504606846976,
                aliases: ["EiB/s", "EiBps"],
                caseSensitive: false,
                name: "Exbibyte per second"
            },

            // Bit-based binary prefixes (powers of 2)
            kibibitsPerSecond: {
                value: 128,
                aliases: ["Kib/s", "Kibps", "Kibit/s"],
                caseSensitive: false,
                name: "Kibibit per second"
            },
            mebibitsPerSecond: {
                value: 131072,
                aliases: ["Mib/s", "Mibps", "Mibit/s"],
                caseSensitive: false,
                name: "Mebibit per second"
            },
            gibibitsPerSecond: {
                value: 134217728,
                aliases: ["Gib/s", "Gibps", "Gibit/s"],
                caseSensitive: false,
                name: "Gibibit per second"
            },
            tebibitsPerSecond: {
                value: 137438953472,
                aliases: ["Tib/s", "Tibps", "Tibit/s"],
                caseSensitive: false,
                name: "Tebibit per second"
            },
            pebibitsPerSecond: {
                value: 140737488355328,
                aliases: ["Pib/s", "Pibps", "Pibit/s"],
                caseSensitive: false,
                name: "Pebibit per second"
            },
            exbibitsPerSecond: {
                value: 144115188075855872,
                aliases: ["Eib/s", "Eibps", "Eibit/s"],
                caseSensitive: false,
                name: "Exbibit per second"
            },

            // Common industry-specific units
            baudRate: {value: 0.125, aliases: ["bd", "baud"], caseSensitive: false, name: "Baud"},
        };

        const conversionTables = [
            distanceUnits,
            areaUnits,
            volumeUnits,
            massUnits,
            dataUnits,
            dataTransferSpeedUnits
        ];

        function tableEntryMatches(table: Record<string, UnitConversion>, key: string, query: string): boolean {
            let record = table[key];

            if (record.caseSensitive)
                return table[key].aliases.includes(query);

            return table[key].aliases.some(alias => alias.toLowerCase() == query.toLowerCase());
        }

        for (let table of conversionTables) {
            let tableKeys = Object.keys(table);
            let fromUnitKey = tableKeys.find(k => tableEntryMatches(table, k, fromUnit));
            let toUnitKey = tableKeys.find(k => tableEntryMatches(table, k, toUnit));

            if (!fromUnitKey || !toUnitKey) {
                continue;
            }

            let fromRecord = table[fromUnitKey];
            let toRecord = table[toUnitKey];

            const valueInBaseUnit = value * fromRecord.value;
            return {
                sourceValue: value,
                sourceUnit: fromRecord,
                resultValue: valueInBaseUnit / toRecord.value,
                resultUnit: toRecord,
            };
        }

        return null;
    }
}

interface UnitConversion {
    name: string;
    value: number;
    aliases: string[];
    caseSensitive: boolean;
}

type ConversionResult = {
    sourceValue: number,
    sourceUnit: UnitConversion;

    resultValue: number;
    resultUnit: UnitConversion;
};

class ConverterActionResult extends ActionResult {
    private result: ConversionResult;

    constructor(result: ConversionResult) {
        super();
        this.result = result;
    }

    getTitle(): string {
        return "";
    }

    getIconName(): string | null {
        return "rotation-allowed-symbolic";
    }

    getCategoryName(): string {
        return "Unit Conversion";
    }

    getAction(): ActionCallback | null {
        return () => {
            return true;
        };
    }

    getWidgetContents(): OptionalWidget[] {
        return [
            this.getIconName() != null ? <image iconName={this.getIconName()!}/> : null,
            <label cssClasses={["description"]}>
                {`${this.result.sourceValue} ${this.result.sourceUnit.name} = `}
            </label>,
            <label cssClasses={["title"]}>
                {`${this.result.resultValue} ${this.result.resultUnit.name}`}
            </label>
        ];
    }
}