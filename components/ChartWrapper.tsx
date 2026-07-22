// components/ChartWrapper.tsx
'use client';
import { useState } from 'react';
import CandlestickChart from './CandlestickChart';

export default function ChartWrapper({ data, coinId }) {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');

  return (
    <CandlestickChart
      data={data}
      coinId={coinId}
      liveInterval={liveInterval}
      setLiveInterval={setLiveInterval}
    />
  );
}
