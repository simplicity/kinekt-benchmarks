async function runBenchmark(port: number) {
  const requestInit: RequestInit = {
    body: JSON.stringify({ email: "some@email.com" }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const target = 49;

  const start = performance.now();
  const result = await fetch(
    `http://localhost:${port}/${target}/${target}`,
    requestInit
  );
  const end = performance.now();

  const responseBody = await result.json();

  if (responseBody.email !== "some@email.com") {
    throw new Error("Unexpected response body");
  }

  return end - start;
}

async function run() {
  const benchmarks = [
    { framework: "oak", port: 3001 },
    { framework: "fastify", port: 3003 },
    { framework: "kinekt", port: 3000 },
    { framework: "expressjs", port: 3002 },
  ];

  const numberOfRuns = 1000;
  const results: { framework: string; averageSpeed: number }[] = [];

  for (const item of benchmarks) {
    try {
      await runBenchmark(item.port);
    } catch {
      console.log(
        `Unable to reach ${item.framework} at port ${item.port} - skipping`
      );
      continue;
    }

    let total = 0;

    for (let index = 0; index < numberOfRuns; index++) {
      total += await runBenchmark(item.port);
    }

    const averageSpeed = total / numberOfRuns;
    results.push({ framework: item.framework, averageSpeed });
  }

  // Sort results in ascending order by average speed
  results.sort((a, b) => a.averageSpeed - b.averageSpeed);

  // Table header
  const frameworkColumn = "Framework".padEnd(15);
  const speedColumn = "Average Speed".padStart(15);
  console.log(`${frameworkColumn}${speedColumn}`);
  console.log("=".repeat(30));

  // Log sorted results in table format
  for (const result of results) {
    const framework = result.framework.padEnd(15);
    const averageSpeed = `${result.averageSpeed.toFixed(3)} ms`.padStart(15);
    console.log(`${framework}${averageSpeed}`);
  }

  console.log("=".repeat(30));
}

run();
