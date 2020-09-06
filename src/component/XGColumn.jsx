import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
function XGColumn(props)  {
  // const data = [
  //   {
  //     month: '1月',
  //     value: 50000,
  //   },
  //   {
  //     month: '2月',
  //     value: 35000,
  //   },
  //   {
  //     month: '3月',
  //     value: 25000,
  //   },
  //   {
  //     month: '4月',
  //     value: 15000,
  //   },
  //   {
  //     month: '5月',
  //     value: 8500,
  //   },
  //   {
  //     month: '6月',
  //     value: 2568,
  //   },
  //   {
  //     month: '7月',
  //     value: 3569,
  //   },
  //   {
  //     month: '8月',
  //     value: 4522,
  //   },
  //   {
  //     month: '9月',
  //     value: 3568,
  //   },
  //   {
  //     month: '10月',
  //     value: 2154,
  //   },
  //   {
  //     month: '11月',
  //     value: 2358,
  //   },
  //   {
  //     month: '12月',
  //     value: 1250,
  //   },
  // ];
  const config = {
    forceFit: true,
    data: props.data,
    padding: 'auto',
    xField: 'month',
    yField: 'value',
    // conversionTag: { visible: true },
  };
  return <Column style={{ height: 240, width: "100%", marginTop:30 }} {...config} />;
};
export default XGColumn;