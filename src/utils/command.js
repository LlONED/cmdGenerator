function validatePlaceholders(
  sourceString = "",
  placeholderValues = {
    id: "",
    count: 0,
    i: 0,
    prizeCount: 1,
  }
) {
  const placeholders = [
    {
      desc: "%i<count>%",
      required: ["i"],
      pattern: new RegExp(/%i(\d)%/g),
      logic(str = "", i = 0) {
        return str.replace(this.pattern, (_, e) => (+e < i + 1 ? i + 1 : ""));
      },
    },
    {
      desc: "%user%",
      required: ["id"],
      pattern: new RegExp("%user%", "g"),
      logic(str = "", id = "") {
        return str.replace(this.pattern, id);
      },
    },
    {
      desc: "%count%",
      required: ["count", "prizeCount"],
      pattern: new RegExp("%count%", "g"),
      logic(str = "", count = 0, prizeCount = 1) {
        return str.replace(this.pattern, count * prizeCount);
      },
    },
  ];

  for (const placeholder of placeholders) {
    sourceString = placeholder.logic(
      sourceString,
      ...placeholder.required.map((el) => placeholderValues[el])
    );
  }

  return sourceString;
}

export function formatCommadResult({
  isCommandPersonal,
  commandSeparator,
  commandPattern,
  command,
  users,
}) {
  if (isCommandPersonal === true) {
    return users
      .map(
        (user, i) =>
          command +
          commandSeparator +
          validatePlaceholders(commandPattern, {
            id: user.id,
            count: user.coins,
            prizeCount: user.prizeCount,
            i,
          })
      )
      .join("\n")
      .trim();
  }

  return `${command} ${users
    .map((user, i) =>
      validatePlaceholders(commandPattern, {
        id: user.id,
        count: user.coins,
        prizeCount: user.prizeCount,
        i,
      })
    )
    .join(commandSeparator)}`;
}
