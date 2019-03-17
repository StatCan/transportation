export default function(settings, keys, div, d, line1, divFactor) {
  const makeTable = function(line1) {
    let keyValues = [];
    for (let idx = 0; idx < keys.length; idx++) {
      keyValues.push(Number(d[keys[idx]]) ? settings.formatNum.bind(settings)()(d[keys[idx]] / divFactor) : d[keys[idx]]);
    }

    let rtnTable = `<b>${line1}</b><br><br><table>`;
    for (let idx = 0; idx < keys.length; idx++) {
      rtnTable = rtnTable.concat(`<tr><td><b>${i18next.t(keys[idx], {ns: settings.ns})}</b>: ${keyValues[idx]}</td></tr>`);
    }
    rtnTable = rtnTable.concat(`</table>`);
    return rtnTable;
  }

  div.html(makeTable(line1))
    .style("opacity", .9)
    .style("left", ((d3.event.pageX + 10) + "px"))
    .style("top", ((d3.event.pageY + 10) + "px"))
    .style("pointer-events", "none");
}
