import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function importCSV() {
  const csvFilePath = './data/data.csv'; 

  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ delimiter: ',', columns: true }));

  for await (const record of parser) {
    await prisma.stockData.create({
      data: {
        co_code: record.co_code,
        date: new Date(record.date),
        open: parseFloat(record.open),
        high: parseFloat(record.high),
        low: parseFloat(record.low),
        close: parseFloat(record.close),
        mcap: parseFloat(record.mcap),
        volume: parseInt(record.volume, 10),
      },
    });
  }

  console.log('CSV data imported successfully!');
  await prisma.$disconnect();
}

importCSV().catch((e) => {
  console.error(e);
  process.exit(1);
});