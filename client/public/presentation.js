const presentation = {
  "name": "Unemployment",
  "category": "Test",
  "description": `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
  `,
  "datum" : [
    {
      "iso3": "ABW",
      "2022": 3346
    },
    {
      "iso3": "AIA",
      "2022": 1262
    },
    {
      "iso3": "ATG",
      "2022": 4013
    },
    {
      "iso3": "BES",
      "2022": 1860
    },
    {
      "iso3": "BHS",
      "2022": 4336
    },
    {
      "iso3": "BLZ",
      "2022": 3844
    },
    {
      "iso3": "BMU",
      "2022": 4469
    },
    {
      "iso3": "BRB",
      "2022": 4798
    },
    {
      "iso3": "CRI",
      "2022": 4865
    },
    {
      "iso3": "CUW",
      "2022": 3957
    },
    {
      "iso3": "CYM",
      "2022": 4603
    },
    {
      "iso3": "DMA",
      "2022": 4381
    },
    {
      "iso3": "DOM",
      "2022": 4926
    },
    {
      "iso3": "GLP",
      "2022": 2665
    },
    {
      "iso3": "GRD",
      "2022": 4063
    },
    {
      "iso3": "GUY",
      "2022": 1896
    },
    {
      "iso3": "HND",
      "2022": 2565
    },
    {
      "iso3": "HTI",
      "2022": 2840
    },
    {
      "iso3": "JAM",
      "2022": 4020
    },
    {
      "iso3": "KNA",
      "2022": 4437
    },
    {
      "iso3": "LCA",
      "2022": 4143
    },
    {
      "iso3": "MEX",
      "2022": 3941
    },
    {
      "iso3": "MSR",
      "2022": 3438
    },
    {
      "iso3": "PAN",
      "2022": 4060
    },
    {
      "iso3": "SUR",
      "2022": 3030
    },
    {
      "iso3": "TCA",
      "2022": 3839
    },
    {
      "iso3": "TTO",
      "2022": 2544
    },
    {
      "iso3": "VCT",
      "2022": 1864
    },
    {
      "iso3": "VGB",
      "2022": 1665
    },
    {
      "iso3": "VIR",
      "2022": 1784
    }
  ],
  "layers": [
    {
      "name": "Unemployment layer",
      "type": "countries",
      "dataset": "Unemployment",
      "config": {
        "styles": [
          {
            "id": "unemployment-layer",
            "type": "fill",
            "paint": {
              "fill-color": [
                "interpolate",
                [
                  "linear"
                ],
                [
                  "get",
                  "2022"
                ],
                0,
                "#00F",
                5000,
                "#0FF"
              ],
              "fill-opacity": "@@#params.opacity"
            },
            "layout": {
              "visibility": {
                "v": "@@#params.visibility",
                "@@function": "setVisibility"
              }
            }
          }
        ]
      },
      "params_config": [
        {
          "key": "opacity",
          "default": 1
        },
        {
          "key": "visibility",
          "default": true
        }
      ]
    }
  ]
}