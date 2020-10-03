const { initialize } = require("unleash-client");
const { execSync } = require("child_process");
describe("client", () => {
  beforeAll(async () => {
    // in case it's already running
    execSync("docker-compose down -v", { stdio: "inherit" });
    execSync("npm run dev:shared-secret -- -d", { stdio: "inherit" });
    execSync(
      `sh -c "
    echo 'waiting for service'
    while ! nc -z localhost 5432; do
      echo \\"$(date) service is unavailable.\\"
      sleep 1
    done
    sleep 2
    echo 'service ready\n\n'"`,
      { stdio: "inherit" }
    );
  });

  describe("Unauthorized", () => {
    it("should return an error", async () =>
      new Promise((resolve, reject) => {
        const instance = initialize({
          url: "http://localhost:4242/",
          appName: "integration-test",
          instanceId: "integration",
        });

        // optional events
        instance.on("error", (error) => {
          expect(error.message).toContain("401");
          resolve();
        });
        instance.on("ready", reject);
      }));
  });
  afterAll(() => {
    execSync("docker-compose logs > test.log", { stdio: "inherit" });
    // execSync("docker-compose down", { stdio: "inherit" });
  });
});
