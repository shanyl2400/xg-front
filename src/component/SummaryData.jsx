import React, { useState } from 'react';


function SummaryData(props) {
    return (
      <div style={{textAlign:"center", width: 200, height:160, display:"inline-block", padding:"10px", border:"1px #aaa solid", margin:"20px 20px"}}>
        <h3 style={{marginTop:20, fontSize:14, color:"#666"}}>{props.title}</h3>
        <h3 style={{marginTop:20, fontSize:26, color:"#111"}}>{props.data}</h3>
      </div>
    )
  }
  export default SummaryData;