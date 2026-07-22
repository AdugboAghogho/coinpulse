'use client';

import { useState } from 'react';
import CandlestickChart from './CandlestickChart';

interface ChartWrapperProps {
  data: any[]; // Replace 'any[]' with 'OHLCData[]' if exported in your types
  coinId: string;
  children?: React.ReactNode;
}

export default function ChartWrapper({ data, coinId, children }: ChartWrapperProps) {
  // Manage the state here on the client side
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');

  return (
    <CandlestickChart
      data={data}
      coinId={coinId}
      liveInterval={liveInterval}
      setLiveInterval={setLiveInterval}
    >
      {children}
    </CandlestickChart>
  );
}
