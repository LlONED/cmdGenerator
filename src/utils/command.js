function validatePlaceholders(
  sourceString = "",
  placeholderValues = {
    id: "",
    count: 0,
    i: 0,
    prizeCount: 1,
    coinsDefault: 0,
    minutesPerPeriod: 1,
    onlineTime: 0,
    isEventHasTimeType: false,
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
      required: [
        "count",
        "prizeCount",
        "coinsDefault",
        "minutesPerPeriod",
        "onlineTime",
        "isEventHasTimeType",
      ],
      pattern: new RegExp("%count%", "g"),
      logic(
        str = "",
        count = 0,
        prizeCount = 1,
        coinsDefault = 0,
        minutesPerPeriod = 1,
        onlineTime = 0,
        isEventHasTimeType = false
      ) {
        if (isEventHasTimeType === true) {
          const minutes = onlineTime / 1000 / 60;
          return str.replace(
            this.pattern,
            Math.floor(minutes / minutesPerPeriod) * coinsDefault * prizeCount
          );
        }

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
  minutesPerPeriod,
  coinsDefault,
  isEventHasTimeType,
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
            minutesPerPeriod,
            coinsDefault,
            isEventHasTimeType,
            onlineTime: user.times.online,
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
        minutesPerPeriod,
        coinsDefault,
        isEventHasTimeType,
        onlineTime: user.times.online,
        i,
      })
    )
    .join(commandSeparator)}`;
}
