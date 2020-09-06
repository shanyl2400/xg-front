import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
function XGLine(props)  {
  // const data = [
  //   {
  //     month: '1月',
  //     value: 3,
  //   },
  //   {
  //       month: '2月',
  //     value: 4,
  //   },
  //   {
  //       month: '3月',
  //     value: 3.5,
  //   },
  //   {
  //       month: '4月',
  //     value: 5,
  //   },
  //   {
  //       month: '5月',
  //     value: 4.9,
  //   },
  //   {
  //       month: '6月',
  //     value: 6,
  //   },
  //   {
  //       month: '7月',
  //     value: 7,
  //   },
  //   {
  //       month: '8月',
  //     value: 9,
  //   },
  //   {
  //       month: '9月',
  //     value: 13,
  //   },
  //   {
  //       month: '10月',
  //     value: 13,
  //   },
  //   {
  //       month: '11月',
  //     value: 20,
  //   },
  //   {
  //       month: '12月',
  //     value: 18,
  //   },
  // ];
  const config = {
   
    padding: 'auto',
    forceFit: true,
    data: props.data,
    xField: 'month',
    yField: 'value',
    smooth: true,
  };
  return <Line style={{ height: 240, width: "100%", marginTop:30 }} {...config} />;
};
export default XGLine;