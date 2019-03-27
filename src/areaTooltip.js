export default function(settings, div, d) {
  const thisMonth = (d.date).substring(5, 7) ? i18next.t((d.date).substring(5, 7), {ns: "months"}) : null;
  const thisYear = d.date.substring(0, 4);

  const line1 = thisMonth ? `${i18next.t("hoverTitle", {ns: settings.ns})}, ${thisMonth} ${thisYear}: `:
        `${i18next.t("hoverTitle", {ns: settings.ns})}, ${d.date}: `;

  const keys = Object.keys(d);
  // remove unwanted keys
  keys.splice(keys.indexOf("date"), 1);
  if (keys.indexOf("total") !== -1) {
    keys.splice(keys.indexOf("total"), 1);
  }
  if (keys.indexOf("isLast") !== -1) {
    keys.splice(keys.indexOf("isLast"), 1);
  }

  const makeTable = function(line1) {
    const keyValues = [];
    for (let idx = 0; idx < keys.length; idx++) {
      const key = keys[idx];
      keyValues.push(settings.y.getText.call(settings, d, key));
    }

    let rtnTable = `<b>${line1}</b><br><br><table>`;
    for (let idx = 0; idx < keys.length; idx++) {
      rtnTable = rtnTable.concat(`<tr><td><b>${i18next.t(keys[idx], {ns: settings.ns})}</b>: ${keyValues[idx]}</td></tr>`);
    }
    rtnTable = rtnTable.concat("</table>");
    return rtnTable;
  };

  div.html(makeTable(line1))
      .style("opacity", .9)
      .style("left", ((d3.event.pageX + 10) + "px"))
      .style("top", ((d3.event.pageY + 10) + "px"))
      .style("pointer-events", "none");
}
