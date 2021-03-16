const chartBox = document.getElementById("chart");
const context = chartBox.getContext("2d");

// const fillPattern = context.createPattern( )

fetchData()
  .then((data) => parsedData(data))
  .then((data) => mappedData(data))
  .then(({ years, temps, nHemTemps, sHemTemps }) =>
    drawing(years, temps, nHemTemps, sHemTemps)
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

function drawing(years, temps, nHemTemps, sHemTemps) {
  const myChart = new Chart(context, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: "Global Temperature Changing Dynamic",
          data: temps,
          fill: false,
          borderColor: "rgba(219, 32, 26, 1)",
          borderWidth: 2,
        },
        {
          label: "Northern Hemisphere Dynamic",
          data: nHemTemps,
          fill: false,
          borderColor: "rgba(0, 47, 255, 1)",
          borderWidth: 2,
        },
        {
          label: "Southern Hemisphere Dynamic",
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
