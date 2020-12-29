import { Col, Row, Select, Input } from "antd";
import React from "react";

const { Search } = Input;
let query = "";
function OrgFilter(props) {
    let handleChangeQuery = e => {
        query = e;
        props.onChangeFilter(e);
    }

    return (
        <div>
            <Row style={{ marginTop: 20, marginBottom: -10 }}>
                <Col offset={0}>
                    搜索： <Search
                        placeholder="请输入搜索内容"
                        onSearch={value => handleChangeQuery(value)}
                        style={{ width: 200 }}
                    />
                </Col>
            </Row>

        </div>
    );
}

export default OrgFilter;