
import React from 'react';
import { Tag } from 'antd';

export function getOrderStatus(status){
    switch(status){
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
    }
    return "未知";
}

export function getStudentStatus(status) {
    // StudentCreated = iota + 1
    // StudentConflictFailed
    // StudentConflictSuccess
    switch (status) {
      case 1:
        return <Tag color="green" key={1}>已创建</Tag>;
      case 2:
        return <Tag color="red" key={1}>冲单失败</Tag>;
      case 3:
        return <Tag color="yellow" key={1}>冲单成功</Tag>;
    }
  }

export function getOrgStatus(status){
    switch(status){
      case 1:
        return "未审核";
      case 2:
        return "已认证";
      case 3:
        return "已吊销";
      default:
        return "未知";
    }
  }
export function getPaymentStatus(status){
  switch(status){
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