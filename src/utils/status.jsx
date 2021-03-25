
import React from 'react';
import { Tag } from 'antd';

import { StopOutlined, CheckCircleOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

export function getOrderStatus(status) {
  switch (status) {
    case 1:
      return "未报名";
    case 2:
      return "已报名";
    case 3:
      return "已退学";
    case 4:
      return "无效订单";
    case 5:
      return "交定金";
    case 6:
      return "考虑中";
  }
  return "未知";
}

export function getStudentStatus(status) {
  switch (status) {
    case 1:
      return <Tag color="green" key={1}>已创建</Tag>;
    case 2:
      return <Tag color="red" key={1}>无效</Tag>;
    case 3:
      return <Tag color="green" key={1}>有效</Tag>;
    default:
      return <Tag color="yellow" key={1}>未知</Tag>;
  }
}

export function getOrgStatus(status) {
  switch (status) {
    case 1:
      return "待审核";
    case 2:
      return "合作中";
    case 3:
      return "黑名单";
    case 4:
      return "黑名单";
    case 5:
      return "已过期";
    default:
      return "未知";
  }
}


export function getConflictStatus(status) {
  switch (status) {
    case 1:
      return <Tag color="red" key={1}>待处理</Tag>;
    case 2:
      return <Tag color="green" key={2}>已处理</Tag>;
    default:
      return <Tag color="yellow" key={3}>未知</Tag>;
  }
}
export function getPaymentStatus(status) {
  switch (status) {
    case 1:
      return "待审核";
    case 2:
      return "已通过";
    case 3:
      return "已驳回";
    default:
      return "未知";
  }
}

export function getPaymentStatusTags(status) {
  switch (status) {
    case 1:
      return <Tag icon={<InfoCircleOutlined />} color="blue">待审核</Tag>;
    case 2:
      return <Tag icon={<CheckCircleOutlined />} color="green">已通过</Tag>;
    case 3:
      return <Tag icon={<StopOutlined />} color="red">已驳回</Tag>;
    default:
      return <Tag icon={<QuestionCircleOutlined />} color="orange">未知</Tag>;
  }

}