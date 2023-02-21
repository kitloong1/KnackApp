const { readFile, writeFile } = require("fs/promises")
const _ = require("lodash")

async function sanitize(inputFile) {
  try {
    const schema = JSON.parse(await readFile(inputFile, { encoding: "utf-8" }))

    //Assuming there is only one version in versions array
    let version = schema.versions[0]

    console.log("Before sanitize: ")
    console.log("Object count: ", getCount(version, "objects"))
    console.log("Field count: ", getCount(version, "objects", "fields"))
    console.log("Scene count: ", getCount(version, "scenes"))
    console.log("View count: ", getCount(version, "scenes", "views"))

    if (!verifyCount(schema, "objects")) {
      removeDuplicates(version, "objects")
    }

    if (!verifyCount(schema, "objects", "fields")) {
      removeDuplicates(version, "objects", "fields")
    }

    if (!verifyCount(schema, "scenes")) {
      removeDuplicates(version, "scenes")
    }

    if (!verifyCount(schema, "scenes", "views")) {
      removeDuplicates(version, "scenes", "views")
    }

    console.log("After sanitize: ")
    console.log("Object count: ", getCount(version, "objects"))
    console.log("Field count: ", getCount(version, "objects", "fields"))
    console.log("Scene count: ", getCount(version, "scenes"))
    console.log("View count: ", getCount(version, "scenes", "views"))

    schema.versions[0] = version

    await writeFile("clean_application.json", JSON.stringify(schema), {
      encoding: "utf-8",
    })
  } catch (err) {
    console.log(err)
  }

  /**
   * Search the property in the object and get the array length
   * @param {object} version - schema.version
   * @param {string} property - property name
   * @param {string} nestedProperty - nested property name
   * @return {number} - Count of property or nested property
   */
}
function getCount(version, property, nestedProperty) {
  if (nestedProperty) {
    let counter = 0

    version[property].forEach((element) => {
      if (Array.isArray(element[nestedProperty])) {
        counter += element[nestedProperty].length
      }
    })

    return counter
  } else {
    if (Array.isArray(version[property])) {
      return version[property].length
    }
  }
}

/**
 * Verify array length against property_count on schema
 * @param {object} schema - schema
 * @param {string} property - property name
 * @param {string} nestedProperty - nested property name
 * @return {boolean} true, if array length === property_count
 */
function verifyCount(schema, property, nestedProperty) {
  if (nestedProperty) {
    const propertyCountKey = nestedProperty.slice(0, -1) + "_count"
    return (
      getCount(schema.versions[0], property, nestedProperty) ===
      schema[propertyCountKey]
    )
  } else {
    const propertyCountKey = property.slice(0, -1) + "_count"
    return getCount(schema.versions[0], property) === schema[propertyCountKey]
  }
}

/**
 * Remove duplicates of an object by comparing the property 'key'
 * @param {object} version - schema.version
 * @param {string} property - property name
 * @param {string} nestedProperty - nested property name
 * @void replace object with no duplicates
 */
function removeDuplicates(version, property, nestedProperty) {
  if (nestedProperty) {
    version[property].forEach((element) => {
      element[nestedProperty] = _.uniqBy(element[nestedProperty], "key")
    })
  } else {
    version[property] = _.uniqBy(version[property], "key")
  }
}

module.exports = { sanitize, getCount, removeDuplicates, verifyCount }
