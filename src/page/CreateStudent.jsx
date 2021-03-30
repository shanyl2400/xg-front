import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, Radio, message, Select } from 'antd';
import IntentSubjectForm from '../component/IntentSubjectForm';
import NewIntentSubjects from '../component/NewIntentSubjects';
import options from '../component/address';
import OrderSourceForm from '../component/OrderSourceForm';
import AddressForm from '../component/AddressForm';
import { useHistory } from "react-router-dom";
import { listSubjectsAPI, createStudentAPI, listSubjectsTreeAPI } from '../api/api';

const { Option } = Select;
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};
let index = 0;
const { TextArea } = Input;

async function getSubjects() {
  let subjects = [];
  if (subjects.length < 1) {
    let rawSubjects = await listSubjectsAPI();
    for (let i = 0; i < rawSubjects.length; i++) {
      if (rawSubjects[i].level == 1) {
        subjects = subjects.concat({
          id: rawSubjects[i].id,
          parent_id: rawSubjects[i].parent_id,
          level: rawSubjects[i].level,
          name: rawSubjects[i].name,
          children: []
        })
      }
    }

    for (let i = 0; i < rawSubjects.length; i++) {
      if (rawSubjects[i].level == 2) {
        for (let j = 0; j < subjects.length; j++) {
          if (rawSubjects[i].parent_id == subjects[j].id) {
            subjects[j].children = subjects[j].children.concat({
              id: rawSubjects[i].id,
              parent_id: rawSubjects[i].parent_id,
              level: rawSubjects[i].level,
              name: rawSubjects[i].name,
            })
          }
        }
      }
    }
  }
  return subjects
}


function CreateStudent(props) {
  const [form] = Form.useForm();
  const onFinish = async values => {
    let address = form.getFieldValue("address");
    // let intentSubject = []
    let intentSubjects = form.getFieldValue("intentSubject");
    // for (let i = 0; i < intentSubjects.length; i++) {
    //   if (intentSubjects[i].value.indexOf("请选择") >= 0) {
    //     message.error('请选择报名意向');
    //     return;
    //   }
    //   intentSubject.push(intentSubjects[i].value);
    // }
    if (intentSubjects.length < 1) {
      message.error('请选择报名意向');
      return;
    }

    let res = await createStudentAPI({
      "name": form.getFieldValue("name"),
      "gender": form.getFieldValue("gender"),
      "telephone": form.getFieldValue("telephone"),
      "email": form.getFieldValue("email"),
      "address": address.region,
      "address_ext": address.ext,
      "intent_subject": intentSubjects,
      "note": form.getFieldValue("note"),
      "order_source_id": form.getFieldValue("order_source").order_source_id,
      "order_source_ext": form.getFieldValue("order_source").order_source_ext,
    })
    if (res.err_msg == "success") {
      switch (res.result.status) {
        case 1:
          //status 1 创建成功
          message.success('创建成功');
          break;
        case 2:
          //status 2 挑战失败
          message.warning('创建成功，挑战失败');
          break;
        case 3:
          //status 3 挑战成功
          message.success('创建成功，挑战成功');
          break;
        default:
          message.error('创建失败，未知状态');
      }

    } else {
      console.log(res);
      //创建失败
      message.error('创建失败:' + res.err_msg);
    }
    form.resetFields();
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const onCreateStudent = async () => {
    form.submit();
  }
  let history = useHistory();

  const onCreateOrder = values => {
    form.validateFields().then(async e => {
      let address = form.getFieldValue("address");
      // let intentSubject = []
      let intentSubjects = form.getFieldValue("intentSubject");
      // for (let i = 0; i < intentSubjects.length; i++) {
      //   if (intentSubjects[i].value.indexOf("请选择") >= 0) {
      //     message.error('请选择报名意向');
      //     return;
      //   }
      //   intentSubject.push(intentSubjects[i].value);
      // }
      if (intentSubjects.length < 1) {
        message.error('请选择报名意向');
        return;
      }
      let res = await createStudentAPI({
        "name": form.getFieldValue("name"),
        "gender": form.getFieldValue("gender"),
        "telephone": form.getFieldValue("telephone"),
        "email": form.getFieldValue("email"),
        "address": address.region,
        "address_ext": address.ext,
        "intent_subject": intentSubjects,
        "note": form.getFieldValue("note"),
        "order_source_id": form.getFieldValue("order_source").order_source_id,
        "order_source_ext": form.getFieldValue("order_source").order_source_ext,
      })
      if (res.err_msg == "success") {
        switch (res.result.status) {
          case 1:
            //status 1 创建成功
            message.success('创建成功');
            break;
          case 2:
            //status 2 挑战失败
            message.warning('创建成功，挑战失败，无法派单');
            break;
          case 3:
            //status 3 挑战成功
            message.success('创建成功，挑战成功');
            break;
          default:
            message.error('创建失败，未知状态，无法派单');
        }

      } else {
        console.log(res);
        //创建失败
        message.error('创建失败，无法派单:' + res.err_msg);
      }
      form.resetFields();
      if (res.result.status == 1 || res.result.status == 3) {
        console.log("ID:", res.result.id);
        // props.onCreateStudentOrder(res.result.id);
        history.push("/main/student_order/" + res.result.id);
      }

    }).catch(err => {
      console.log(err);
    });

  }

  const [formDatas, setSormDatas] = useState({
    // subjects: [],
    subjectsTree: [],
  })
  useEffect(() => {
    const fetchData = async () => {
      // const sub = await getSubjects();
      const subjectsTree = await listSubjectsTreeAPI();
      setSormDatas({
        // subjects: sub,
        subjectsTree: subjectsTree,
      });
    }
    fetchData();
  }, [])

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>学员管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加学生</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout}
        name="control-ref"
        style={{ marginTop: "30px", marginLeft: "-40px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        initialValues={{
          gender: true,
          intentSubject: [],
        }}>
        <Form.Item name="name" label="姓名" rules={[{ required: true }]} >
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true} >男</Radio>
            <Radio value={false}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="telephone" label="手机号" rules={[{ required: true }]} >
          <Input />
        </Form.Item>

        <Form.Item name="address" label="居住地址" rules={[{ required: true }]} >
          {/* <Cascader options={options} placeholder="请选择" /> */}
          <AddressForm />
        </Form.Item>

        <Form.Item name="email" label="电子邮箱" >
          <Input />
        </Form.Item>

        <Form.Item name="order_source" label="订单来源" rules={[{ required: true }]} >
          {/* <Select placeholder="请选择" style={{ width: 120 }} >
            {formDatas.orderSources.map((os) => (
              <Option key={os.is} value={os.id}>{os.name}</Option>
            ))}
          </Select> */}
          <OrderSourceForm />
        </Form.Item>

        <Form.Item name="intentSubject" label="报名意向" rules={[{ required: true }]}>
          {/* <IntentSubjectForm subjects={formDatas.subjects} /> */}
          <NewIntentSubjects subjects={formDatas.subjectsTree} />
        </Form.Item>

        <Form.Item name="note" label="备注" >
          <TextArea
            placeholder="请输入备注"
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>


        <Form.Item {...tailLayout}>
          <Button onClick={(values) => onCreateStudent(values)} htmlType="button">
            保存
          </Button>
          <Button type="primary" style={{ margin: '0 18px' }} onClick={(values) => onCreateOrder(values)} htmlType="button" >
            保存并派单
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateStudent;
