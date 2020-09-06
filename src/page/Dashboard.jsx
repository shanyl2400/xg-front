
import React, { useState, useEffect } from 'react';
import SummaryData from '../component/SummaryData';
import XGColumn from '../component/XGColumn';
import XGLine from '../component/XGLine';
import { getStatisticsSummaryAPI, getStatisticsGraphAPI } from '../api/api';
import { message } from 'antd';

function Dashboard(props) {
    
    let [summaryData, setSummaryData] = useState({performance_total: 0, orgs_total: 0, students_total: 0, success_rate: 0});
    let [graphData, setGraphData] = useState({performances_graph:[], students_graph:[]})
    useEffect(() => {
        const fetchData = async () => {
          let res = await getStatisticsSummaryAPI();
          if(res.err_msg == "success") {
            setSummaryData(res.summary);
          }else {
            message.warning("获取统计信息失败：" + res.err_msg);
            return;
          }

          let res0 = await getStatisticsGraphAPI();
          if(res0.err_msg == "success") {
            setGraphData({
                performances_graph: res0.graph.performances_graph,
                students_graph: res0.graph.students_graph
            })
          }else {
            message.warning("获取统计信息失败：" + res0.err_msg);
            return;
          }
        }
        fetchData();
      }, []);


    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <SummaryData title="总业绩" data={"￥" + summaryData.performance_total}/>
            <SummaryData title="总名单量" data={summaryData.students_total}/>
            <SummaryData title="机构数量" data={summaryData.orgs_total}/>
            <SummaryData title="成功率" data={summaryData.success_rate / 100 + "%"}/>

            <h3 style={{marginTop:30}}>学员名单</h3>
            <div style={{height:240}}>
                <XGColumn data={graphData.students_graph} />
            </div>
            
            <h3 style={{marginTop:30}}>业绩</h3>
            <div style={{height:240}}>
                <XGLine data={graphData.performances_graph}/>
            </div>
        </div>
    );
}
export default Dashboard;