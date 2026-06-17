import http from 'node:http';
import { routeSkygridRequest, handleVercelRequest } from './lib/skygrid-runtime.mjs';

export default handleVercelRequest;

const isDirectRun = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isDirectRun) {
  const port = Number.parseInt(process.env.PORT || '3000', 10);

  const server = http.createServer(async (req, res) => {
    try {
      const response = await routeSkygridRequest({
        method: req.method,
        url: req.url,
        headers: req.headers || {}
      });

      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      res.writeHead(500, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      });
      res.end(JSON.stringify({
        ok: false,
        service: 'SKYGRID Emergency Data On-Ramp',
        error: 'runtime_exception',
        message: error instanceof Error ? error.message : String(error)
      }, null, 2));
    }
  });

  server.listen(port, () => {
    console.log(`SKYGRID Emergency Data On-Ramp runtime listening on http://localhost:${port}`);
  });
}
