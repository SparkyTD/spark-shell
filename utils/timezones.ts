export type TimeZoneInfo = {
    name: string;
    abbr: string;
    offset: number;
    offset_hhmm: string;
    is_dst: boolean;
    country_code: string;
}

export const timezones: TimeZoneInfo[] = [
    {
        "name": "Greenwich Mean Time",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT"
    },
    {
        "name": "Ghana Summer Time",
        "offset": 1200,
        "offset_hhmm": "+00:20",
        "is_dst": true,
        "country_code": "GH",
        "abbr": "GHST"
    },
    {
        "name": "East Africa Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": false,
        "country_code": "ET",
        "abbr": "EAT"
    },
    {
        "name": "Central European Time/Central European Standard Time",
        "offset": 3600,
        "offset_hhmm": "+01:00",
        "is_dst": false,
        "country_code": "DZ",
        "abbr": "CET"
    },
    {
        "name": "West Africa Time/West Africa Standard Time",
        "offset": 3600,
        "offset_hhmm": "+01:00",
        "is_dst": false,
        "country_code": "CF",
        "abbr": "WAT"
    },
    {
        "name": "Central Africa Time",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": false,
        "country_code": "MW",
        "abbr": "CAT"
    },
    {
        "name": "Eastern European Time/Eastern European Standard Time",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": false,
        "country_code": "EG",
        "abbr": "EET"
    },
    {
        "name": "Eastern European Summer Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": true,
        "country_code": "EG",
        "abbr": "EEST"
    },
    {
        "name": "Western European Time/Western European Standard Time",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": false,
        "country_code": "MA",
        "abbr": "WET"
    },
    {
        "name": "Western European Summer Time",
        "offset": 3600,
        "offset_hhmm": "+01:00",
        "is_dst": true,
        "country_code": "MA",
        "abbr": "WEST"
    },
    {
        "name": "Central European Summer Time",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": true,
        "country_code": "ES",
        "abbr": "CEST"
    },
    {
        "name": "South Africa Standard Time",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": false,
        "country_code": "ZA",
        "abbr": "SAST"
    },
    {
        "name": "Central Africa Summer Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": true,
        "country_code": "SD",
        "abbr": "CAST"
    },
    {
        "name": "Hawaii-Aleutian Time",
        "offset": -36000,
        "offset_hhmm": "-10:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "HAT"
    },
    {
        "name": "Hawaii-Aleutian Standard Time",
        "offset": -36000,
        "offset_hhmm": "-10:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "HAST"
    },
    {
        "name": "Hawaii-Aleutian Daylight Time",
        "offset": -32400,
        "offset_hhmm": "-09:00",
        "is_dst": true,
        "country_code": "US",
        "abbr": "HADT"
    },
    {
        "name": "Alaska Time",
        "offset": -32400,
        "offset_hhmm": "-09:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "AKT"
    },
    {
        "name": "Alaska Standard Time",
        "offset": -32400,
        "offset_hhmm": "-09:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "AKST"
    },
    {
        "name": "Alaska Daylight Time",
        "offset": -28800,
        "offset_hhmm": "-08:00",
        "is_dst": true,
        "country_code": "US",
        "abbr": "AKDT"
    },
    {
        "name": "Atlantic Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "AI",
        "abbr": "AT"
    },
    {
        "name": "Atlantic Standard Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "AI",
        "abbr": "AST"
    },
    {
        "name": "Brasilia Time/Brasilia Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "BR",
        "abbr": "BRT"
    },
    {
        "name": "Brasilia Summer Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": true,
        "country_code": "BR",
        "abbr": "BRST"
    },
    {
        "name": "Argentina Time/Argentina Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "AR",
        "abbr": "ART"
    },
    {
        "name": "Argentina Summer Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": true,
        "country_code": "AR",
        "abbr": "ARST"
    },
    {
        "name": "Paraguay Time/Paraguay Standard Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "PY",
        "abbr": "PYT"
    },
    {
        "name": "Paraguay Summer Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": true,
        "country_code": "PY",
        "abbr": "PYST"
    },
    {
        "name": "Eastern Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "ET"
    },
    {
        "name": "Eastern Standard Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "EST"
    },
    {
        "name": "Central Time",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": false,
        "country_code": "MX",
        "abbr": "CT"
    },
    {
        "name": "Central Standard Time",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": false,
        "country_code": "MX",
        "abbr": "CST"
    },
    {
        "name": "Central Daylight Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": true,
        "country_code": "MX",
        "abbr": "CDT"
    },
    {
        "name": "Atlantic Daylight Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": true,
        "country_code": "BB",
        "abbr": "ADT"
    },
    {
        "name": "Amazon Time/Amazon Standard Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "BR",
        "abbr": "AMT"
    },
    {
        "name": "Amazon Summer Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": true,
        "country_code": "BR",
        "abbr": "AMST"
    },
    {
        "name": "Colombia Time/Colombia Standard Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "CO",
        "abbr": "COT"
    },
    {
        "name": "Colombia Summer Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": true,
        "country_code": "CO",
        "abbr": "COST"
    },
    {
        "name": "Mountain Time",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "MT"
    },
    {
        "name": "Mountain Standard Time",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": false,
        "country_code": "US",
        "abbr": "MST"
    },
    {
        "name": "Mountain Daylight Time",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": true,
        "country_code": "US",
        "abbr": "MDT"
    },
    {
        "name": "Venezuela Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "VE",
        "abbr": "VET"
    },
    {
        "name": "French Guiana Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "GF",
        "abbr": "GFT"
    },
    {
        "name": "Pacific Time",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "PT"
    },
    {
        "name": "Pacific Standard Time",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "PST"
    },
    {
        "name": "Eastern Daylight Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": true,
        "country_code": "US",
        "abbr": "EDT"
    },
    {
        "name": "Acre Time/Acre Standard Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "BR",
        "abbr": "ACT"
    },
    {
        "name": "Acre Summer Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": true,
        "country_code": "BR",
        "abbr": "ACST"
    },
    {
        "name": "Pacific Daylight Time",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": true,
        "country_code": "MX",
        "abbr": "PDT"
    },
    {
        "name": "West Greenland Time/West Greenland Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "GL",
        "abbr": "WGT"
    },
    {
        "name": "West Greenland Summer Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": true,
        "country_code": "GL",
        "abbr": "WGST"
    },
    {
        "name": "Ecuador Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "EC",
        "abbr": "ECT"
    },
    {
        "name": "Guyana Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "GY",
        "abbr": "GYT"
    },
    {
        "name": "Bolivia Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "BO",
        "abbr": "BOT"
    },
    {
        "name": "Bolivia Summer Time",
        "offset": -12756,
        "offset_hhmm": "-03:27",
        "is_dst": true,
        "country_code": "BO",
        "abbr": "BST"
    },
    {
        "name": "Peru Time/Peru Standard Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "PE",
        "abbr": "PET"
    },
    {
        "name": "Peru Summer Time",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": true,
        "country_code": "PE",
        "abbr": "PEST"
    },
    {
        "name": "St. Pierre & Miquelon Time/St. Pierre & Miquelon Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "PM",
        "abbr": "PMST"
    },
    {
        "name": "St. Pierre & Miquelon Daylight Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": true,
        "country_code": "PM",
        "abbr": "PMDT"
    },
    {
        "name": "Uruguay Time/Uruguay Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "UY",
        "abbr": "UYT"
    },
    {
        "name": "Uruguay Summer Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": true,
        "country_code": "UY",
        "abbr": "UYST"
    },
    {
        "name": "Fernando de Noronha Time/Fernando de Noronha Standard Time",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": false,
        "country_code": "BR",
        "abbr": "FNT"
    },
    {
        "name": "Fernando de Noronha Summer Time",
        "offset": -3600,
        "offset_hhmm": "-01:00",
        "is_dst": true,
        "country_code": "BR",
        "abbr": "FNST"
    },
    {
        "name": "Suriname Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "SR",
        "abbr": "SRT"
    },
    {
        "name": "Chile Time/Chile Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "CL",
        "abbr": "CLT"
    },
    {
        "name": "Chile Summer Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": true,
        "country_code": "CL",
        "abbr": "CLST"
    },
    {
        "name": "Eastern Half Daylight Time",
        "offset": -16200,
        "offset_hhmm": "-04:30",
        "is_dst": true,
        "country_code": "DO",
        "abbr": "EHDT"
    },
    {
        "name": "East Greenland Time/East Greenland Standard Time",
        "offset": -3600,
        "offset_hhmm": "-01:00",
        "is_dst": false,
        "country_code": "GL",
        "abbr": "EGT"
    },
    {
        "name": "East Greenland Summer Time",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": true,
        "country_code": "GL",
        "abbr": "EGST"
    },
    {
        "name": "Newfoundland Time",
        "offset": -12600,
        "offset_hhmm": "-03:30",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "NT"
    },
    {
        "name": "Newfoundland Standard Time",
        "offset": -12600,
        "offset_hhmm": "-03:30",
        "is_dst": false,
        "country_code": "CA",
        "abbr": "NST"
    },
    {
        "name": "Newfoundland Daylight Time",
        "offset": -9000,
        "offset_hhmm": "-02:30",
        "is_dst": true,
        "country_code": "CA",
        "abbr": "NDT"
    },
    {
        "name": "Australian Western Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "AWT"
    },
    {
        "name": "Australian Western Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "AWST"
    },
    {
        "name": "Davis Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "DAVT"
    },
    {
        "name": "Dumont-d’Urville Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "DDUT"
    },
    {
        "name": "Macquarie Island Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "MIST"
    },
    {
        "name": "Mawson Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "MAWT"
    },
    {
        "name": "New Zealand Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "NZT"
    },
    {
        "name": "New Zealand Standard Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "NZST"
    },
    {
        "name": "New Zealand Daylight Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": true,
        "country_code": "AQ",
        "abbr": "NZDT"
    },
    {
        "name": "Rothera Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "ROTT"
    },
    {
        "name": "Syowa Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "SYOT"
    },
    {
        "name": "Vostok Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "AQ",
        "abbr": "VOST"
    },
    {
        "name": "Almaty Time/Almaty Standard Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "KZ",
        "abbr": "ALMT"
    },
    {
        "name": "Almaty Summer Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": true,
        "country_code": "KZ",
        "abbr": "ALMST"
    },
    {
        "name": "Anadyr Time/Anadyr Standard Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "ANAT"
    },
    {
        "name": "Aqtau Time/Aqtau Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "KZ",
        "abbr": "AQTT"
    },
    {
        "name": "Aqtobe Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "KZ",
        "abbr": "AQTST"
    },
    {
        "name": "Turkmenistan Time/Turkmenistan Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "TM",
        "abbr": "TMT"
    },
    {
        "name": "Azerbaijan Time/Azerbaijan Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "AZ",
        "abbr": "AZT"
    },
    {
        "name": "Azerbaijan Summer Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": true,
        "country_code": "AZ",
        "abbr": "AZST"
    },
    {
        "name": "Indochina Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "TH",
        "abbr": "ICT"
    },
    {
        "name": "Krasnoyarsk Time/Krasnoyarsk Standard Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "KRAT"
    },
    {
        "name": "Kyrgyzstan Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "KG",
        "abbr": "KGT"
    },
    {
        "name": "Brunei Darussalam Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "BN",
        "abbr": "BNT"
    },
    {
        "name": "India Standard Time",
        "offset": 19800,
        "offset_hhmm": "+05:30",
        "is_dst": false,
        "country_code": "IN",
        "abbr": "IST"
    },
    {
        "name": "Yakutsk Time/Yakutsk Standard Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "YAKT"
    },
    {
        "name": "Yakutsk Summer Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "YAKST"
    },
    {
        "name": "Choibalsan Time/Choibalsan Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "MN",
        "abbr": "CHOT"
    },
    {
        "name": "Choibalsan Summer Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "MN",
        "abbr": "CHOST"
    },
    {
        "name": "Bangladesh Time/Bangladesh Standard Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "BD",
        "abbr": "BDT"
    },
    {
        "name": "Bangladesh Summer Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": true,
        "country_code": "BD",
        "abbr": "BDST"
    },
    {
        "name": "East Timor Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "TL",
        "abbr": "TLT"
    },
    {
        "name": "Gulf Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "AE",
        "abbr": "GST"
    },
    {
        "name": "Tajikistan Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "TJ",
        "abbr": "TJT"
    },
    {
        "name": "Tashkent Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "TJ",
        "abbr": "TSD"
    },
    {
        "name": "Hong Kong Time/Hong Kong Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "HK",
        "abbr": "HKT"
    },
    {
        "name": "Hong Kong Summer Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "HK",
        "abbr": "HKST"
    },
    {
        "name": "Hovd Time/Hovd Standard Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "MN",
        "abbr": "HOVT"
    },
    {
        "name": "Hovd Summer Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": true,
        "country_code": "MN",
        "abbr": "HOVST"
    },
    {
        "name": "Irkutsk Time/Irkutsk Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "IRKT"
    },
    {
        "name": "Irkutsk Summer Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "IRKST"
    },
    {
        "name": "Turkey Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": false,
        "country_code": "TR",
        "abbr": "TRT"
    },
    {
        "name": "Western Indonesia Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "ID",
        "abbr": "WIB"
    },
    {
        "name": "Eastern Indonesia Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "ID",
        "abbr": "WIT"
    },
    {
        "name": "Israel Daylight Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": true,
        "country_code": "IL",
        "abbr": "IDT"
    },
    {
        "name": "Afghanistan Time",
        "offset": 16200,
        "offset_hhmm": "+04:30",
        "is_dst": false,
        "country_code": "AF",
        "abbr": "AFT"
    },
    {
        "name": "Petropavlovsk-Kamchatski Time/Petropavlovsk-Kamchatski Standard Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "PETT"
    },
    {
        "name": "Pakistan Time/Pakistan Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "PK",
        "abbr": "PKT"
    },
    {
        "name": "Pakistan Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "PK",
        "abbr": "PKST"
    },
    {
        "name": "Nepal Time",
        "offset": 20700,
        "offset_hhmm": "+05:45",
        "is_dst": false,
        "country_code": "NP",
        "abbr": "NPT"
    },
    {
        "name": "Krasnoyarsk Summer Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "KRAST"
    },
    {
        "name": "Malaysia Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "MY",
        "abbr": "MYT"
    },
    {
        "name": "Malaya Summer Time",
        "offset": 26400,
        "offset_hhmm": "+07:20",
        "is_dst": true,
        "country_code": "MY",
        "abbr": "MLAST"
    },
    {
        "name": "Borneo Summer Time",
        "offset": 30000,
        "offset_hhmm": "+08:20",
        "is_dst": true,
        "country_code": "MY",
        "abbr": "BORTST"
    },
    {
        "name": "Magadan Time/Magadan Standard Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "MAGT"
    },
    {
        "name": "Magadan Summer Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "MAGST"
    },
    {
        "name": "Central Indonesia Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "ID",
        "abbr": "WITA"
    },
    {
        "name": "Philippine Time/Philippine Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "PH",
        "abbr": "PHT"
    },
    {
        "name": "Philippine Summer Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "PH",
        "abbr": "PHST"
    },
    {
        "name": "Novosibirsk Time/Novosibirsk Standard Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "NOVT"
    },
    {
        "name": "Omsk Time/Omsk Standard Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "OMST"
    },
    {
        "name": "Omsk Summer Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "OMSST"
    },
    {
        "name": "Oral Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "KZ",
        "abbr": "ORAT"
    },
    {
        "name": "Korean Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "KP",
        "abbr": "KT"
    },
    {
        "name": "Korean Standard Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "KP",
        "abbr": "KST"
    },
    {
        "name": "Qyzylorda Time/Qyzylorda Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "KZ",
        "abbr": "QYZT"
    },
    {
        "name": "Qyzylorda Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "KZ",
        "abbr": "QYZST"
    },
    {
        "name": "Myanmar Time",
        "offset": 23400,
        "offset_hhmm": "+06:30",
        "is_dst": false,
        "country_code": "MM",
        "abbr": "MMT"
    },
    {
        "name": "Sakhalin Time/Sakhalin Standard Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "SAKT"
    },
    {
        "name": "Uzbekistan Time/Uzbekistan Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "UZ",
        "abbr": "UZT"
    },
    {
        "name": "Uzbekistan Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "UZ",
        "abbr": "UZST"
    },
    {
        "name": "Korean Daylight Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": true,
        "country_code": "KR",
        "abbr": "KDT"
    },
    {
        "name": "Singapore Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "SG",
        "abbr": "SGT"
    },
    {
        "name": "Malaya Summer Time",
        "offset": 26400,
        "offset_hhmm": "+07:20",
        "is_dst": true,
        "country_code": "SG",
        "abbr": "MALST"
    },
    {
        "name": "Srednekolymsk Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "SRET"
    },
    {
        "name": "Georgia Time/Georgia Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "GE",
        "abbr": "GET"
    },
    {
        "name": "Iran Time/Iran Standard Time",
        "offset": 12600,
        "offset_hhmm": "+03:30",
        "is_dst": false,
        "country_code": "IR",
        "abbr": "IRST"
    },
    {
        "name": "Iran Daylight Time",
        "offset": 16200,
        "offset_hhmm": "+04:30",
        "is_dst": true,
        "country_code": "IR",
        "abbr": "IRDT"
    },
    {
        "name": "Bhutan Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "BT",
        "abbr": "BTT"
    },
    {
        "name": "Japan Time/Japan Standard Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "JP",
        "abbr": "JST"
    },
    {
        "name": "Japan Daylight Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": true,
        "country_code": "JP",
        "abbr": "JDT"
    },
    {
        "name": "Ulaanbaatar Time/Ulaanbaatar Standard Time",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "MN",
        "abbr": "ULAT"
    },
    {
        "name": "Ulaanbaatar Summer Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "MN",
        "abbr": "ULAST"
    },
    {
        "name": "Vladivostok Time/Vladivostok Standard Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "VLAT"
    },
    {
        "name": "Vladivostok Summer Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "VLAST"
    },
    {
        "name": "Yekaterinburg Time/Yekaterinburg Standard Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "YEKT"
    },
    {
        "name": "Yekaterinburg Summer Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "YEKST"
    },
    {
        "name": "Azores Time/Azores Standard Time",
        "offset": -3600,
        "offset_hhmm": "-01:00",
        "is_dst": false,
        "country_code": "PT",
        "abbr": "AZOT"
    },
    {
        "name": "Azores Summer Time",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": true,
        "country_code": "PT",
        "abbr": "AZOST"
    },
    {
        "name": "Cape Verde Time/Cape Verde Standard Time",
        "offset": -3600,
        "offset_hhmm": "-01:00",
        "is_dst": false,
        "country_code": "CV",
        "abbr": "CVT"
    },
    {
        "name": "Falkland Islands Time/Falkland Islands Standard Time",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "FK",
        "abbr": "FKT"
    },
    {
        "name": "Eastern Australia Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "AET"
    },
    {
        "name": "Australian Eastern Standard Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "AEST"
    },
    {
        "name": "Australian Eastern Daylight Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": true,
        "country_code": "AU",
        "abbr": "AEDT"
    },
    {
        "name": "Australian Central Daylight Time",
        "offset": 37800,
        "offset_hhmm": "+10:30",
        "is_dst": true,
        "country_code": "AU",
        "abbr": "ACDT"
    },
    {
        "name": "Australian Central Western Time",
        "offset": 31500,
        "offset_hhmm": "+08:45",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "ACWT"
    },
    {
        "name": "Australian Central Western Standard Time",
        "offset": 31500,
        "offset_hhmm": "+08:45",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "ACWST"
    },
    {
        "name": "Australian Central Western Daylight Time",
        "offset": 35100,
        "offset_hhmm": "+09:45",
        "is_dst": true,
        "country_code": "AU",
        "abbr": "ACWDT"
    },
    {
        "name": "Lord Howe Time",
        "offset": 37800,
        "offset_hhmm": "+10:30",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "LHT"
    },
    {
        "name": "Lord Howe Standard Time",
        "offset": 37800,
        "offset_hhmm": "+10:30",
        "is_dst": false,
        "country_code": "AU",
        "abbr": "LHST"
    },
    {
        "name": "Lord Howe Daylight Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": true,
        "country_code": "AU",
        "abbr": "LHDT"
    },
    {
        "name": "Australian Western Daylight Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": true,
        "country_code": "AU",
        "abbr": "AWDT"
    },
    {
        "name": "Easter Island Time/Easter Island Standard Time",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": false,
        "country_code": "CL",
        "abbr": "EAST"
    },
    {
        "name": "Easter Island Summer Time",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": true,
        "country_code": "CL",
        "abbr": "EASST"
    },
    {
        "name": "Greenwich Mean Time -1",
        "offset": -3600,
        "offset_hhmm": "-01:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-1"
    },
    {
        "name": "Greenwich Mean Time -10",
        "offset": -36000,
        "offset_hhmm": "-10:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-10"
    },
    {
        "name": "Greenwich Mean Time -11",
        "offset": -39600,
        "offset_hhmm": "-11:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-11"
    },
    {
        "name": "Greenwich Mean Time -12",
        "offset": -43200,
        "offset_hhmm": "-12:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-12"
    },
    {
        "name": "Greenwich Mean Time -2",
        "offset": -7200,
        "offset_hhmm": "-02:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-2"
    },
    {
        "name": "Greenwich Mean Time -3",
        "offset": -10800,
        "offset_hhmm": "-03:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-3"
    },
    {
        "name": "Greenwich Mean Time -4",
        "offset": -14400,
        "offset_hhmm": "-04:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-4"
    },
    {
        "name": "Greenwich Mean Time -5",
        "offset": -18000,
        "offset_hhmm": "-05:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-5"
    },
    {
        "name": "Greenwich Mean Time -6",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-6"
    },
    {
        "name": "Greenwich Mean Time -7",
        "offset": -25200,
        "offset_hhmm": "-07:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-7"
    },
    {
        "name": "Greenwich Mean Time -8",
        "offset": -28800,
        "offset_hhmm": "-08:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-8"
    },
    {
        "name": "Greenwich Mean Time -9",
        "offset": -32400,
        "offset_hhmm": "-09:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-9"
    },
    {
        "name": "Greenwich Mean Time +1",
        "offset": 3600,
        "offset_hhmm": "+01:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+1"
    },
    {
        "name": "Greenwich Mean Time +10",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+10"
    },
    {
        "name": "Greenwich Mean Time +11",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+11"
    },
    {
        "name": "Greenwich Mean Time +12",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+12"
    },
    {
        "name": "Greenwich Mean Time +13",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+13"
    },
    {
        "name": "Greenwich Mean Time +14",
        "offset": 50400,
        "offset_hhmm": "+14:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+14"
    },
    {
        "name": "Greenwich Mean Time +2",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+2"
    },
    {
        "name": "Greenwich Mean Time +3",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+3"
    },
    {
        "name": "Greenwich Mean Time +4",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+4"
    },
    {
        "name": "Greenwich Mean Time +5",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+5"
    },
    {
        "name": "Greenwich Mean Time +6",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+6"
    },
    {
        "name": "Greenwich Mean Time +7",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+7"
    },
    {
        "name": "Greenwich Mean Time +8",
        "offset": 28800,
        "offset_hhmm": "+08:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+8"
    },
    {
        "name": "Greenwich Mean Time +9",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+9"
    },
    {
        "name": "Coordinated Universal Time",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "UTC"
    },
    {
        "name": "Samara Time/Samara Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "SAMT"
    },
    {
        "name": "Moscow Time/Moscow Standard Time",
        "offset": 10800,
        "offset_hhmm": "+03:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "MSK"
    },
    {
        "name": "Moscow Summer Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": true,
        "country_code": "RU",
        "abbr": "MSD"
    },
    {
        "name": "Saratov Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "GMT+04:00"
    },
    {
        "name": "Volgograd Time/Volgograd Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "RU",
        "abbr": "VOLT"
    },
    {
        "name": "Undefined",
        "offset": 0,
        "offset_hhmm": "+00:00",
        "is_dst": false,
        "country_code": "GB",
        "abbr": "-00"
    },
    {
        "name": "Indian Ocean Time",
        "offset": 21600,
        "offset_hhmm": "+06:00",
        "is_dst": false,
        "country_code": "IO",
        "abbr": "IOT"
    },
    {
        "name": "Christmas Island Time",
        "offset": 25200,
        "offset_hhmm": "+07:00",
        "is_dst": false,
        "country_code": "CX",
        "abbr": "CXT"
    },
    {
        "name": "Cocos Islands Time",
        "offset": 23400,
        "offset_hhmm": "+06:30",
        "is_dst": false,
        "country_code": "CC",
        "abbr": "CCT"
    },
    {
        "name": "French Southern & Antarctic Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "TF",
        "abbr": "TFT"
    },
    {
        "name": "Seychelles Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "SC",
        "abbr": "SCT"
    },
    {
        "name": "Maldives Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": false,
        "country_code": "MV",
        "abbr": "MVT"
    },
    {
        "name": "Mauritius Time/Mauritius Standard Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "MU",
        "abbr": "MUT"
    },
    {
        "name": "Mauritius Summer Time",
        "offset": 18000,
        "offset_hhmm": "+05:00",
        "is_dst": true,
        "country_code": "MU",
        "abbr": "MUST"
    },
    {
        "name": "Réunion Time",
        "offset": 14400,
        "offset_hhmm": "+04:00",
        "is_dst": false,
        "country_code": "RE",
        "abbr": "RET"
    },
    {
        "name": "Iran Time",
        "offset": 12600,
        "offset_hhmm": "+03:30",
        "is_dst": false,
        "country_code": "IR",
        "abbr": "IRT"
    },
    {
        "name": "Marshall Islands Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "MH",
        "abbr": "MHT"
    },
    {
        "name": "Middle European Time",
        "offset": 3600,
        "offset_hhmm": "+01:00",
        "is_dst": false,
        "country_code": "",
        "abbr": "MET"
    },
    {
        "name": "Middle European Summer Time",
        "offset": 7200,
        "offset_hhmm": "+02:00",
        "is_dst": true,
        "country_code": "",
        "abbr": "MEST"
    },
    {
        "name": "Chatham Time",
        "offset": 45900,
        "offset_hhmm": "+12:45",
        "is_dst": false,
        "country_code": "NZ",
        "abbr": "CHAT"
    },
    {
        "name": "Chatham Standard Time",
        "offset": 45900,
        "offset_hhmm": "+12:45",
        "is_dst": false,
        "country_code": "NZ",
        "abbr": "CHAST"
    },
    {
        "name": "Chatham Daylight Time",
        "offset": 49500,
        "offset_hhmm": "+13:45",
        "is_dst": true,
        "country_code": "NZ",
        "abbr": "CHADT"
    },
    {
        "name": "Apia Time/Apia Standard Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": false,
        "country_code": "WS",
        "abbr": "WST"
    },
    {
        "name": "Apia Daylight Time",
        "offset": 50400,
        "offset_hhmm": "+14:00",
        "is_dst": true,
        "country_code": "WS",
        "abbr": "WSDT"
    },
    {
        "name": "Chuuk Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "FM",
        "abbr": "CHUT"
    },
    {
        "name": "Vanuatu Time/Vanuatu Standard Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "VU",
        "abbr": "VUT"
    },
    {
        "name": "Vanuatu Summer Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": true,
        "country_code": "VU",
        "abbr": "VUST"
    },
    {
        "name": "Phoenix Islands Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": false,
        "country_code": "KI",
        "abbr": "PHOT"
    },
    {
        "name": "Tokelau Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": false,
        "country_code": "TK",
        "abbr": "TKT"
    },
    {
        "name": "Fiji Time/Fiji Standard Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "FJ",
        "abbr": "FJT"
    },
    {
        "name": "Fiji Summer Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": true,
        "country_code": "FJ",
        "abbr": "FJST"
    },
    {
        "name": "Tuvalu Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "TV",
        "abbr": "TVT"
    },
    {
        "name": "Galapagos Time",
        "offset": -21600,
        "offset_hhmm": "-06:00",
        "is_dst": false,
        "country_code": "EC",
        "abbr": "GALT"
    },
    {
        "name": "Gambier Time",
        "offset": -32400,
        "offset_hhmm": "-09:00",
        "is_dst": false,
        "country_code": "PF",
        "abbr": "GAMT"
    },
    {
        "name": "Solomon Islands Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "SB",
        "abbr": "SBT"
    },
    {
        "name": "Chamorro Standard Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "GU",
        "abbr": "ChST"
    },
    {
        "name": "Guam Daylight Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": true,
        "country_code": "GU",
        "abbr": "GDT"
    },
    {
        "name": "Line Islands Time",
        "offset": 50400,
        "offset_hhmm": "+14:00",
        "is_dst": false,
        "country_code": "KI",
        "abbr": "LINT"
    },
    {
        "name": "Kosrae Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "FM",
        "abbr": "KOST"
    },
    {
        "name": "Marquesas Time",
        "offset": -34200,
        "offset_hhmm": "-09:30",
        "is_dst": false,
        "country_code": "PF",
        "abbr": "MART"
    },
    {
        "name": "Samoa Time/Samoa Standard Time",
        "offset": -39600,
        "offset_hhmm": "-11:00",
        "is_dst": false,
        "country_code": "UM",
        "abbr": "SST"
    },
    {
        "name": "Nauru Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "NR",
        "abbr": "NRT"
    },
    {
        "name": "Niue Time",
        "offset": -39600,
        "offset_hhmm": "-11:00",
        "is_dst": false,
        "country_code": "NU",
        "abbr": "NUT"
    },
    {
        "name": "Norfolk Island Time/Norfolk Island Standard Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "NF",
        "abbr": "NFT"
    },
    {
        "name": "Norfolk Island Daylight Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": true,
        "country_code": "NF",
        "abbr": "NFDT"
    },
    {
        "name": "New Caledonia Time/New Caledonia Standard Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "NC",
        "abbr": "NCT"
    },
    {
        "name": "New Caledonia Summer Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": true,
        "country_code": "NC",
        "abbr": "NCST"
    },
    {
        "name": "Palau Time",
        "offset": 32400,
        "offset_hhmm": "+09:00",
        "is_dst": false,
        "country_code": "PW",
        "abbr": "PWT"
    },
    {
        "name": "Ponape Time",
        "offset": 39600,
        "offset_hhmm": "+11:00",
        "is_dst": false,
        "country_code": "FM",
        "abbr": "PONT"
    },
    {
        "name": "Papua New Guinea Time",
        "offset": 36000,
        "offset_hhmm": "+10:00",
        "is_dst": false,
        "country_code": "PG",
        "abbr": "PGT"
    },
    {
        "name": "Cook Islands Time/Cook Islands Standard Time",
        "offset": -36000,
        "offset_hhmm": "-10:00",
        "is_dst": false,
        "country_code": "CK",
        "abbr": "CKT"
    },
    {
        "name": "Cook Islands Half Summer Time",
        "offset": -34200,
        "offset_hhmm": "-09:30",
        "is_dst": true,
        "country_code": "CK",
        "abbr": "CKHST"
    },
    {
        "name": "Tahiti Time",
        "offset": -36000,
        "offset_hhmm": "-10:00",
        "is_dst": false,
        "country_code": "PF",
        "abbr": "TAHT"
    },
    {
        "name": "Gilbert Islands Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "KI",
        "abbr": "GILT"
    },
    {
        "name": "Tonga Time/Tonga Standard Time",
        "offset": 46800,
        "offset_hhmm": "+13:00",
        "is_dst": false,
        "country_code": "TO",
        "abbr": "TOT"
    },
    {
        "name": "Tonga Summer Time",
        "offset": 50400,
        "offset_hhmm": "+14:00",
        "is_dst": true,
        "country_code": "TO",
        "abbr": "TOST"
    },
    {
        "name": "Wake Island Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "UM",
        "abbr": "WAKT"
    },
    {
        "name": "Wallis & Futuna Time",
        "offset": 43200,
        "offset_hhmm": "+12:00",
        "is_dst": false,
        "country_code": "WF",
        "abbr": "WFT"
    },
    {
        "name": "Greenwich Mean Time +3:30",
        "offset": 12600,
        "offset_hhmm": "+03:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+3:30"
    },
    {
        "name": "Greenwich Mean Time +4:30",
        "offset": 16200,
        "offset_hhmm": "+04:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+4:30"
    },
    {
        "name": "Greenwich Mean Time +5:45",
        "offset": 20700,
        "offset_hhmm": "+05:45",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+5:45"
    },
    {
        "name": "Greenwich Mean Time +6:30",
        "offset": 23400,
        "offset_hhmm": "+06:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+6:30"
    },
    {
        "name": "Greenwich Mean Time +8:45",
        "offset": 31500,
        "offset_hhmm": "+08:45",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+8:45"
    },
    {
        "name": "Greenwich Mean Time +9:30",
        "offset": 34200,
        "offset_hhmm": "+09:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+9:30"
    },
    {
        "name": "Greenwich Mean Time +10:30",
        "offset": 37800,
        "offset_hhmm": "+10:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+10:30"
    },
    {
        "name": "Greenwich Mean Time +13:45",
        "offset": 49500,
        "offset_hhmm": "+13:45",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT+13:45"
    },
    {
        "name": "Greenwich Mean Time -9:30",
        "offset": -34200,
        "offset_hhmm": "-09:30",
        "is_dst": false,
        "country_code": "",
        "abbr": "GMT-9:30"
    }
]
