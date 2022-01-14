import getVariables from "../src/get-variables";
import parseVariables from "../src/parse-variables";

describe("without comments", function () {
  const sass =
    "$gray-base: #000 !default;\n$gray-darker: lighten($gray-base, 13.5%) !default; // #222\n$gray-dark: lighten($gray-base, 20%) !default;  // #333\n$gray:  lighten($gray-base, 33.5%) !default; // #555\n$gray-light:  lighten($gray-base, 46.7%) !default; // #777\n$gray-lighter:  lighten($gray-base, 93.5%) !default; // #eee";
  const variables = getVariables(sass);

  describe("getVariables()", function () {
    it("should return an array with 6 items", function () {
      expect(variables).toBeArray();
      expect(variables).toHaveLength(6);
    });
  });

  describe("parseVariables()", function () {
    it("should return an object with the key grayBase", function () {
      const result = parseVariables(variables);
      expect(result).toBeObject();
      expect(result).toContainKey("grayBase");
    });
  });

  describe("parseVariables({ preserveVariableNames: true })", function () {
    it("should return an object with the key gray-base", function () {
      const result = parseVariables(variables, { preserveVariableNames: true });
      expect(result).toBeObject();
      expect(result).toContainKey("gray-base");
    });
  });
});

describe("with comments", function () {
  const sass = `$one: 123;
$x: $one;
// $y: $two; // ERROR - $two not existed, but it's commented`;
  const variables = getVariables(sass);

  describe("getVariables()", function () {
    it("should return an array with 2 items", function () {
      expect(variables).toBeArray();
      expect(variables).toHaveLength(2);
    });
  });

  describe("parseVariables()", function () {
    it("should return an object with the key one", function () {
      const result = parseVariables(variables);
      expect(result).toBeObject();
      expect(result).toContainKey("one");
    });
    it("should not return an object with the key y", function () {
      const result = parseVariables(variables);
      expect(result).toBeObject();
      expect(result).not.toContainKey("y");
    });
  });
});

describe(".sass format", function () {
  const sass = `$one: 123
$x: $one
`;
  const variables = getVariables(sass);

  describe("getVariables()", function () {
    it("should return an array with 2 items", function () {
      expect(variables).toBeArray();
      expect(variables).toHaveLength(2);
    });
  });

  describe("parseVariables()", function () {
    it("should return an object with the key one", function () {
      const result = parseVariables(variables);
      expect(result).toBeObject();
      expect(result).toContainKey("one");
    });
  });
});

describe("empty sass-file", function () {
  describe("getVariables()", function () {
    function testFn() {
      const sass = "";
      return parseVariables(getVariables(sass));
    }

    it("should not throw", function () {
      expect(testFn).not.toThrowError(TypeError);
    });

    it("should be an empty object", function () {
      const variables = testFn();
      expect(variables).toBeObject();
      expect(Object.keys(variables)).toHaveLength(0);
    });
  });
});

describe("sass-file with only new-lines", function () {
  describe("getVariables()", function () {
    function testFn() {
      const sass = `
      
      `;
      return parseVariables(getVariables(sass));
    }

    it("should not throw", function () {
      expect(testFn).not.toThrowError(TypeError);
    });

    it("should be an empty object", function () {
      const variables = testFn();
      expect(variables).toBeObject();
      expect(Object.keys(variables)).toHaveLength(0);
    });
  });
});
