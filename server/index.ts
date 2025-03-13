import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// API to fetch stock data with date filtering
app.get('/api/stock-data', async (req: Request, res: Response) => {
  try {
    const { range } = req.query; 

    let dateFilter: Date | undefined;

    if (range && range !== 'ALL') {
      const now = new Date();
      if (range === '1W') {
        dateFilter = new Date(now.setDate(now.getDate() - 7));
      } else if (range === '1M') {
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
      } else if (range === '3M') {
        dateFilter = new Date(now.setMonth(now.getMonth() - 3));
      } else if (range === '6M') {
        dateFilter = new Date(now.setMonth(now.getMonth() - 6));
      } else if (range === '1Y') {
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
      } else if (range === '2Y') {
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 2));
      }
    }

    const stockData = await prisma.stockData.findMany({
      where: {
        ...(dateFilter && { date: { gte: dateFilter } }),
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(stockData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});