const { getCount } = require("./sanitize")
const { verifyCount } = require("./sanitize")
const { removeDuplicates } = require("./sanitize")

test("get array length for the provided property in obj", () => {
  const obj = { keyA: [1, 2, 3, 4, 5, 6, 7, 8], keyB: ["A", "B"] }
  expect(getCount(obj, "keyA")).toBe(8)
  expect(getCount(obj, "keyB")).toBe(2)
})

test("get count of the array for the provided property and nestedProperty", () => {
  const obj = {
    keyA: [1, 2, 3, 4, 5, { nestedKeyA: [1, 2, 3] }, 7, 8],
    keyB: ["A", "B", { nestedKeyB: ["A", "B", "C", "D"] }],
  }
  expect(getCount(obj, "keyA", "nestedKeyA")).toBe(3)
  expect(getCount(obj, "keyB", "nestedKeyB")).toBe(4)
})

test("compare value of property 'keyAs' against count in object", () => {
  const object = {
    keyA_count: 4,
    versions: [
      {
        keyAs: [1, 2, 3, 4],
      },
    ],
  }
  expect(verifyCount(object, "keyAs")).toBe(true)
})

test("compare value of nestedProperty 'nestedkeyBs' against count in object", () => {
  const object = {
    nestedKeyB_count: 8,
    versions: [
      {
        keyAs: [
          1,
          2,
          3,
          4,
          {
            nestedKeyBs: [1, 2, 3, 4, 5, 6, 7, 8],
          },
        ],
      },
    ],
  }
  expect(verifyCount(object, "keyAs", "nestedKeyBs")).toBe(true)
})

test("remove duplicates in property 'keyAs'", () => {
  const object = {
    keyAs: [
      {
        key: "1",
      },
      {
        key: "1",
      },
      {
        key: "2",
      },
      {
        key: "2",
      },
    ],
  }
  removeDuplicates(object, "keyAs")
  expect(object).toEqual({ keyAs: [{ key: "1" }, { key: "2" }] })
})

test("remove duplicates in nestedProperty 'nestedKeyAs'", () => {
  const object = {
    keyAs: [
      {
        nestedKeyBs: [
          {
            key: "1",
          },
          {
            key: "1",
          },
          {
            key: "2",
          },
          {
            key: "2",
          },
          {
            key: "3",
          },
        ],
      },
    ],
  }
  removeDuplicates(object, "keyAs", "nestedKeyBs")
  expect(object).toEqual({
    keyAs: [{ nestedKeyBs: [{ key: "1" }, { key: "2" }, { key: "3" }] }],
  })
})
