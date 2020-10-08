import React, { useState } from 'react';
import { Modal, Row, Col, Button, message } from 'antd';
import { addOrderMarkAPI} from '../api/api';
import TextArea from 'antd/lib/input/TextArea';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function AddMarkModel(props) {

    let [value, setValue] = useState("");
    let onCancel = () => {
        props.closeModel();
    }
    let onSubmit = async () => {
        console.log(value);
        let res = await addOrderMarkAPI(props.id, value)
        if(res.err_msg == "success"){
            message.success("添加回访成功");
            props.closeModel();
            props.refreshData();
        }else{
            message.error("添加回访失败，" + res.err_msg);
        }
    }
    let changeValue = e => {
        setValue(e.target.value);
    }
    return (
        <Modal
            title="回访订单"
            visible={props.visible}
            footer={null}
        >
                <Row gutter={[16, 16]}>
                <TextArea
                    value={value}
                    onChange={changeValue}
                    placeholder="请填写回访信息"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Row>

            <Row style={{marginTop:30}}>
                <Col offset={15} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onSubmit} type="primary">提交</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default AddMarkModel;
