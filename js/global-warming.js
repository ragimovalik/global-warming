const chartBoxFirst = document.getElementById("chart1");
const context = chartBoxFirst.getContext("2d");

const chartBoxSecond = document.getElementById("chart2");
const contextFiltered = chartBoxSecond.getContext("2d");

fetchData()
  .then((data) => parsedData(data))
  .then((data) => mappedData(data))
  .then(({ years, temps, nHemTemps, sHemTemps }) =>
    drawing(years, temps, nHemTemps, sHemTemps, context)
  )
  .catch((error) => console.log(error));

fetchData()
  .then((data) => parsedData(data))
  .then((data) => mappedData(data))
  .then(({ years, temps, nHemTemps, sHemTemps }) =>
    yearsFilter(years, temps, nHemTemps, sHemTemps)
  )
  .then(
    ({ filteredYears, filteredTemps, filteredNorthHemi, filteredSouthHemi }) =>
      drawing(
        filteredYears,
        filteredTemps,
        filteredNorthHemi,
        filteredSouthHemi,
        contextFiltered
      )
  )
  .catch((error) => console.log(error));

async function fetchData() {
  const res = await fetch("./data/ZonAnn.Ts+dSST.csv");
  return await res.text();
}

function parsedData(data) {
  return Papa.parse(data, {
    encoding: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;
}

function mappedData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.temps.push(entry.Glob + 14);
      acc.nHemTemps.push(entry.NHem + 14);
      acc.sHemTemps.push(entry.SHem + 14);
      return acc;
    },
    {
      years: [],
      temps: [],
      nHemTemps: [],
      sHemTemps: [],
    }
  );
}

function yearsFilter(years, temps, nHemTemps, sHemTemps) {
  const newGraph = {
    filteredYears: years.filter((el, idx) => idx > 100),
    filteredTemps: temps.filter((el, idx) => idx > 100),
    filteredNorthHemi: nHemTemps.filter((el, idx) => idx > 100),
    filteredSouthHemi: sHemTemps.filter((el, idx) => idx > 100),
  };
  return newGraph;
}

function drawing(years, temps, nHemTemps, sHemTemps, ctx) {
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: "Global Temperature",
          data: temps,
          fill: false,
          borderColor: "rgba(219, 32, 26, 1)",
          borderWidth: 2,
        },
        {
          label: "Northern Hemisphere",
          data: nHemTemps,
          fill: false,
          borderColor: "rgba(0, 47, 255, 1)",
          borderWidth: 2,
        },
        {
          label: "Southern Hemisphere",
          data: sHemTemps,
          fill: false,
          borderColor: "rgba(255, 230, 1, 1)",
        },
      ],
    },
    options: {
      legend: {
        labels: {
          fontColor: "black",
        },
      },

      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              fontColor: "black",
              callback(value, index, values) {
                return value + " ℃";
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "black",
            },
          },
        ],
      },
    },
  });
}
