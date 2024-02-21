import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => {
  console.log('Endpoint hit:', req.body);
  res.send('Request received');
});

export default router;
