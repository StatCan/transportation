export default function(yearId, monthId, dateRange, selectedYear, selectedMonth, months) {
  const yearDropdown = $(yearId);

  // date dropdown creation
  yearDropdown.empty();

  for (let i = Number(dateRange.min.substring(0, 4)); i<=(Number(dateRange.max.substring(0, 4))); i++) {
    yearDropdown.append($("<option></option>")
        .attr("value", i).html(i));
  }
  d3.select(yearId)._groups[0][0].value = selectedYear;

  if (months) {
    const maxMonth = Number(dateRange.max.substring(5, 7));
    const maxYear = Number(dateRange.max.substring(0, 4));

    // Disable months in dropdown menu that do not exist for selectedYear
    if (Number(selectedYear) === maxYear) {
      $(`${monthId} > option`).each(function() {
        if (Number(this.value) > maxMonth) {
          this.disabled = true;
        }
      });
      const currentMonth = Number(d3.select(monthId)._groups[0][0].value);

      if (currentMonth > maxMonth ) {
        selectedMonth = dateRange.max.substring(5, 7)
        d3.select(monthId)._groups[0][0].value = selectedMonth;
      }
    } else {
      // Enable all months
      d3.selectAll(`${monthId} > option`).property("disabled", false);
    }
  }
  return selectedMonth;
}
