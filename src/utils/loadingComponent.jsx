import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';

//通用的过场组件
const loadingComponent = () => {
    return (
        <div>
            <Spin style={{
                position: "absolute",
                top: 50,
                right: 0,
                left: 0,
                bottom: 0,
                margin: "auto"
            }}
                tip="加载中..." />
        </div>
    )
}

//过场组件默认采用通用的，若传入了loading，则采用传入的过场组件
export default (loader, loading = loadingComponent) => {
    return Loadable({
        loader,
        loading
    });
}
