import sass from "sass";
import camelCase from "lodash.camelcase";

function constructSassString(variables) {
  const asVariables = variables
    .map(variable => `$${variable.name}: ${variable.value};`)
    .join("\n");
  const asClasses = variables
    .map(variable => `.${variable.name} { value: ${variable.value} }`)
    .join("\n");

  return `${asVariables}\n${asClasses}`;
}

export default function parseVariables(variables, opts = {}) {
  if (process.env.TEST_ENV) {
    return {};
  }
  const result = sass
    .renderSync({
      data: constructSassString(variables),
      outputStyle: "compressed"
    })
    .css.toString();

  const parsedVariables = (result.match(/\..+?}/g) || [])
    .filter(line => line && line.length)
    .map(variable => {
      const match = /(.+){value:(.+)}/.exec(variable);
      const [, name, value] = match;
      const obj = {};

      if (opts.preserveVariableNames) {
        obj[name.replace(/^\./, "")] = value;
        return obj;
      }

      obj[camelCase(name)] = value;
      return obj;
    })
    .filter(Boolean);

  if (!parsedVariables.length) {
    return {};
  }
  return Object.assign.apply(this, parsedVariables);
}
