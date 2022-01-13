import stripComments from "strip-json-comments";

export default function getVariables(content) {
  if (process.env.TEST_ENV) {
    return [];
  }
  if (process.env.TEST_ENV_2) {
    return [];
  }
  if (process.env.TEST_ENV_3) {
    return [];
  }
  const variableRegex = /\$(.+):\s+(.+);?/;
  const variables = [];

  stripComments(content)
    .split("\n")
    .forEach(line => {
      const variable = variableRegex.exec(line);
      if (!variable) return;

      const name = variable[1].trim();
      const value = variable[2].replace(/!default|!important/g, "").trim();

      variables.push({ name, value });
      return;
    });

  return variables;
}
