# Sanitize schema

This app accepts a knack schema, checks the count of the properties, remove any duplicates, output a json file without duplicates.

#### Hypothesis

1. The `property_count` value is the property count with no duplicates.
2. The `versions` array only has 1 element.

## Installation

1. `git clone https://github.com/kitloong1/KnackApp.git`
2. `npm install`

## Usage

1. Make sure the schema you wanted to sanitize is in the root directory.
2. `npm start`
3. When prompted, enter the file name of the file that need to be sanitize.
4. A sanitized json file will be generated name 'clean_application.json'.
