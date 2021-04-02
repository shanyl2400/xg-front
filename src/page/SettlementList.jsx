import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, message, Row, Col, Pagination } from 'antd';
import { listSettlementsAPI } from '../api/api';
import { formatDate } from '../utils/date';
import { showTotal } from '../utils/page';
import SettlementViewModel from '../component/SettlementViewModel';

const pageSize = 10;
let pageIndex = 1;
function SettlementList(props) {
    const columns = [
        {
            title: '起始时间',
            dataIndex: 'start_at',
            key: 'start_at',
            render: date => (
                <span>
                    {formatDate(new Date(Date.parse(date)))}
                </span>
            )
        },
        {
            title: '截至时间',
            dataIndex: 'end_at',
            key: 'end_at',
            render: date => (
                <span>
                    {formatDate(new Date(Date.parse(date)))}
                </span>)
        },
        {
            title: '操作人',
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: '销售额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '佣金',
            dataIndex: 'commission',
            key: 'commission',
        },
        {
            title: '是否结算',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <span>
                    {status == 1 ? "否" : "是"}
                </span>)
        },
        {
            title: '是否开票',
            dataIndex: 'invoice',
            key: 'invoice',
            render: invoice => (
                <span>
                    {invoice == "" ? "否" : "是"}
                </span>)
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span>
                    <a onClick={() => doView(record)}>详情</a>
                </span>)
        }
    ];

    let [settlements, setSettlements] = useState([])
    let [total, setTotal] = useState(0)
    let [settlementViewModelInfo, setSettlementViewModelInfo] = useState({
        visible: false,
    });

    const doView = (record) => {
        setSettlementViewModelInfo({
            visible: true,
            record: record
        });
    }
    const closeViewMode = () => {
        setSettlementViewModelInfo({
            visible: false,
        })
    }
    const fetchData = async e => {
        let res = await listSettlementsAPI(e, pageSize);
        if (res.err_msg == "success") {
            setSettlements(res.settlements);
            setTotal(res.total);
        } else {
            message.error("获取用户列表失败，", res.err_msg);
            return
        }
    }
    useEffect(() => {
        fetchData();
    }, []);
    let handleChangePage = (page) => {
        pageIndex = page;
        fetchData(pageIndex);
    }
    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>结算管理</Breadcrumb.Item>
                <Breadcrumb.Item>结算列表</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                pagination={false}
                style={{ marginTop: "30px" }}
                columns={columns}
                dataSource={settlements}
            />
            <Pagination
                showSizeChanger={false}
                onChange={handleChangePage}
                style={{ textAlign: "right", marginTop: 10 }}
                defaultPageSize={pageSize}
                size="small"
                showTotal={showTotal}
                total={total} />
            <Row>
                <Col span={14}>
                </Col>
            </Row>

            <SettlementViewModel
                visible={settlementViewModelInfo.visible}
                record={settlementViewModelInfo.record}
                closeModel={closeViewMode}
            />
        </div>
    );
}

export default SettlementList;
